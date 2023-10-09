const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      data: Buffer,
      contentType: String,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Blog"}]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
