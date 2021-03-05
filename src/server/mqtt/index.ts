import mqtt, { MqttClient } from 'mqtt';
import { CustomLogger } from '../../logger';
import { CommandInterpreter, TopicCommand } from '../interpreter/types';
import { MQTTOptions } from './types';

export const createMQTTListener = (opts: MQTTOptions, commandInterpreter: CommandInterpreter, logger: CustomLogger) => {
  let mqttClient: MqttClient;

  const connect = async (): Promise<void> => {
    mqttClient = mqtt.connect(opts.url, {
      username: opts.username,
      password: opts.password
    });

    await new Promise((res, rej) => {
      mqttClient.on('connect', res);
      mqttClient.on('error', rej);
    });

    logger.info(`Connected to MQTT Broker ${opts.url}`);
  };

  const subscribeTopicsForInterpreters = (topicCommands: TopicCommand[]) => {
    // Subscribe to each topic, and get a list of them all
    topicCommands.map(topicCommand => {
      mqttClient.subscribe(topicCommand.topic);
      return topicCommand.topic;
    });

    // Setup listener for messages on any of the topics we subscribed on
    mqttClient.on('message', async (topic, payloadBuffer) => {
      const payload = payloadBuffer.toString();

      // Find which command was issued based on the topic
      const topicCommand = topicCommands.find(c => c.topic === topic);
      if (!topicCommand) {
        const errorMessage = `No registered Command for Topic: ${topic} with payload ${payload}`;
        logger.error(errorMessage);
        return;
      }

      // Find the command from the payload and expected payloads list
      const command = topicCommand.commands.find(c =>
        c.expectedPayloads.some(p => p.toLowerCase() === payload.toLowerCase())
      );

      if (!command) {
        const expectedPayloads = topicCommand.commands.map(c => c.expectedPayloads);
        const errorMessage = `No expectedPayloads match on Topic: ${topic} Payload: ${payload} | Expected Payloads: ${expectedPayloads}`;
        logger.error(errorMessage);
        return;
      }

      logger.info(`Handling Command ${JSON.stringify(command)} with payload [${payload}]`);
      await commandInterpreter.run(command, payload);
    });
  };

  return {
    connect,
    subscribeTopicsForInterpreters
  };
};
