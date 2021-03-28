import { TopicCommand } from '../../server/interpreter/types';
import { getData } from '../helpers/data';

const registeredEvents = async (getDataFn?: () => TopicCommand[]) => {
  const jsonData = getDataFn ? getDataFn() : await getData();

  const events = jsonData
    .map(topicCommands => {
      return topicCommands.commands.map(command => ({
        ...command,
        topic: topicCommands.topic
      }));
    })
    .flat();

  console.table(events);
  return events;
};

export default registeredEvents;
