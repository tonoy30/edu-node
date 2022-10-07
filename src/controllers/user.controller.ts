import { genSalt, hash } from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User, userValidator } from '../models/user.model';
import { decrypt, encrypt } from '../utils/confirmation.util';

export async function signUp(req: Request, res: Response) {
	try {
		// validate the user
		const { error } = userValidator(req.body);
		if (error) {
			return res.status(400).json(error.details);
		}
		// deconstruct the req.body
		const { firstName, lastName, username, email, password } = req.body;
		// check if the user already exist in database
		const emailExists = await User.findOne({ email, username });
		const usernameExists = await User.findOne({ username });
		if (emailExists) {
			return res.status(409).send('Email Already Exist. Please Login');
		}
		if (usernameExists) {
			return res.status(409).send('Username Already Exist. Please Login');
		}
		// Hash the password
		const saltRound = process.env.SALT_ROUND as string;
		const salt = await genSalt(Number(saltRound));
		const hashedPassword = await hash(password, salt);

		// Create User object
		const user = await User.create({
			firstName,
			lastName,
			username,
			email: email.toLowerCase(),
			password: hashedPassword,
		});
		// create token
		const tokenSecret = process.env.TOKEN_SECRET_KEY as string;
		const token = jwt.sign({ userId: user._id, email }, tokenSecret, {
			expiresIn: '1h',
		});
		user.token = token;
		return sendMail(email, username, res);
	} catch (err) {
		console.error(err);
	}
}
export async function verifyEmail(req: Request, res: Response) {
	try {
		// Get the confirmation token
		const { confirmationToken } = req.params;

		// Decrypt the username
		const username = decrypt(confirmationToken);
		// Check if there is anyone with that username
		const user = await User.findOne({ username: username });

		if (user) {
			// If there is anyone, mark them as confirmed account
			user.isEmailVerified = true;
			await user.save();

			// Return the created user data
			res.status(201).json({
				message: 'User verified successfully',
				data: user,
			});
		} else {
			return res.status(409).send('User Not Found');
		}
	} catch (err) {
		console.error(err);
		return res.status(400).send(err);
	}
}
async function sendMail(email: string, username: string, res: Response) {
	const confirmationToken = encrypt(username);
	const apiUrl = process.env.API_URL as string;

	const Transport = getTransport();
	// Configure the email options
	const mailOptions = {
		from: 'noreply@nodeedu.com',
		to: email,
		subject: 'Email Confirmation',
		html: `Press the following link to verify your email: <a href=${apiUrl}/verify/${confirmationToken}>Verification Link</a>`,
	};
	Transport.sendMail(mailOptions, (err) => {
		if (err) {
			res.status(400).send(err);
		} else {
			res.status(201).json({
				message:
					'Account created successfully, please verify your email.',
			});
		}
	});
}
function getTransport() {
	const user = process.env.NODEMAILER_USER as string;
	const pass = process.env.NODEMAILER_PASSWORD as string;
	const transport = nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: user,
			pass: pass,
		},
	});
	return transport;
}
