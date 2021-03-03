import mqtt from 'mqtt';
import dotenv from 'dotenv';
import sinon from 'sinon';
import { MQTTOptions } from './types';
import { expect } from 'chai';
import { createMQTTListener } from '.';
import { createLogger } from '../logger';
import { createCommandInterpreter } from '../interpreter';

describe.only('Tests the MQTT Listener', () => {
  dotenv.config();
  const logger = createLogger({ level: 'silent' });
  let loggerSpy: sinon.SinonSpy;

  const mqttOtptions: MQTTOptions = {
    url: process.env.MQTT_URL ?? '',
    username: process.env.MQTT_USERNAME ?? '',
    password: process.env.MQTT_PASSWORD ?? ''
  };

  beforeEach(() => {
    loggerSpy = sinon.spy(logger, 'error');
  });

  afterEach(() => {
    loggerSpy.restore();
  });

  // Requires an MQTT Broker for tests to run
  it('Should Connect to an MQTT Broker', done => {
    const mqttClient = mqtt.connect(mqttOtptions.url, {
      username: mqttOtptions.username,
      password: mqttOtptions.password
    });

    mqttClient.on('connect', () => {
      expect(mqttClient.connected).to.be.true;
      mqttClient.end();
      done();
    });
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

    const topicCommands = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            command: 'setdefaultsounddevice',
            type: 'nircmd',
            extraArgument: ' 1',
            expectedPayloads: ['Headphones', 'Speakers']
          }
        ]
      }
    ];

    // Create and stub the command interpeter to check if its called with right arguments
    const commandInterpreter = createCommandInterpreter();
    const commandInterpreterStub = sinon.stub(commandInterpreter, 'run');

    // Create our mqtt listener to fire off an paylod on a topic
    const mqttListener = createMQTTListener(mqttClient, commandInterpreter, logger);
    mqttListener.subscribeTopicsForInterpreters(topicCommands);

    // Publish an event of the topic and payload
    const payload = topicCommands[0].commands[0].expectedPayloads[0];
    const topic = topicCommands[0].topic;

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

    const topicCommands = [
      {
        topic: 'cmnd/computer',
        commands: [
          {
            command: 'setdefaultsounddevice',
            type: 'nircmd',
            extraArgument: ' 1',
            expectedPayloads: ['Headphones', 'Speakers']
          }
        ]
      }
    ];

    // Create and stub the command interpeter to check if its called with right arguments
    const commandInterpreter = createCommandInterpreter();
    const commandInterpreterStub = sinon.stub(commandInterpreter, 'run');

    // Create our mqtt listener to fire off an paylod on a topic
    const mqttListener = createMQTTListener(mqttClient, commandInterpreter, logger);
    mqttListener.subscribeTopicsForInterpreters(topicCommands);

    // Publish an event of the topic and payload
    const expectedPayloads = topicCommands[0].commands[0].expectedPayloads;
    const payload = 'someInvalidPayload';
    const topic = topicCommands[0].topic;

    mqttClient.publish(topic, payload);

    // Need to wait until the published command gets received
    await new Promise(res => setTimeout(res, 100));

    // Check the command interpreter stub to make sure its called with proper data
    // This confirm that we successfully subscribed to the topic
    expect(commandInterpreterStub.called).to.be.false;
    expect(loggerSpy.args[0][0]).to.equal(
      `No expectedPayloads match on Topic: ${topic} Payload: ${payload} | Expected Payloads: ${expectedPayloads}`
    );
  });
});
