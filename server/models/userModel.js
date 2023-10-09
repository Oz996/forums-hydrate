const User = require("../schemas/userSchema");
const Blog = require("../schemas/blogSchema");
const Comment = require("../schemas/commentSchema.js");

const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = (req, res) => {
  const { email, password, userName, image } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 7);
  const user = new User({ email, password: hashedPassword, image, userName });

  user
    .save()
    .then(() => {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
          userName: user.userName,
        },
        secretKey
      );
      res.status(201).json({ message: "User created", token });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: "Could not create user" });
    });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }).then((data) => {
    if (!data || !bcrypt.compareSync(password, data.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ email: data.email, userId: data._id }, secretKey);
    res.json({ message: "User logged in", token, userId: data._id });
  });
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then((data) => res.status(200).json(data))
    .catch(() => {
      res.status(404).json({ message: "Could not retrieve users" });
    });
};

exports.getUserByEmail = (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email })
    .then((data) => res.status(200).json(data))
    .catch(() => {
      res.status(404).json({ message: "Could not retreive user" });
    });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      Comment.find({ user: userId })
        .then((comments) => {
          Blog.find({ user: userId })
            .then((posts) => {
              const userData = {
                user,
                comments,
                posts,
              };
              res.status(200).json(userData);
            })
            .catch(() => {
              res
                .status(404)
                .json({ message: "Could not retrieve user's posts" });
            });
        })
        .catch(() => {
          res
            .status(404)
            .json({ message: "Could not retrieve user's comments" });
        });
    })
    .catch(() => {
      res.status(404).json({ message: "Could not retrieve user by ID" });
    });
};

exports.getUsersPosts = (req, res) => {
  const userId = req.params.id;

  Blog.find({ user: userId })
    .populate("user")
    .then((data) => res.status(200).json(data))
    .catch(() => {
      res.status(404).json({ message: "Could not find users posts" });
    });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  Blog.deleteMany({ user: userId })
    .then(() => {
      Comment.deleteMany({ user: userId }).then(() => {
        return User.findByIdAndDelete(userId);
      });
    })
    .then(() => res.status(200).json({ message: "User deleted" }))
    .catch(() => res.status(404).json({ message: "Failed to delete user" }));
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { userName, email, image } = req.body;

  User.findByIdAndUpdate(
    userId,
    {
      $set: {
        userName: userName,
        email: email,
        image: image,
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User information updated",
        user: updatedUser,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to update user information" });
    });
};
