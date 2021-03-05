export interface AudioDeviceCmdletsIntegration {
  getDefaultAudioDevice(): Promise<string | null>;
  setDefaultAudioDevice(deviceName: string): Promise<void>;
  getDefaultAudioDeviceVolume(): Promise<number | null>;
  setDefaultAudioDeviceVolume(volume: number): Promise<void>;
  getDefaultAudioDeviceMuteState(): Promise<boolean | null>;
  setDefaultAudioDeviceMuteState(mute: boolean): Promise<void>;
}
