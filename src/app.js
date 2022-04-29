import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { MongoClient } from 'mongodb';
import { authSchema } from './helpers/schemas/login-name_schema.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('batepapo-uol');
    console.log(chalk.bold.red('Conected to MongoDB'));
});

app.get('/participants', (req, res) => {});

app.get('/messages', async (req, res) => {
    try {
        const { limit } = req.query;
        const { user } = req.headers;
        if (limit) {
            const requisicao = await db
                .collection('messages')
                .find({ $or: [{ to: 'Todos' }, { to: user }] })
                .toArray();
            let messages = [...requisicao].reverse().slice(0, limit);
            res.send(messages.reverse());
        } else {
            const requisicao = await db
                .collection('messages')
                .find({ $or: [{ to: 'Todos' }, { to: user }] })
                .toArray();
            let messages = [...requisicao];
            res.send(messages);
        }
    } catch (error) {
        console.log(error);
    }
});

app.post('/participants', async (req, res) => {
    const { name } = req.body;
    const value = authSchema.validate(req.body);
    if (value.hasOwnProperty('error')) {
        res.status(422).send(value.error.details[0].message);
    } else {
        try {
            const requisicao = await db
                .collection('participants')
                .findOne({ name });
            if (requisicao) {
                res.status(409).send('User already exists');
            } else {
                await db.collection('participants').insertOne({
                    name,
                    lastStatus: Date.now(),
                });
                await db.collection('messages').insertOne({
                    from: name,
                    to: 'Todos',
                    text: 'entra na sala...',
                    type: 'status',
                    time: dayjs().format('HH:MM:ss'),
                });
                res.sendStatus(201);
            }
        } catch (err) {
            console.log('Request error: ', err);
        }
    }
});

app.post('/messages', (req, res) => {
    res.send('OK');
});

app.post('/status', (req, res) => {
    res.send('OK');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(chalk.bold.green(`Server running on port ${port}`));
});
