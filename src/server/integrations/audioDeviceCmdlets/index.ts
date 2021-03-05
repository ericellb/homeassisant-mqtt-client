import { asyncExec as aExec } from '../../helpers/asyncExec';
import { AudioDeviceCmdletsIntegration } from './types';

export const createAudioDeviceCmdletsIntegration = (asyncExec: typeof aExec = aExec): AudioDeviceCmdletsIntegration => {
  const getDefaultAudioDevice = async (): Promise<string | null> => {
    const response = await asyncExec('powershell.exe -command Get-AudioDevice -Playback');
    if (typeof response === 'string') {
      const defaultPlaybackDeviceRegexMatch = response.match(/(?<=Name[\s]{4}: )\w+/);
      if (defaultPlaybackDeviceRegexMatch) {
        return defaultPlaybackDeviceRegexMatch[0];
      }
    }
    return null;
  };

  const setDefaultAudioDevice = async (deviceName: string): Promise<void> => {
    const response = await asyncExec('powershell.exe -command Get-AudioDevice -List');
    if (typeof response === 'string') {
      const regex = `(${deviceName}[\\(\\w\\s\\)]+\\nID\\s{6}:\\s)(.*)`;
      const targetPlaybackDeviceRegexMatch = response.match(new RegExp(regex));
      if (targetPlaybackDeviceRegexMatch) {
        const playbackDeviceId = targetPlaybackDeviceRegexMatch[2];
        await asyncExec(`powershell.exe -command Set-AudioDevice -ID '"${playbackDeviceId}"'`);
      }
    }
  };

  const getDefaultAudioDeviceVolume = async (): Promise<number | null> => {
    const response = await asyncExec('powershell.exe -command Get-AudioDevice -PlaybackVolume');
    if (typeof response === 'string') {
      const volume = parseFloat(response.split('%')[0]);
      return volume;
    }
    return null;
  };

  const setDefaultAudioDeviceVolume = async (volume: number): Promise<void> => {
    await asyncExec(`powershell.exe -command Set-AudioDevice -PlaybackVolume "${volume}"`);
  };

  const getDefaultAudioDeviceMuteState = async (): Promise<boolean | null> => {
    const response = await asyncExec('powershell.exe -command Get-AudioDevice -PlaybackMute');
    if (typeof response === 'string') {
      return Boolean(response);
    }
    return null;
  };

  const setDefaultAudioDeviceMuteState = async (mute: boolean): Promise<void> => {
    const muteState = mute ? 1 : 0;
    await asyncExec(`powershell.exe -command Set-AudioDevice -PlaybackMute ${muteState}`);
  };

  return {
    getDefaultAudioDevice,
    setDefaultAudioDevice,
    setDefaultAudioDeviceVolume,
    getDefaultAudioDeviceVolume,
    setDefaultAudioDeviceMuteState,
    getDefaultAudioDeviceMuteState
  };
};
