import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide a name."],
	},
	email: {
		type: String,
		required: [true, "Please provide a email."],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide a valid email.",
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide a password."],
	},
});

userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(this.password, salt);
	this.password = hashedPassword;
	next();
});

userSchema.methods.createJWT = async function () {
	return jsonwebtoken.sign(
		{ userId: this._id, userName: this.name },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_LIFETIME }
	);
};

userSchema.methods.checkPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
}

const User = mongoose.model("User", userSchema);

export { User };
