import inquirer from 'inquirer';
import registeredEvents from './registeredEvents';

const choices = {
  registeredEvents: 'Show registered events',
  eventLog: 'Show event log',
  newEvent: 'Add new event',
  modifyEvent: 'Modify existing event',
  deleteEvent: 'Delete event'
};

const deleteEvent = () => {
  inquirer.prompt({
    type: 'list',
    name: 'deleteEvent',
    message: 'Home Assistant MQTT Client CLI',
    choices: Array.from(Object.values(choices)),
    prefix: ''
  }).then(selection => {
    switch (selection.deleteEvent) {
      case choices.registeredEvents:
        registeredEvents();
        break;
      default:
        console.log('default');
    }
  });
};

export default deleteEvent;
