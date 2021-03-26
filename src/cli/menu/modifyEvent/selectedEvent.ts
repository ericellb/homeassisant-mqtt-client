import inquirer, { Separator } from 'inquirer';
import { Command, CommandTypes, TopicCommand } from '../../../server/interpreter/types';

/**
 * Menu to select which event to modify
 * @param topics
 * @param data
 * @returns Event command object to modify
 */
const selectedEventMenu = async (data: TopicCommand[]): Promise<{ event: Command; topic: string }> => {
  const topics = data.map(topicCommand => topicCommand.topic);

  return inquirer.prompt([
    {
      type: 'list',
      name: 'topic',
      message: 'Select topic of event to modify...',
      choices: topics
    },
    {
      type: 'list',
      name: 'event',
      message: 'Select which event to modify...',
      loop: false,
      choices: answers => {
        const topicCommand = data.find(tc => tc.topic === answers.topic) as TopicCommand;
        const options = topicCommand.commands.map(command => {
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
            name: `${choice}\n  payloads: ${command.expectedPayloads.toString()}${
              command.extraArgument ? `\n  extra argument: ${command.extraArgument}` : ''
            }`,
            value: command,
            short: 'selected'
          };
        });

        const optionsWithSeparators = options
          .map(option => {
            return [option, new Separator()];
          })
          .flat();

        return optionsWithSeparators;
      }
    }
  ]);
};
export default selectedEventMenu;
