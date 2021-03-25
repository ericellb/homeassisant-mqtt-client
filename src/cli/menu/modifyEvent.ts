import inquirer from 'inquirer';
import { Command, CommandTypes, TopicCommand } from '../../server/interpreter/types';
import { getData, writeData } from '../helpers/data';

interface Answers {
  topic: string;
  event: Command;
  confirmed: boolean;
}

const modifyEvent = async () => {
  const data = await getData();
  const topics = data.map(topicCommand => topicCommand.topic);

  const selected: Answers = await inquirer.prompt([{
    type: 'list',
    name: 'topic',
    message: 'Select topic of event to delete...',
    choices: topics,
  },
  {
    type: 'rawlist',
    name: 'event',
    message: 'Select which event to delete...',
    loop: false,
    choices: answers => {
      const topicCommand = data.find(tc => tc.topic === answers.topic) as TopicCommand;
      const option = topicCommand.commands.map(command => {
        let choice = '';
        console.log('type', command.type);
        switch (command.type) {
          case CommandTypes.APPLICATION:
            choice += `path:  ${command.path}`;
            break;
          case CommandTypes.NIRCMD:
            choice += `command:  ${command.command}`;
            break;
          default:
            choice += 'unknown type...';
            break;
        }
        return {
          name: `${choice}\n     payloads: ${command.expectedPayloads.toString()}${command.extraArgument ? `\n     extra argument: ${command.extraArgument}` : ''}`,
          value: command,
          short: choice
        };
      });

      return option;
    }
  }, {
    type: 'confirm',
    name: 'confirmed',
    message: (answers: Answers) => {
      console.log('Deleting the following event: ', { topic: answers.topic, command: answers.event });
      return 'Is this correct?';
    }
  }]);

  // not confirmed, return to main menu
  if (!selected.confirmed) {
    return;
  }

  const otherTopicCommands = data.filter(topicCommand => topicCommand.topic !== selected.topic);

  const dataCopy = data.slice();
  const commands = (dataCopy.find(tc => tc.topic === selected.topic) as TopicCommand).commands
    .filter(c =>
      !(
        ((selected.event.type === CommandTypes.APPLICATION && c.type === CommandTypes.APPLICATION && c.path === selected.event?.path)
          || (selected.event.type === CommandTypes.NIRCMD && c.type === CommandTypes.NIRCMD && c.command === selected.event.command))
          && selected.event.expectedPayloads === c.expectedPayloads
          && selected.event.extraArgument === c.extraArgument
      )
    );

  // combine updated topicCommand and otherTopicCommands
  const updatedTopicCommand = { topic: selected.topic, commands };
  const newData = commands.length < 1 ? otherTopicCommands : [...otherTopicCommands, updatedTopicCommand];
  await writeData(newData);
};

export default modifyEvent;
