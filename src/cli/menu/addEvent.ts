import inquirer from 'inquirer';
import { AutocompleteQuestionOptions } from 'inquirer-autocomplete-prompt';
import { Command, CommandTypes, TopicCommand } from '../../server/interpreter/types';
import { getEvents } from '../helpers/data';
import { filterPayload } from '../helpers/filter';

const search = (input: string | undefined, list: string[]) => {
  if (input === undefined) {
    return Promise.resolve(list);
  }

  const matches = list
    .map(topic => (topic.includes(input) ? topic : undefined))
    .filter((topic): topic is string => !!topic);
  return Promise.resolve(matches);
};

const addEvent = async (getData: () => Promise<TopicCommand[]>, writeData: (data: TopicCommand[]) => any) => {
  const events = await getEvents(getData);

  const topics = events.map(event => event.topic);
  const uniqueTopics = Array.from(new Set(topics));

  const payloadOptions = events.map(event => event.expectedPayloads).flat();
  const uniquePayloadOptions = Array.from(new Set(payloadOptions));

  const questions: AutocompleteQuestionOptions[] | inquirer.QuestionCollection = [
    {
      type: 'autocomplete',
      name: 'topic',
      message: 'What is the topic name?',
      suggestOnly: true,
      source: (answersSoFar: inquirer.Answers, input: string | undefined) => search(input, uniqueTopics),
      validate: input => input !== ''
    },
    {
      type: 'list',
      name: 'type',
      message: 'What is the command type?',
      choices: Object.values(CommandTypes)
    },
    {
      type: 'input',
      name: 'path',
      message: 'What is the file path of the executable to launch?',
      when: (answers: any) => answers.type === 'application',
      validate: input => input !== ''
    },
    {
      type: 'input',
      name: 'command',
      message: 'What is the command to execute?',
      when: (answers: any) => answers.type === 'nircmd',
      validate: input => input !== ''
    },
    {
      type: 'input',
      name: 'extraArgument',
      message: 'Enter an extra argument (optional)'
    },
    {
      type: 'autocomplete',
      name: 'expectedPayloads',
      message: 'What are the payload options? Must be unique. Separate with commas.',
      suggestOnly: true,
      validate: input => {
        if (input !== '' && !uniquePayloadOptions.find(payload => payload === input)) {
          return true;
        }
        return 'Enter something! The payloads must be unique.';
      },
      source: (answersSoFar, input) => search(input, uniquePayloadOptions),
      filter: (input: string) => filterPayload(input, uniquePayloadOptions)
    }
  ];

  const answers = (await inquirer.prompt(questions)) as Command & { topic: string };

  console.log('\nAdding new event:', answers);
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Is this correct?'
    }
  ]);

  if (confirmed) {
    console.log('Added the following event:', answers);
  } else {
    console.log('Event not added. Returning to main menu.');
    return;
  }

  // rewrite the json file
  const newJsonData: TopicCommand[] = [];
  const allUniqueTopics = Array.from(new Set([...uniqueTopics, answers.topic]));
  const allEvents = [...events, answers];
  allUniqueTopics.forEach(topic => {
    const eventsThisTopic = allEvents
      .filter(event => event.topic === topic)
      .map(event => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { topic: unusedTopic, ...eventWithoutTopic } = event;
        return eventWithoutTopic;
      });

    newJsonData.push({ topic, commands: eventsThisTopic });
  });

  await writeData(newJsonData);
  return newJsonData;
};

export default addEvent;
