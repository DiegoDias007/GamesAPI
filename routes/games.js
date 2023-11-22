import express from "express";
import { getAllGames, getGame, createGame, updateGame, deleteGame } from "../controllers/games.js";

const router = express.Router();

router.route("/")
  .get(getAllGames)
  .post(createGame)

router.route("/:id")
  .get(getGame)
  .patch(updateGame)
  .delete(deleteGame)

export default router;