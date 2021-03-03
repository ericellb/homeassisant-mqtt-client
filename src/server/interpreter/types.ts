// eslint-disable-next-line no-unused-vars
export type Implements<T, U extends T> = {};

export interface Command {
  command: string;
  type: string;
  expectedPayloads: string[];
  extraArgument?: string;
}

export interface TopicCommand {
  topic: string;
  commands: Command[];
}
