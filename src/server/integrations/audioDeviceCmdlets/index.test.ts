/* eslint-disable no-undef */
import { expect } from 'chai';
import { createAudioDeviceCmdletsIntegration } from '.';

// Requires Audio Device Cmdlets - Integration Test
describe('Integration Test - Test the Audio Device Cmdlets Integration', () => {
  const audioDeviceCmdlet = createAudioDeviceCmdletsIntegration();

  it('Should be able to set and get a default audio device', async () => {
    const targetAudioDevice = 'Headphones';
    await audioDeviceCmdlet.setDefaultAudioDevice(targetAudioDevice);
    const defaultAudioDevice = await audioDeviceCmdlet.getDefaultAudioDevice();
    expect(defaultAudioDevice).to.equal(targetAudioDevice);
  });

  it('Should be able to set and get the audio device volume', async () => {
    const targetAudioVolume = 50;
    await audioDeviceCmdlet.setDefaultAudioDeviceVolume(targetAudioVolume);
    const audioDeviceVolume = await audioDeviceCmdlet.getDefaultAudioDeviceVolume();
    expect(audioDeviceVolume).to.equal(targetAudioVolume);
  });

  it('Should be able to set and get the audio device mute state', async () => {
    const targetMuteState = true;
    await audioDeviceCmdlet.setDefaultAudioDeviceMuteState(targetMuteState);
    const audioDeviceMuteState = await audioDeviceCmdlet.getDefaultAudioDeviceMuteState();
    expect(audioDeviceMuteState).to.equal(targetMuteState);
  });
});
