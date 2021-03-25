export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export enum CommandTypes {
  AUDIO_CMDLET = 'audioCmdlet',
  APPLICATION = 'application',
  NIRCMD = 'nircmd'
}

export interface ApplicationCommand {
  path: string;
  type: CommandTypes.APPLICATION;
  expectedPayloads: string[];
  extraArgument?: string;
}

export interface NircmdCommand {
  command: string;
  type: CommandTypes.NIRCMD;
  expectedPayloads: string[];
  extraArgument?: string;
}

export type Command = ApplicationCommand | NircmdCommand;

export interface CommandInterpreter {
  run(command: Command, payload: string): void;
}

export interface TopicCommand {
  topic: string;
  commands: Command[];
}
