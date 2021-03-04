export const commandInBackground = 'cmd.exe /c';

// Builds a command to change the default output device in windows
export const buildNircmdCommand = (command: string, payload: string, extraArgument: string = '1') =>
  `${commandInBackground} nircmd ${command} ${payload} ${extraArgument}`;

// Builds a command to open an application in windows
export const buildOpenAppliationCommand = (command: string) => `${commandInBackground} "${command}"`;
