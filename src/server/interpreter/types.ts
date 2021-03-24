export enum CommandKeys {
  COMMAND = 'command',
  PATH = 'path',
  TYPE = 'type',
  EXPECTED_PAYLOADS = 'expectedPayloads',
  EXTRA_ARGUMENT = 'extraArgument'
}

export interface ApplicationCommand {
  [CommandKeys.PATH]: string;
  [CommandKeys.TYPE]: string;
  [CommandKeys.EXPECTED_PAYLOADS]: string[];
  [CommandKeys.EXTRA_ARGUMENT]?: string;
}

export interface NircmdCommand {
  [CommandKeys.COMMAND]: string;
  [CommandKeys.TYPE]: string;
  [CommandKeys.EXPECTED_PAYLOADS]: string[];
  [CommandKeys.EXTRA_ARGUMENT]?: string;
}

export type Command = ApplicationCommand | NircmdCommand;

export interface CommandInterpreter {
  run(command: Command, payload: string): void;
}

export interface TopicCommand {
  topic: string;
  commands: Command[];
}

export enum CommandTypes {
  AUDIO_CMDLET = 'audioCmdlet',
  APPLICATION = 'application'
}
