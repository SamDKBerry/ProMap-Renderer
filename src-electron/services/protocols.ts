import { protocol } from 'electron';
import * as url from 'url';

export const registerProtocols = () => {
  protocol.registerFileProtocol('secure-file', (request, callback) => {
    const filePath = url.fileURLToPath('file://' + request.url.slice('secure-file://'.length));
    callback(filePath);
  });
};
