var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var usersSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    login: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      unique: false,
      required: true,
    },
    salary: {
      type: Number,
      unique: false,
      required: true,
    },
  },
  {
    collection: 'employees',
    timestamps: true, // mongoose assigns createdAt and updatedAt fields to your schema
  }

);

usersSchema.method.toJson = function() {
  var obj = this.toObject();
  delete obj._id;
  return obj;
}

// module.exports = usersSchema;
var User = mongoose.model("User", usersSchema); // register schema with model
module.exports = User;
