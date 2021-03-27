/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-expressions */
import mqtt from 'mqtt';
import dotenv from 'dotenv';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import chaisAsPromised from 'chai-as-promised';
import { MQTTOptions } from './types';
import { createMQTTListener } from '.';
import { createLogger } from '../../logger';
import { createCommandInterpreter } from '../interpreter';
import { CommandInterpreter, CommandTypes, TopicCommand } from '../interpreter/types';

describe('Tests the MQTT Listener', () => {
  dotenv.config();
  chai.use(chaisAsPromised);
  const logger = createLogger({ level: 'silent', outputFile: 'log.txt' });
  let loggerSpy: sinon.SinonSpy;
  let commandInterpreter: CommandInterpreter;
  let commandInterpreterStub: sinon.SinonStub;

  const mqttOtptions: MQTTOptions = {
    url: process.env.MQTT_URL ?? '',
    username: process.env.MQTT_USERNAME ?? '',
    password: process.env.MQTT_PASSWORD ?? ''
  };

  beforeEach(() => {
    // Spy on error method to know when errors were thown in the mqtt sub event handlers
    loggerSpy = sinon.spy(logger, 'error');
    commandInterpreter = createCommandInterpreter();
    commandInterpreterStub = sinon.stub(commandInterpreter, 'run');
  });

  afterEach(() => {
    loggerSpy.restore();
  });

  // Requires an MQTT Broker for tests to run
  it('Should Connect to an MQTT Broker', async () => {
    const mqttListener = createMQTTListener(mqttOtptions, commandInterpreter, logger);
    await mqttListener.connect();
    expect(mqttListener.connect()).to.eventually.be.fulfilled;
  });

  it('Should be able to subscribe to topic, receive an event and pass it to the commandInterpeter (if command is valid)', async () => {
    const mqttClient = mqtt.connect(mqttOtptions.url, {
      username: mqttOtptions.username,
      password: mqttOtptions.password
    });

    await new Promise(res => {
      mqttClient.on('connect', () => {
        res(null);
      });
    });

    const topicCommands: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            command: 'setdefaultsounddevice',
            type: 'nircmd' as CommandTypes.NIRCMD,
            extraArgument: ' 1',
            expectedPayloads: ['Headphones', 'Speakers']
          }
        ]
      }
    ];

    // Create our mqtt listener to fire off an paylod on a topic
    const mqttListener = createMQTTListener(mqttOtptions, commandInterpreter, logger);
    await mqttListener.connect();
    mqttListener.subscribeTopicsForInterpreters(topicCommands);

    // Publish an event of the topic and payload
    const payload = topicCommands[0].commands[0].expectedPayloads[0];
    const { topic } = topicCommands[0];

    mqttClient.publish(topic, payload);

    // Need to wait until the published command gets received
    await new Promise(res => setTimeout(res, 100));

    // Check the command interpreter stub to make sure its called with proper data
    // This confirm that we successfully subscribed to the topic
    expect(commandInterpreterStub.args[0]).to.have.members([topicCommands[0].commands[0], payload]);
  });

  it('Should be able to subscribe to topic, receive an event and fail due to payload not in expectedPayloads', async () => {
    const mqttClient = mqtt.connect(mqttOtptions.url, {
      username: mqttOtptions.username,
      password: mqttOtptions.password
    });

    await new Promise(res => {
      mqttClient.on('connect', () => {
        res(null);
      });
    });

    const topicCommands: TopicCommand[] = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            command: 'setdefaultsounddevice',
            type: 'nircmd' as CommandTypes.NIRCMD,
            extraArgument: ' 1',
            expectedPayloads: ['Headphones', 'Speakers']
          }
        ]
      }
    ];

    // Create our mqtt listener to fire off an paylod on a topic
    const mqttListener = createMQTTListener(mqttOtptions, commandInterpreter, logger);
    await mqttListener.connect();
    mqttListener.subscribeTopicsForInterpreters(topicCommands);

    // Publish an event of the topic and payload
    const { expectedPayloads } = topicCommands[0].commands[0];
    const payload = 'someInvalidPayload';
    const { topic } = topicCommands[0];

    mqttClient.publish(topic, payload);

    // Need to wait until the published command gets received
    await new Promise(res => setTimeout(res, 100));

    // No way to check if error thrown inside subscription event handler
    // so we make sure the logger was called with the correct error message
    expect(loggerSpy.args[0][0]).to.equal(
      `No expectedPayloads match on Topic: ${topic} Payload: ${payload} | Expected Payloads: ${expectedPayloads}`
    );
  });
});
