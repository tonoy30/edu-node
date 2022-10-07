import mongoose from 'mongoose';

export function connect() {
	const DATABASE_URL = process.env.DATABASE_URL as string;

	mongoose.connect(DATABASE_URL);

	const database = mongoose.connection;
	database.on('error', (err) => {
		console.error(err);
		process.exit(1);
	});
	database.once('connected', () => {
		console.log('[🐬]: database connected successfully');
	});
}
