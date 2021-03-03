import dotenv from 'dotenv';
import mqtt from 'mqtt';
import { createMQTTListener } from './mqtt';
import { MQTTOptions } from './mqtt/types';
import topicCommands from '../topicCommands.json';
import { createLogger } from './logger';
import { createCommandInterpreter } from './interpreter';

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
  const mqttClient = mqtt.connect(mqttOtptions.url, {
    username: mqttOtptions.username,
    password: mqttOtptions.password
  });

  mqttClient.on('connect', () => {
    logger.info(`Connected to MQTT Broker ${mqttOtptions.url}`);
    const commandInterpreter = createCommandInterpreter();
    const mqttListener = createMQTTListener(mqttClient, commandInterpreter, logger);
    mqttListener.subscribeTopicsForInterpreters(topicCommands);
  });
}
