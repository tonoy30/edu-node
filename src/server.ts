import dotenv from 'dotenv';
import express from 'express';
import { connect } from './database/mongo';

dotenv.config();
connect();

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.json({ name: 'tonoy' });
});
app.get('/foe?o', (req, res) => {
	res.send('foe?o');
});
app.listen(port, () => {
	console.log(`[🐆]: server is listening on port: ${port}`);
});
