import { CommandTypes } from '../../server/interpreter/types';

export const validateType = (input: string) => {
  if (input === CommandTypes.APPLICATION || input === CommandTypes.NIRCMD) {
    return true;
  }
  return 'Error: unknown type';
};
