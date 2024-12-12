import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config.js';
import { validateToken } from './middleware/auth.js';
import chatRouter from './routes/chat.js';

const app = express();

app.use(bodyParser.json());
app.use('/v1', validateToken, chatRouter);

app.get('/test', (req, res) => {
    res.json({ message: 'Test successful' });
});

app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
}); 