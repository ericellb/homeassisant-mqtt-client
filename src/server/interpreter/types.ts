// eslint-disable-next-line no-unused-vars
export type Implements<T, U extends T> = {};

export interface ApplicationCommand {
  path: string;
  type: string;
  expectedPayloads: string[];
}

export interface AudioCmdletCommand {
  command: string;
  type: string;
  expectedPayloads: string[];
}

export type Command = ApplicationCommand | AudioCmdletCommand;

export interface CommandInterpreter {
  run(command: Command, payload: string): Promise<void>;
}

export interface TopicCommand {
  topic: string;
  commands: Command[];
}
