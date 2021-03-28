import { TopicCommand } from '../../server/interpreter/types';
import { asyncReadFile, asyncWriteFile } from './fs';

export const getData = async () => {
  try {
    const file = `${__dirname}/../../topicCommands.json`;
    const rawData = await asyncReadFile(file);
    const jsonData = JSON.parse(rawData.toString()) as TopicCommand[];
    return jsonData;
  } catch (err) {
    console.log('data file could not be found');
    return [];
  }
};

export const writeData = async (data: TopicCommand[]) => {
  await asyncWriteFile(`${__dirname}/../../topicCommands.json`, JSON.stringify(data, null, 2));
};

export const convertDataToEventFormat = (data: TopicCommand[]) => {
  const events = data
    .map(topicCommands => {
      return topicCommands.commands.map(command => ({
        ...command,
        topic: topicCommands.topic
      }));
    })
    .flat();
  return events;
};

export const getEvents = async (getDataFn: () => Promise<TopicCommand[]>) => {
  const data = await getDataFn();
  const events = convertDataToEventFormat(data);
  return events;
};
