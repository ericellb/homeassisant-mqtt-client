/* eslint-disable no-unused-expressions */
import chai from 'chai';
import { describe, it } from 'mocha';
import chaiAsPromised from 'chai-as-promised';
import { CommandTypes, TopicCommand } from '../server/interpreter/types';
import addEvent from './menu/addEvent';
import registeredEvents from './menu/registeredEvents';
import modifyEvent from './menu/modifyEvent';
import { setup } from './menu/config/setup';
import deleteEvent from './menu/deleteEvent';

const bddStdin = require('bdd-stdin');

describe('Tests the CLI', () => {
  chai.should();
  chai.use(chaiAsPromised);
  setup();

  it('should get registered events', async () => {
    const data: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            path: 'C:\\Windows\\System32\\calc.exe',
            type: 'application' as CommandTypes.APPLICATION,
            expectedPayloads: ['open calculator', 'calculator', 'open the calculator']
          }
        ]
      }
    ];

    const fakeGetData = () => data;
    const promise = registeredEvents(fakeGetData);

    return promise.should.eventually.eql([
      {
        path: 'C:\\Windows\\System32\\calc.exe',
        type: 'application' as CommandTypes.APPLICATION,
        expectedPayloads: ['open calculator', 'calculator', 'open the calculator'],
        topic: 'cmnd/computer'
      }
    ]);
  });

  it('should not crash if topicCommands.json data file does not exist when getting registered events', async () => {
    const promise = registeredEvents();
    promise.should.eventually.not.be.null;
  });

  it('should save data when add new event', () => {
    const fakeData: TopicCommand[] = [];

    const getDataMock = async () => fakeData;
    const writeDataMock = (out: TopicCommand[]) => out;

    const topic = 'cmnd/computer';
    const commandType = 'application';
    const filePath = 'test.exe';
    const extraArgument = '';
    const payloadOptions = 'one,two,three';
    const confirm = 'yes';

    bddStdin(topic, '\n', commandType, '\n', filePath, '\n', extraArgument, '\n', payloadOptions, '\n', confirm, '\n');
    const dataWithNewEvent = addEvent(getDataMock, writeDataMock);

    return dataWithNewEvent.should.eventually.eql([
      {
        topic,
        commands: [
          {
            path: filePath,
            type: commandType as CommandTypes.APPLICATION,
            expectedPayloads: payloadOptions.split(','),
            extraArgument
          }
        ]
      }
    ]);
  });

  it('should append command to topic when add new event sets topic that already exists ', () => {
    const fakeCommand = {
      path: 'C:\\Windows\\System32\\calc.exe',
      type: 'application' as CommandTypes.APPLICATION,
      expectedPayloads: ['open calculator', 'calculator', 'open the calculator']
    };
    const fakeData: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [fakeCommand]
      }
    ];

    const getDataMock = async () => fakeData;
    const writeDataMock = (out: TopicCommand[]) => out;

    const topic = 'cmnd/computer';
    const commandType = 'application';
    const filePath = 'test.exe';
    const extraArgument = '';
    const payloadOptions = 'one,two,three';
    const confirm = 'yes';

    bddStdin(topic, '\n', commandType, '\n', filePath, '\n', extraArgument, '\n', payloadOptions, '\n', confirm, '\n');
    const dataWithNewEvent = addEvent(getDataMock, writeDataMock);

    return dataWithNewEvent.should.eventually.eql([
      {
        topic,
        commands: [
          fakeCommand,
          {
            path: filePath,
            type: commandType as CommandTypes.APPLICATION,
            expectedPayloads: payloadOptions.split(','),
            extraArgument
          }
        ]
      }
    ]);
  });

  it('should create new topic command when add new event creates a new topic', () => {
    const fakeData: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            path: 'C:\\Windows\\System32\\calc.exe',
            type: 'application' as CommandTypes.APPLICATION,
            expectedPayloads: ['open calculator', 'calculator', 'open the calculator']
          }
        ]
      }
    ];

    const getDataMock = async () => fakeData;
    const writeDataMock = (out: TopicCommand[]) => out;

    const topic = 'cmnd/other';
    const commandType = 'application';
    const filePath = 'test.exe';
    const extraArgument = '';
    const payloadOptions = 'one,two,three';
    const confirm = 'yes';

    bddStdin(topic, '\n', commandType, '\n', filePath, '\n', extraArgument, '\n', payloadOptions, '\n', confirm, '\n');
    const dataWithNewEvent = addEvent(getDataMock, writeDataMock);

    return dataWithNewEvent.should.eventually.eql([
      ...fakeData,
      {
        topic,
        commands: [
          {
            path: filePath,
            type: commandType as CommandTypes.APPLICATION,
            expectedPayloads: payloadOptions.split(','),
            extraArgument
          }
        ]
      }
    ]);
  });

  it('add new event should forbid reuse of already used payloads', async () => {
    const fakeData: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            command: 'setdefaultsounddevice',
            type: 'nircmd' as CommandTypes.NIRCMD,
            expectedPayloads: ['Headphones', 'Speakers']
          }
        ]
      }
    ];

    const getDataMock = async () => fakeData;
    const writeDataMock = (out: TopicCommand[]) => out;

    const topic = 'cmnd/other';
    const commandType = 'application';
    const filePath = 'soundprogramexample.exe';
    const extraArgument = '';
    const payloadOptions = ['Headphones', 'Turn on headphones'];
    const payload = payloadOptions.toString();
    const confirm = 'yes';

    bddStdin(topic, '\n', commandType, '\n', filePath, '\n', extraArgument, '\n', payload, '\n', confirm, '\n');
    const dataWithNewEvent = addEvent(getDataMock, writeDataMock);

    return dataWithNewEvent.should.eventually.eql([
      ...fakeData,
      {
        topic,
        commands: [
          {
            path: filePath,
            type: commandType as CommandTypes.APPLICATION,
            expectedPayloads: [payloadOptions[1]],
            extraArgument
          }
        ]
      }
    ]);
  });

  it('add new event should not write to file when confirm is negative', () => {
    const fakeData: TopicCommand[] = [];
    const getDataMock = async () => fakeData;
    const writeDataMock = (out: TopicCommand[]) => out;

    const topic = 'cmnd/other';
    const commandType = 'application';
    const filePath = 'shouldntsave.exe';
    const extraArgument = '';
    const payloadOptions = ['Headphones'];
    const payload = payloadOptions.toString();
    const confirm = 'no';

    bddStdin(topic, '\n', commandType, '\n', filePath, '\n', extraArgument, '\n', payload, '\n', confirm, '\n');
    const dataWithNewEvent = addEvent(getDataMock, writeDataMock);

    return dataWithNewEvent.should.eventually.be.undefined;
  });

  it('should modify events', () => {
    const fakeData: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            path: 'C:\\Windows\\System32\\calc.exe',
            type: 'application' as CommandTypes.APPLICATION,
            expectedPayloads: ['open calculator', 'calculator', 'open the calculator']
          }
        ]
      }
    ];
    const getDataMock = async () => fakeData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const writeDataMock = async (data: TopicCommand[]) => {};

    const topic = 'cmnd/computer';
    const whichEvent = ''; // select first and press enter
    const downKey = bddStdin.keys.down;
    const editLine = 'editedLine';
    const confirm = 'yes';

    bddStdin(
      topic,
      '\n',
      whichEvent,
      '\n',
      downKey,
      downKey,
      downKey,
      '\n',
      editLine,
      '\n',
      downKey,
      downKey,
      downKey,
      downKey,
      '\n',
      confirm,
      '\n'
    );
    const modifiedData = modifyEvent(getDataMock, writeDataMock);

    return modifiedData.should.eventually.eql([
      {
        topic: 'cmnd/computer',
        commands: [
          {
            path: 'C:\\Windows\\System32\\calc.exe',
            type: 'application' as CommandTypes.APPLICATION,
            expectedPayloads: ['open calculator', 'calculator', 'open the calculator'],
            extraArgument: editLine
          }
        ]
      }
    ]);
  });

  it('modify event: path key should change to command key when type is modified from path to nircmd command', () => {
    const fakeData: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            type: 'application' as CommandTypes.APPLICATION,
            path: 'C:\\Windows\\System32\\calc.exe',
            expectedPayloads: ['open calculator', 'calculator', 'open the calculator']
          }
        ]
      }
    ];
    const getDataMock = async () => fakeData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const writeDataMock = async (data: TopicCommand[]) => {};

    const topic = 'cmnd/computer';
    const whichEvent = ''; // select first and press enter
    const downKey = bddStdin.keys.down;
    const editLine = 'nircmd';
    const confirm = 'yes';

    bddStdin(
      topic,
      '\n',
      whichEvent,
      '\n',
      '',
      '\n',
      editLine,
      '\n',
      downKey,
      downKey,
      downKey,
      downKey,
      '\n',
      confirm,
      '\n'
    );
    const modifiedData = modifyEvent(getDataMock, writeDataMock);

    return modifiedData.should.eventually.eql([
      {
        topic: 'cmnd/computer',
        commands: [
          {
            command: 'C:\\Windows\\System32\\calc.exe',
            type: 'nircmd' as CommandTypes.NIRCMD,
            expectedPayloads: ['open calculator', 'calculator', 'open the calculator']
          }
        ]
      }
    ]);
  });

  it('should delete events', () => {
    const fakeData: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            path: 'C:\\Windows\\System32\\calc.exe',
            type: 'application' as CommandTypes.APPLICATION,
            expectedPayloads: ['open calculator', 'calculator', 'open the calculator']
          }
        ]
      }
    ];

    const getDataMock = async () => fakeData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const writeDataMock = async (data: TopicCommand[]) => {};

    const topic = ''; // first topic in list
    const event = ''; // first event in list
    const confirm = 'yes';

    bddStdin(topic, '\n', event, '\n', confirm, '\n');
    const dataWithNewEvent = deleteEvent(getDataMock, writeDataMock);

    return dataWithNewEvent.should.eventually.be.undefined;
  });
});
