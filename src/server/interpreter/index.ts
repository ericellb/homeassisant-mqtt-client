import { execSync } from 'child_process';
import { buildOpenAppliationCommand, buildNircmdCommand } from './commandBuilders';
import { ApplicationCommand, Command, NircmdCommand } from './types';

export const createCommandInterpreter = () => {
  const run = (command: Command, payload: string) => {
    let builtCommand = '';

    if (command.type === 'application') {
      const applicationCommand = command as ApplicationCommand;
      builtCommand = buildOpenAppliationCommand(applicationCommand.path);
    }

    if (command.type === 'nircmd') {
      const nircmdCommand = command as NircmdCommand;
      builtCommand = buildNircmdCommand(nircmdCommand.command, payload);
    }

    if (!builtCommand || builtCommand === '') {
      return;
    }

    execSync(builtCommand);
  };

  return {
    run
  };
};
