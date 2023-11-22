import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name to the game."]
  }, 
  rating: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    default: 0,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide an user."]
  }
}, {
  timestamps: true
})

const Game = mongoose.model("Game", gameSchema);

export { Game };