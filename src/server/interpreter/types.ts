export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export enum CommandTypes {
  APPLICATION = 'application',
  NIRCMD = 'nircmd'
}

export interface ApplicationCommand {
  path: string;
  type: CommandTypes.APPLICATION;
  expectedPayloads: string[];
  extraArgument?: string;
}

export interface AudioCmdletCommand {
  command: string;
  type: CommandTypes.NIRCMD;
  expectedPayloads: string[];
  extraArgument?: string;
}

export type Command = ApplicationCommand | AudioCmdletCommand;

export interface CommandInterpreter {
  run(command: Command, payload: string): Promise<void>;
}

export interface TopicCommand {
  topic: string;
  commands: Command[];
}
