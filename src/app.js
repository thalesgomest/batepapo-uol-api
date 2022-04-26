import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';

const app = express();
app.use(cors());
app.use(json());

app.get('/participants', (req, res) => {
    res.send('OK');
});

app.get('/messages', (req, res) => {
    res.send('OK');
});

app.post('/participants', (req, res) => {
    res.send('OK');
});

app.post('/messages', (req, res) => {
    res.send('OK');
});

app.post('/status', (req, res) => {
    res.send('OK');
});

app.listen(5000, () => {
    console.log(chalk.green('Server running on port 5000'));
});
