export function stringToHex(str, model_name) {
    const bytes = Buffer.from(str, 'utf-8');
    const byteLength = bytes.length;
    
    const FIXED_HEADER = 2;
    const SEPARATOR = 1;
    const FIXED_SUFFIX_LENGTH = 0xA3 + model_name.length;

    let textLengthField1, textLengthFieldSize1;
    if (byteLength < 128) {
        textLengthField1 = byteLength.toString(16).padStart(2, '0');
        textLengthFieldSize1 = 1;
    } else {
        const lowByte1 = (byteLength & 0x7F) | 0x80;
        const highByte1 = (byteLength >> 7) & 0xFF;
        textLengthField1 = lowByte1.toString(16).padStart(2, '0') + highByte1.toString(16).padStart(2, '0');
        textLengthFieldSize1 = 2;
    }

    const baseLength = byteLength + 0x2A;
    let textLengthField, textLengthFieldSize;
    if (baseLength < 128) {
        textLengthField = baseLength.toString(16).padStart(2, '0');
        textLengthFieldSize = 1;
    } else {
        const lowByte = (baseLength & 0x7F) | 0x80;
        const highByte = (baseLength >> 7) & 0xFF;
        textLengthField = lowByte.toString(16).padStart(2, '0') + highByte.toString(16).padStart(2, '0');
        textLengthFieldSize = 2;
    }

    const messageTotalLength = FIXED_HEADER + textLengthFieldSize + SEPARATOR + 
                             textLengthFieldSize1 + byteLength + FIXED_SUFFIX_LENGTH;

    const messageLengthHex = messageTotalLength.toString(16).padStart(10, '0');

    const hexString = (
        messageLengthHex +
        "12" +
        textLengthField +
        "0A" +
        textLengthField1 +
        bytes.toString('hex') +
        "10016A2432343163636435662D393162612D343131382D393239612D3936626330313631626432612" +
        "2002A132F643A2F6964656150726F2F656475626F73733A1E0A"+
        Buffer.from(model_name, 'utf-8').length.toString(16).padStart(2, '0').toUpperCase() +  
        Buffer.from(model_name, 'utf-8').toString('hex').toUpperCase() +  
        "22004A" +
        "24" + "61383761396133342D323164642D343863372D623434662D616636633365636536663765" +
        "680070007A2436393337376535612D386332642D343835342D623564392D653062623232336163303061" +
        "800101B00100C00100E00100E80100"
    ).toUpperCase();

    return Buffer.from(hexString, 'hex');
}

export function extractTextFromChunk(chunk) {
    let i = 0;
    let results = [];
    
    while (i < chunk.length) {
        while (i < chunk.length && chunk[i] === 0) {
            i++;
        }
        
        if (i >= chunk.length) {
            break;
        }
        
        i += 2;
        
        const contentLength = chunk[i];
        i++;
        
        if (i + contentLength <= chunk.length) {
            const text = chunk.slice(i, i + contentLength).toString('utf-8');
            if (text.length > 0) {
                results.push(text);
            }
        }
        
        i += contentLength;
    }
    
    return results.join('');
} 