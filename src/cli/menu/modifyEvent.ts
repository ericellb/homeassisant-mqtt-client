import inquirer from 'inquirer';
import registeredEvents from './registeredEvents';
import root from './root';

const choices = {
  registeredEvents: 'Show registered events',
  eventLog: 'Show event log',
  newEvent: 'Add new event',
  modifyEvent: 'Modify existing event',
  deleteEvent: 'Delete event'
};

const modifyEvent = () => {
  inquirer.prompt({
    type: 'list',
    name: 'modifyEvent',
    message: 'Home Assistant MQTT Client CLI',
    choices: Array.from(Object.values(choices)),
    prefix: ''
  }).then(selection => {
    switch (selection.modifyEvent) {
      case choices.registeredEvents:
        registeredEvents();
        break;
      default:
        root();
        console.log('default');
    }
  });
};

export default modifyEvent;
