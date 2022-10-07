import crypto from 'crypto';

const decrypt = (hash: string) => {
	const decipher = crypto.createDecipheriv(
		process.env.CRYPTO_ALGORITHM as string,
		process.env.CONFIRMATION_SECRET_KEY as string,
		Buffer.from(process.env.INITIALIZATION_VECTOR as string, 'hex')
	);

	const decrypted = Buffer.concat([
		decipher.update(Buffer.from(hash, 'hex')),
		decipher.final(),
	]);
	return decrypted.toString();
};
const encrypt = (token: string) => {
	const cipher = crypto.createCipheriv(
		process.env.CRYPTO_ALGORITHM as string,
		process.env.CONFIRMATION_SECRET_KEY as string,
		Buffer.from(process.env.INITIALIZATION_VECTOR as string, 'hex')
	);

	const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);

	return encrypted.toString('hex');
};

export { encrypt, decrypt };
