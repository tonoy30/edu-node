import Joi from 'joi';
import { model, Schema } from 'mongoose';

interface IUser {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
	token: string;
}

const userSchema = new Schema<IUser>({
	firstName: {
		type: String,
		default: null,
	},
	lastName: {
		type: String,
		default: null,
	},
	username: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	token: {
		type: String,
	},
});
const User = model<IUser>('users', userSchema);

const userValidator = (user: IUser) => {
	const schema = Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		username: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});
	return schema.validate(user);
};
export { IUser, User, userValidator };
