const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  //Schéma à respecter pour inscrire un utilisateur dans mongoose
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  //fonction middle ware qui remplace le password par le hash
  const user = this;
  const hash = await bcrypt.hash(user.password, saltRounds);

  this.password = hash;
  next();
});

UserSchema.methods.isPasswordValid = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
