import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const usersSchema = new Schema(
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

usersSchema.method({
  toJson: function() {
    const obj = this.toObject();
    delete obj._id;
    return obj;
  }
})


// module.exports = usersSchema;
export const User = mongoose.model("User", usersSchema); // register schema with model

