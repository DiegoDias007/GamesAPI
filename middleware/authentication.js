import jsonwebtoken from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/unauthenticated.js";

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Invalid token.")
  }

  const token = authHeader.split(" ")[1]
  try {
    const userCredentials = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = {success: true, userId: userCredentials.userId, name: userCredentials.name}
    next()
  } catch (error) {
    throw new UnauthenticatedError("Invalid credentials.")
  }
}

export { authenticateUser }