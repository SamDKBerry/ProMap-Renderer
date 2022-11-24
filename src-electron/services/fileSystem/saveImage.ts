import { dialog } from 'electron';
import { PathOrFileDescriptor, writeFile } from 'fs';
export const saveCanvasAsImage = (base64Data: string) => {
  dialog
    .showSaveDialog({
      defaultPath: 'levelLayout.png',
      filters: [{ name: 'png', extensions: ['png'] }],
    })
    .then((result) => {
      if (typeof result === undefined) {
        return;
      }
      const filename = result.filePath as PathOrFileDescriptor;
      writeFile(filename, base64Data, 'base64', (err) => {
        console.error(err);
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
