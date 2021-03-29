import inquirer from 'inquirer';
import { Command, CommandTypes } from '../../../server/interpreter/types';
import { validateType } from '../../helpers/validator';

/**
 * Menu to edit specific lines of chosen event
 *
 * @param event Command event to modify
 * @param key keyof command to modify
 * @returns edited value of event[key]
 */
const editLinesMenu = async (event: Command, key: keyof Command) => {
  const edited: { editedLine: string | string[] } = await inquirer.prompt({
    type: 'autocomplete',
    name: 'editedLine',
    message: 'Make desired changes to event key and press enter',
    suggestOnly: true,
    source: async () => {
      if (key === 'expectedPayloads') {
        return [event[key].toString()];
      }
      if (key === 'type') {
        return [CommandTypes.APPLICATION, CommandTypes.NIRCMD];
      }
      return [event[key] ?? ''];
    },
    validate: input => {
      if (key === 'type') {
        return validateType(input);
      }
      if (key !== 'extraArgument' && input === '') {
        return false;
      }

      return true;
    },
    filter: (input: string) => {
      if (key === 'expectedPayloads') {
        const payloads = input.split(',');
        const trimmedPayloads = payloads.map(payload => payload.trim());
        return trimmedPayloads;
      }

      // save with double backslashes
      input.replace(/\\/g, '\\\\');
      return input;
    }
  });
  return edited;
};

export default editLinesMenu;
