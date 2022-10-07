import dotenv from 'dotenv';
import express from 'express';
import { connect } from './database/mongo';
import { userRouter } from './routes/user.route';

dotenv.config();
connect();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/api/auth', userRouter);

app.get('/', (req, res) => {
	res.json({ name: 'tonoy' });
});

app.listen(port, () => {
	console.log(`[🐆]: server is listening on port: ${port}`);
});
