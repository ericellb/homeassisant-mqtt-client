declare namespace NodeJS {
  export interface ProcessEnv {
    MQTT_URL: string;
    MQTT_USERNAME: string;
    MQTT_PASSWORD: string;
    SOUND_OUTPUT_DEVICE_TOPIC: string;
  }
}
