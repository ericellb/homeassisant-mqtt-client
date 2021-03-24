import { TopicCommand } from '../../server/interpreter/types';
import { asyncReadFile } from '../helpers/fs';

const registeredEvents = async () => {
  const rawData = await asyncReadFile(`${__dirname}/../../topicCommands.json`);
  const jsonData = JSON.parse(rawData.toString()) as TopicCommand[];

  const events = jsonData.map(topicCommands => {
    return topicCommands.commands.map(command => ({
      ...command,
      topic: topicCommands.topic
    }));
  }).flat();

  console.table(events);
};

export default registeredEvents;
