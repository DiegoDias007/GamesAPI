import { Game } from "../models/Game.js";
import { StatusCodes } from "http-status-codes";

const getAllGames = async (req, res) => {
  const { userId } = req.user;
  const { name, rating, sort, field, page, limit } = req.query;

  const queryObject = { createdBy: userId };

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (rating) {
    queryObject.rating = Number(rating);
  }

  let result = Game.find(queryObject);

  if (sort) {
    result = result.sort(sort.split(",").join(" "));
  } else {
    result = result.sort("createdAt");
  }

  if (field) {
    result = result.select(field.split(",").join(" "));
  }

  const itemsPerPage = limit ? Number(limit) : 10;
  const currentPage = page ? Number(page) : 1;
  const skip = (currentPage - 1) * itemsPerPage;

  result = result.limit(itemsPerPage).skip(skip);

  const games = await result;
  res.status(StatusCodes.OK).json({ count: games.length, games });
};


const getGame = async (req, res) => {
	const {id: gameId} = req.params
  const {userId} = req.user;
  const game = await Game.findOne({_id: gameId, createdBy: userId});
  res.status(StatusCodes.OK).json({game});
}

const createGame = async (req, res) => {
  const {userId} = req.user
	const newGame = await Game.create({ ...req.body, createdBy: userId })
  res.status(StatusCodes.CREATED).json({newGame})
}

const updateGame = async (req, res) => {
  const { id: gameId } = req.params;
  const { userId } = req.user;
  const updateFields = req.body;

  const updatedGame = await Game.findOneAndUpdate({ _id: gameId, createdBy: userId }, updateFields, { new: true });
  res.status(StatusCodes.OK).json({ game: updatedGame });
}

const deleteGame = async (req, res) => {
  const {userId} = req.user;
  const {id: gameId} = req.params;
  await Game.findOneAndDelete({createdBy: userId, _id: gameId})
  res.status(StatusCodes.OK).json({success: true})
}

export {getAllGames, getGame, createGame, updateGame, deleteGame}
