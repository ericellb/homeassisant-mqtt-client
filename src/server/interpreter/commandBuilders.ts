export const commandInBackground = 'cmd.exe /c';

// Builds a command to open an application in windows
export const buildOpenAppliationCommand = (command: string) => `${commandInBackground} "${command}"`;
