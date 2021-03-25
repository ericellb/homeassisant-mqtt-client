import inquirer from 'inquirer';
import addEvent from './addEvent';
import registeredEvents from './registeredEvents';
import { setup } from './config/setup';
import modifyEvent from './modifyEvent';
import deleteEvent from './deleteEvent';

const choices = {
  registeredEvents: 'Show registered events',
  addEvent: 'Add new event',
  modifyEvent: 'Modify existing event',
  deleteEvent: 'Delete event'
};

const root = () => {
  inquirer.prompt({
    type: 'list',
    name: 'root',
    message: 'Main Menu. Select one of the following options:',
    choices: Array.from(Object.values(choices)),
    prefix: '',
  }).then(async selection => {
    switch (selection.root) {
      case choices.registeredEvents:
        await registeredEvents();
        break;
      case choices.addEvent:
        await addEvent();
        break;
      case choices.modifyEvent:
        await modifyEvent();
        break;
      case choices.deleteEvent:
        await deleteEvent();
        break;
      default:
        console.log('unrecognized selection');
    }
    root();
  });
};

export const init = () => {
  console.log(
    '\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\n'
  + '| Home Assistant MQTT Client CLI |\n'
  + '/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\\n');

  setup();
  root();
};

export default root;
