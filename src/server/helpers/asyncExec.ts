import { exec } from 'child_process';

export const asyncExec = async (command: string): Promise<string | void> => {
  return new Promise((res, rej) => {
    exec(command, (err, response) => {
      if (err) {
        rej(err);
      }
      res(response.toString());
    });
  });
};
