// eslint-disable-next-line no-unused-vars
export type Implements<T, U extends T> = {};

export interface ApplicationCommand {
  path: string;
  type: string;
  expectedPayloads: string[];
  extraArgument?: string;
}

export interface NircmdCommand {
  command: string;
  type: string;
  expectedPayloads: string[];
  extraArgument?: string;
}

export type Command = ApplicationCommand | NircmdCommand;

export interface TopicCommand {
  topic: string;
  commands: Command[];
}
