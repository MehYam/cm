const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema ({
   user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
   displayName: {type: String, required: true},
   palette: [Number]
});

const moveSchema = new Schema({
   x: {type: Number, required: true},
   y: {type: Number, required: true},
   paletteIdx: {type: Number}
});

const Game = mongoose.model('Game', new Schema({
   created: {type: Date, default: Date.now},
   completed: {type: Date, default: null},
   seed: {type: Number, required: true},
   width: {type: Number, required: true},
   height: {type: Number, required: true},
   players: [playerSchema],
   moves: [moveSchema],

   //KAI: what's the best decision here?  we could instead host a separate table of voting data.  Doing it this way is a little simpler in the short term
   ballots: {type: Number, default: 0},
   votes: {type: Number, default: 0}   
}));

module.exports = Game;