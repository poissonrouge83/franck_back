//ici il faut creer le model (mongoose) des quotes
//
// debut des imports
const mongoose = require("mongoose");
const mRandom = require("mongoose-simple-random");
//endof imports
//
//
// debut de la config  et declaration/instanciation des variables
const Schema = mongoose.Schema;

const QuoteSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: false,
    },
    userId: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);
QuoteSchema.plugin(mRandom);
// endof config and declarations
//
//
// debut de la "logique"
// penser à mettre une méthode de récupération random de la quote
QuoteSchema.static.quoteCleanUp = function (quote) {
  if (quote.text && quote.author) {
    return {
      text: quote.text,
      author: quote.author,
    };
  } else {
    throw new Error("quote format error");
  }
};
// endof  "logique"
//
//
//wrapping
const QuoteModel = mongoose.model("quote", QuoteSchema);
// endof wrapping
//
//
// exports
module.exports = QuoteModel;
// endof exports
