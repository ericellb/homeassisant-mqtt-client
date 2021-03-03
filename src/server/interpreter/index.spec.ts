import childProcess from 'child_process';
import sinon from 'sinon';
import { expect } from 'chai';
import { createCommandInterpreter } from '.';
import { ApplicationCommand, NircmdCommand } from './types';

describe('Tests the Command Interpreter', () => {
  let execSyncStub = sinon.stub(childProcess, 'execSync');
  const commandInterpreter = createCommandInterpreter(childProcess.execSync);

  afterEach(() => {
    execSyncStub.reset();
  });

  it('Should open an Appliation', () => {
    const applicationCommand: ApplicationCommand = {
      path: 'C:\\Windows\\System32\\calc.exe',
      type: 'application',
      expectedPayloads: ['open calculator', 'calculator']
    };
    const payload = 'calculator';

    commandInterpreter.run(applicationCommand, payload);
    expect(execSyncStub.args[0][0]).to.equal('cmd.exe /c "C:\\Windows\\System32\\calc.exe"');
    expect(execSyncStub.calledOnce).to.be.true;
  });

  it('Should run a Nircmd command', () => {
    const applicationCommand: NircmdCommand = {
      command: 'setdefaultsounddevice',
      type: 'nircmd',
      expectedPayloads: ['Headphones', 'Speakers']
    };

    const payload = 'Headphones';
    commandInterpreter.run(applicationCommand, payload);
    expect(execSyncStub.args[0][0]).to.equal('cmd.exe /c nircmd setdefaultsounddevice Headphones 1');
    expect(execSyncStub.calledOnce).to.be.true;
  });
});
