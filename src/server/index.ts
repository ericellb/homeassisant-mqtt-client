import dotenv from 'dotenv';
import { createMqttListener } from './mqtt/mqttListener';
import { MQTTOptions } from './mqtt/types';
import topicCommands from '../topicCommands.json';
import { createLogger } from './logger';

dotenv.config();

const mqttOtptions: MQTTOptions = {
  url: process.env.MQTT_URL ?? '',
  username: process.env.MQTT_USERNAME ?? '',
  password: process.env.MQTT_PASSWORD ?? ''
};

const logger = createLogger();

if (!mqttOtptions.url || !mqttOtptions.username || !mqttOtptions.password) {
  logger.error('Make sure you have a .env file with the following: (MQTT_URL, MQTT_USERNAME, MQTT_PASSWORD)');
}

if (mqttOtptions.url || mqttOtptions.username || mqttOtptions.password) {
  const mqttListener = createMqttListener(mqttOtptions, logger);
  mqttListener.connect();
  mqttListener.subscribeTopicsForInterpreters(topicCommands);
}
