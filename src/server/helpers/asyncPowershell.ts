import PShell from 'node-powershell-updates';

const powerShell = new PShell({
  executionPolicy: 'Bypass',
  noProfile: true
});

export const powerShellExec = async (command: string): Promise<string | void> => {
  powerShell.addCommand(command);
  return powerShell.invoke();
};
