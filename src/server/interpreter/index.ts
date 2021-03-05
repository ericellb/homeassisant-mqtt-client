/* eslint-disable dot-notation */
import { execSync } from 'child_process';
import { createAudioDeviceCmdletsIntegration } from '../integrations/audioDeviceCmdlets';
import { buildOpenAppliationCommand } from './commandBuilders';
import { ApplicationCommand, Command, CommandInterpreter, AudioCmdletCommand } from './types';

export const createCommandInterpreter = (exec: typeof execSync = execSync): CommandInterpreter => {
  const audioCmdlet = createAudioDeviceCmdletsIntegration();

  const run = async (command: Command, payload: string) => {
    let builtCommand = '';

    if (command.type === 'application') {
      const applicationCommand = command as ApplicationCommand;
      builtCommand = buildOpenAppliationCommand(applicationCommand.path);
    }

    // Possible create multiple interpreters to avoid tons of if statements in here?
    if (command.type === 'audioCmdlet') {
      const audioCmdletCommand = command as AudioCmdletCommand;
      if (audioCmdletCommand.command === 'setDefaultAudioDevice') {
        return audioCmdlet.setDefaultAudioDevice(payload);
      }
      if (audioCmdletCommand.command === 'setDefaultAudioDeviceVolume') {
        return audioCmdlet.setDefaultAudioDeviceVolume(parseFloat(payload));
      }
      if (audioCmdletCommand.command === 'setDefaultAudioDeviceMuteState') {
        return audioCmdlet.setDefaultAudioDeviceMuteState(Boolean(payload));
      }
    }

    if (!builtCommand || builtCommand === '') {
      return;
    }

    exec(builtCommand);
  };

  return {
    run
  };
};
