import inquirer from 'inquirer';
import { CommandTypes, TopicCommand } from '../../../server/interpreter/types';
import { getData, writeData } from '../../helpers/data';
import editLinesMenu from './editLines';
import selectedEventMenu from './selectedEvent';
import selectLineMenu from './selectLine';

const modifyEvent = async () => {
  const data = await getData();

  const selectedEvent = await selectedEventMenu(data);
  let modifiedEvent = { ...selectedEvent.event };

  let { commandType: keyToEdit } = await selectLineMenu(modifiedEvent);
  while (keyToEdit !== '__exit__') {
    // eslint-disable-next-line no-await-in-loop
    const { editedLine } = await editLinesMenu(modifiedEvent, keyToEdit);

    if (keyToEdit === 'type') {
      if (editedLine !== modifiedEvent.type) {
        if (modifiedEvent.type === CommandTypes.APPLICATION) {
          const { path, ...withoutPath } = modifiedEvent;
          modifiedEvent = { ...withoutPath, type: CommandTypes.NIRCMD, command: path };
        } else {
          const { command, ...withoutCommand } = modifiedEvent;
          modifiedEvent = { ...withoutCommand, type: CommandTypes.APPLICATION, path: command };
        }
      }
    } else if ((keyToEdit as string) === 'path' && modifiedEvent.type === CommandTypes.APPLICATION) {
      modifiedEvent.path = editedLine as string;
    } else if ((keyToEdit as string) === 'command' && modifiedEvent.type === CommandTypes.NIRCMD) {
      modifiedEvent.command = editedLine as string;
    } else if (keyToEdit === 'expectedPayloads') {
      modifiedEvent.expectedPayloads = editedLine as string[];
    } else if (keyToEdit === 'extraArgument') {
      modifiedEvent.extraArgument = editedLine as string;
    }

    // eslint-disable-next-line no-await-in-loop
    keyToEdit = (await selectLineMenu(modifiedEvent)).commandType;
  }

  const { confirmed } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmed',
    message: () => {
      console.log('Modifying event to be: ', modifiedEvent);
      return 'Is this correct?';
    }
  });

  if (!confirmed) {
    return;
  }

  const otherTopicCommands = data.filter(topicCommand => topicCommand.topic !== selectedEvent.topic);

  const commands = (data.find(tc => tc.topic === selectedEvent.topic) as TopicCommand).commands.map(c => {
    if (
      ((selectedEvent.event.type === CommandTypes.APPLICATION &&
        c.type === CommandTypes.APPLICATION &&
        c.path === selectedEvent.event?.path) ||
        (selectedEvent.event.type === CommandTypes.NIRCMD &&
          c.type === CommandTypes.NIRCMD &&
          c.command === selectedEvent.event.command)) &&
      selectedEvent.event.expectedPayloads === c.expectedPayloads &&
      selectedEvent.event.extraArgument === c.extraArgument
    ) {
      return modifiedEvent;
    }
    return c;
  });

  // combine updated topicCommand and otherTopicCommands
  const updatedTopicCommand = { topic: selectedEvent.topic, commands };
  const newData = commands.length < 1 ? otherTopicCommands : [...otherTopicCommands, updatedTopicCommand];
  await writeData(newData);
};

export default modifyEvent;
