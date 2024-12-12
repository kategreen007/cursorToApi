import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CursorService } from '../services/cursorService.js';
import { extractTextFromChunk } from '../utils/hexConverter.js';

const router = express.Router();

router.get('/models', (req, res) => {
    const models = [
        {
            id: "claude-3.5-sonnet",
            object: "model",
            created: 1706745938,
            owned_by: "cursor"
        },
        {
            id: "gpt-4o",
            object: "model",
            created: 1706745938,
            owned_by: "cursor"
        },
        {
            id: "claude-3-5-sonnet-20241022",
            object: "model",
            created: 1706745938,
            owned_by: "cursor"
        }
    ];

    res.json({
        object: "list",
        data: models
    });
});

router.post('/chat/completions', async (req, res) => {
    try {
        const { model, messages, stream = false } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid request. Messages should be a non-empty array' 
            });
        }

        if (stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
        }

        const response = await CursorService.chatCompletion(messages, model, req.authToken);

        if (stream) {
            const responseId = `chatcmpl-${uuidv4()}`;
            
            for await (const chunk of response.body) {
                if (chunk && Buffer.isBuffer(chunk) && 
                    chunk.length >= 4 && 
                    chunk[0] === 0x00 && 
                    chunk[1] === 0x00 && 
                    chunk[2] === 0x00 && 
                    chunk[3] === 0x00) {
                    try {
                        const text = extractTextFromChunk(chunk);
                        if (text.length > 0) {
                            res.write(`data: ${JSON.stringify({
                                id: responseId,
                                object: 'chat.completion.chunk',
                                created: Math.floor(Date.now() / 1000),
                                model: model,
                                choices: [{
                                    index: 0,
                                    delta: {
                                        content: text
                                    }
                                }]
                            })}\n\n`);
                        }
                    } catch (error) {
                        console.error('Chunk processing error:', error);
                        continue;
                    }
                }
            }

            res.write(`data: ${JSON.stringify({
                id: responseId,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model,
                choices: [{
                    index: 0,
                    finish_reason: 'stop'
                }]
            })}\n\n`);

            res.write('data: [DONE]\n\n');
            return res.end();
        } else {
            let text = "";
            for await (const chunk of response.body) {
                if (chunk && Buffer.isBuffer(chunk) && 
                    chunk.length >= 4 && 
                    chunk[0] === 0x00 && 
                    chunk[1] === 0x00 && 
                    chunk[2] === 0x00 && 
                    chunk[3] === 0x00) {
                    try {
                        text += extractTextFromChunk(chunk);
                    } catch (error) {
                        console.error('Chunk processing error:', error);
                        continue;
                    }
                }
            }

            return res.json({
                id: `chatcmpl-${uuidv4()}`,
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{
                    index: 0,
                    message: {
                        role: 'assistant',
                        content: text
                    },
                    finish_reason: 'stop'
                }],
                usage: {
                    prompt_tokens: 0,
                    completion_tokens: 0,
                    total_tokens: 0
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        if (!res.headersSent) {
            if (req.body.stream) {
                res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);
                return res.end();
            } else {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
});

export default router; 