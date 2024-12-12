import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config.js';
import { stringToHex } from '../utils/hexConverter.js';

export class CursorService {
    static async chatCompletion(messages, model, authToken) {
        const formattedMessages = messages.map(msg => `${msg.role}:${msg.content}`).join('\n');
        const hexData = stringToHex(formattedMessages, model);

        return fetch(config.cursor.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/connect+proto',
                'authorization': `Bearer ${authToken}`,
                'connect-accept-encoding': 'gzip,br',
                'connect-protocol-version': '1',
                'user-agent': 'connect-es/1.4.0',
                'x-amzn-trace-id': `Root=${uuidv4()}`,
                'x-cursor-checksum': config.cursor.checksum,
                'x-cursor-client-version': config.cursor.clientVersion,
                'x-cursor-timezone': 'Asia/Shanghai',
                'x-ghost-mode': 'false',
                'x-request-id': uuidv4(),
                'Host': 'api2.cursor.sh'
            },
            body: hexData
        });
    }
} 