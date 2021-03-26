import { TopicCommand } from '../../server/interpreter/types';
import { asyncReadFile, asyncWriteFile } from './fs';

export const getData = async () => {
  const rawData = await asyncReadFile(`${__dirname}/../../topicCommands.json`);
  const jsonData = JSON.parse(rawData.toString()) as TopicCommand[];
  console.log(jsonData[0].commands);
  return jsonData;
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

export const getEvents = async () => {
  const data = await getData();
  const events = convertDataToEventFormat(data);
  return events;
};
