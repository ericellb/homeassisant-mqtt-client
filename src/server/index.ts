import dotenv from 'dotenv';
import { createMQTTListener } from './mqtt';
import { MQTTOptions } from './mqtt/types';
import topicCommands from '../topicCommands.json';
import { createLogger } from '../logger';
import { createCommandInterpreter } from './interpreter';

(async () => {
  dotenv.config();
  const logger = createLogger({ outputFile: 'log.txt' });

  const mqttOtptions: MQTTOptions = {
    url: process.env.MQTT_URL ?? '',
    username: process.env.MQTT_USERNAME ?? '',
    password: process.env.MQTT_PASSWORD ?? ''
  };

  if (!mqttOtptions.url || !mqttOtptions.username || !mqttOtptions.password) {
    const errorMessage = 'Make sure you have a .env file with the following: (MQTT_URL, MQTT_USERNAME, MQTT_PASSWORD)';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  const commandInterpreter = createCommandInterpreter();
  const mqttListener = createMQTTListener(mqttOtptions, commandInterpreter, logger);
  await mqttListener.connect();
  mqttListener.subscribeTopicsForInterpreters(topicCommands);
})();
