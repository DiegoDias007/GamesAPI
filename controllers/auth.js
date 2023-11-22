import { User } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/unauthenticated.js";

const registerUser = async (req, res) => {
	const user = await User.create({ ...req.body });
	const userToken = await user.createJWT();
	res.status(StatusCodes.CREATED).json({ token: userToken });
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	const isPasswordValid = await user.checkPassword(password);
	if (isPasswordValid === false) {
		throw new UnauthenticatedError("Password is not valid");
	}
	const userToken = await user.createJWT();
	res.status(StatusCodes.OK).json({ user: { userId: user._id, name: user.name }, token: userToken });
};

export { registerUser, loginUser };
