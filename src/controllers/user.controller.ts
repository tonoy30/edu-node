import { genSalt, hash } from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, userValidator } from '../models/user.model';

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
		const oldUser = await User.findOne({ email: email });
		if (oldUser) {
			return res.status(409).send('User Already Exist. Please Login');
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
		return res.status(201).json(user);
	} catch (err) {
		console.error(err);
	}
}
