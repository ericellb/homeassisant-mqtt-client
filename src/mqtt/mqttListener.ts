import mqtt, { MqttClient } from 'mqtt';
import { Logger } from 'pino';
import { createCommandInterpreter } from '../interpreter';
import { TopicCommand } from '../interpreter/types';
import { MQTTOptions } from './types';

export const createMqttListener = (opts: MQTTOptions, logger: Logger) => {
  let mqttClient: MqttClient;
  const commandInterpreter = createCommandInterpreter();

  const connect = () => {
    const { url, username, password } = opts;
    mqttClient = mqtt.connect(url, { username, password });
    logger.info(`Connected to MQTT Broker ${username}@${url}`);
  };

  const subscribeTopicsForInterpreters = (topicCommands: TopicCommand[]) => {
    // Subscribe to each topic, and get a list of them all
    const topics = topicCommands.map(topicCommand => {
      mqttClient.subscribe(topicCommand.topic);
      return topicCommand.topic;
    });

    // Setup listener for messages on any of the topics we subscribed on
    mqttClient.on('message', (subTopic, payloadBuffer) => {
      const payload = payloadBuffer.toString();

      // For some reason we subscribed to a topic not in our list, ignore
      if (!topics.includes(subTopic)) {
        return;
      }

      // Find which command was issued based on the topic
      const topicCommand = topicCommands.find(c => c.topic === subTopic);
      if (!topicCommand) {
        return;
      }

      // Find the command from the payload and expected payloads list
      const command = topicCommand.commands.find(c =>
        c.expectedPayloads.some(p => p.toLowerCase() === payload.toLowerCase())
      );

      if (command) {
        commandInterpreter.run(command, payload);
      }
    });
  };

  return {
    connect,
    subscribeTopicsForInterpreters
  };
};
