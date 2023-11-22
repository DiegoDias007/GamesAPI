import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js";
import { notFoundMiddleware } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import gamesRouter from "./routes/games.js";
import authRouter from "./routes/auth.js";
import { authenticateUser } from "./middleware/authentication.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.send("games api");
});

app.use("/api/v1/games", authenticateUser, gamesRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

app.listen(port, async () => {
	try {
    await connectDB(process.env.MONGO_URI);
    console.log(`Server is listening on port ${port}...`);
  } catch (error) {
    console.log(error);
  }
});
