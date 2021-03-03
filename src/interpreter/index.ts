import { execSync } from 'child_process';
import { buildOpenAppliationCommand, buildOutputDeviceCommand } from './commandBuilders';
import { Command } from './types';

export const createCommandInterpreter = () => {
  const run = (command: Command, payload: string) => {
    let builtCommand = '';

    switch (command.command) {
      case 'setdefaultsounddevice':
        builtCommand = buildOutputDeviceCommand(command.command, payload);
        break;
      case 'C:\\Windows\\System32\\calc.exe':
        builtCommand = buildOpenAppliationCommand(command.command);
        break;
      case 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Valheim\\Valheim.exe':
        builtCommand = buildOpenAppliationCommand(command.command);
        break;
      default:
        builtCommand = '';
        break;
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
