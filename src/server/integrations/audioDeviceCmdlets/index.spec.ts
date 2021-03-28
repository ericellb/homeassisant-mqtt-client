/* eslint-disable no-undef */
import { expect } from 'chai';
import sinon from 'sinon';
import { createAudioDeviceCmdletsIntegration } from '.';
import * as execUtils from '../../helpers/asyncPowershell';
import { AudioDeviceCmdletsIntegration } from './types';

// Requires Audio Device Cmdlets - Integration Test
describe('Unit Test - Test the Audio Device Cmdlets Integration', () => {
  let audioDeviceCmdlet: AudioDeviceCmdletsIntegration;
  const powerShellExecStub = sinon.stub(execUtils, 'powerShellExec');

  afterEach(() => {
    powerShellExecStub.reset();
  });

  it('Get Default Audio Device - Should call asyncExec with the right parameters when getting a default audio device', async () => {
    const expectedAudioList = `
Index   : 1
Default : False
Type    : Playback
Name    : Headphones (High Definition Audio Device)
ID      : {0.0.0.00000000}.{1803cc8b-68f6-47eb-9a50-fc4530344d63}
Device  : CoreAudioApi.MMDevice`;

    powerShellExecStub.returns(new Promise(res => res(expectedAudioList)));
    audioDeviceCmdlet = createAudioDeviceCmdletsIntegration(execUtils.powerShellExec);

    const defaultAudioDevice = await audioDeviceCmdlet.getDefaultAudioDevice();
    expect(powerShellExecStub.args[0]).to.have.members(['Get-AudioDevice -Playback']);
    expect(defaultAudioDevice).to.equal('Headphones');
  });

  it('Set Default Audio Device - Should call asyncExec with the right parameters when setting a default audio device', async () => {
    const expectedAudioList = `
Index   : 1
Default : False
Type    : Playback
Name    : Headphones (High Definition Audio Device)
ID      : {0.0.0.00000000}.{1803cc8b-68f6-47eb-9a50-fc4530344d63}
Device  : CoreAudioApi.MMDevice

Index   : 2
Default : True
Type    : Playback
Name    : Speakers (NVIDIA High Definition Audio)
ID      : {0.0.0.00000000}.{e1f520c7-d720-445c-ba83-5b38be0366ca}
Device  : CoreAudioApi.MMDevice`;

    // Force each call to return expected data
    powerShellExecStub.onCall(0).returns(new Promise(res => res(expectedAudioList)));
    powerShellExecStub.onCall(1).returns(new Promise(res => res()));
    audioDeviceCmdlet = createAudioDeviceCmdletsIntegration(execUtils.powerShellExec);

    await audioDeviceCmdlet.setDefaultAudioDevice('Headphones');
    expect(powerShellExecStub.getCall(0).args).to.have.members(['Get-AudioDevice -List']);
    expect(powerShellExecStub.getCall(1).args).to.have.members([
      'Set-AudioDevice -ID "{0.0.0.00000000}.{1803cc8b-68f6-47eb-9a50-fc4530344d63}"'
    ]);
  });

  it('Get Audio Device Volume - Should call asyncExec with the right parameters when getting audio device volume', async () => {
    const volume = 95.5;
    const returnedVolume = `${volume}%`;
    powerShellExecStub.returns(new Promise(res => res(returnedVolume)));
    audioDeviceCmdlet = createAudioDeviceCmdletsIntegration(execUtils.powerShellExec);

    const audioDeviceVolume = await audioDeviceCmdlet.getDefaultAudioDeviceVolume();
    expect(powerShellExecStub.args[0]).to.have.members(['Get-AudioDevice -PlaybackVolume']);
    expect(audioDeviceVolume).equal(volume);
  });

  it('Set Audio Device Volume - Should call asyncExec with the right parameters when setting audio device volume', async () => {
    audioDeviceCmdlet = createAudioDeviceCmdletsIntegration(execUtils.powerShellExec);

    const volume = 50.5;
    await audioDeviceCmdlet.setDefaultAudioDeviceVolume(volume);
    expect(powerShellExecStub.args[0]).to.have.members([`Set-AudioDevice -PlaybackVolume "${volume}"`]);
  });

  it('Get Audio Device Mute - Should call asyncExec with the rgith parameters when getting audio device mute state', async () => {
    const muteStateString = 'False';
    const muteState = Boolean(muteStateString);
    powerShellExecStub.returns(new Promise(res => res(muteStateString)));
    audioDeviceCmdlet = createAudioDeviceCmdletsIntegration(execUtils.powerShellExec);

    const audioDeviceMuteState = await audioDeviceCmdlet.getDefaultAudioDeviceMuteState();
    expect(powerShellExecStub.args[0]).to.have.members(['Get-AudioDevice -PlaybackMute']);
    expect(audioDeviceMuteState).equal(muteState);
  });

  it('Set Audio Device Mute - Should call asyncExec with the right parameters when setting audio device mute state ', async () => {
    audioDeviceCmdlet = createAudioDeviceCmdletsIntegration(execUtils.powerShellExec);
    const muteState = true;
    const muteStateOutput = muteState ? 1 : 0;

    await audioDeviceCmdlet.setDefaultAudioDeviceMuteState(muteState);
    expect(powerShellExecStub.args[0]).to.have.members([`Set-AudioDevice -PlaybackMute ${muteStateOutput}`]);
  });
});
