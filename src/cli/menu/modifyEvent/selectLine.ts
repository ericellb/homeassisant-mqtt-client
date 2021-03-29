import inquirer from 'inquirer';
import { Command } from '../../../server/interpreter/types';

/**
 * menu to select which lines of chosen event to edit
 * @param event
 * @returns keyof the line's Command object, or exit command '__exit__'
 */
const selectLineMenu = async (event: Command) => {
  const answer: { commandType: keyof Command | '__exit__' } = await inquirer.prompt({
    type: 'list',
    name: 'commandType',
    choices: () => {
      const choices: { name: string; value: keyof Command | '__exit__'; short: string }[] = [];

      const keys = Object.keys(event);
      // add optional keys
      const allKeys = [...new Set([...keys, 'extraArgument'])];

      allKeys.forEach(key => {
        choices.push({
          name: `${key}: ${event[key as keyof Command]?.toString() || ''}`,
          value: key as keyof Command,
          short: key
        });
      });
      choices.push({
        name: 'Exit...',
        value: '__exit__',
        short: 'Exit'
      });
      return choices;
    },
    message: 'Select which key to edit...'
  });
  return answer;
};

export default selectLineMenu;
