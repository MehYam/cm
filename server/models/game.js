const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema ({
   user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
   palette: [Number]
});

const moveSchema = new Schema({
   x: {type: Number, required: true},
   y: {type: Number, required: true},
   paletteIdx: {type: Number}
});

const Game = mongoose.model('Game', new Schema({
   created: {type: Date, default: Date.now},
   seed: {type: Number, required: true},
   width: {type: Number, required: true},
   height: {type: Number, required: true},
   players: [playerSchema],
   moves: [moveSchema]
}));

module.exports = Game;