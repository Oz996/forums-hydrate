const Blog = require("../schemas/blogSchema");
const Comment = require("../schemas/commentSchema");

exports.newPost = (req, res) => {
  const { title, body, category } = req.body;

  if (!title || !body || !category) {
    res.status(400).json({ message: "Invalid post" });
    return;
  }

  const userId = req.user.userId;
  console.log("User ID:", userId);

  Blog.create({
    title,
    body,
    category,
    user: userId,
  })
    .then((data) => res.status(201).json(data))
    .catch((error) => {
      console.log("Error:", error.message);
      res.status(500).json({ message: "Could not create post" });
    });
};

exports.updatePost = (req, res) => {
  const { title, body, category } = req.body;
  const postId = req.params.id;

  Blog.findByIdAndUpdate(postId, { title, body, category }, { new: true })
    .then((data) => res.status(200).json(data))
    .catch((error) => {
      res.status(400).json({ message: "Could not update post" });
    });
};

exports.getAllPosts = (req, res) => {
  Blog.find()
    .populate("user")
    .then((data) => res.status(200).json(data))
    .catch(() => {
      res.status(404).json({ message: "Could retrieve posts" });
    });
};

exports.getPostById = (req, res) => {
  const postId = req.params.id;

  Blog.findById(postId)
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .then((data) => res.status(200).json(data))
    .catch(() => {
      res.status(404).json({ message: "Could not retreive post" });
    });
};

exports.deletePost = (req, res) => {
  const postId = req.params.id;

  Blog.findByIdAndDelete(postId)
    .then(res.status(200).json({ message: "Post deleted" }))
    .catch(() => {
      res.status(404).json({ message: "Could not delete post" });
    });
};

exports.postComment = (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;
  const userId = req.user.userId;

  if (!text) {
    return res.status(400).json({ message: "Invalid comment" });
  }

  const newComment = new Comment({
    text,
    user: userId,
    post: postId,
  });

  newComment
    .save()
    .then((comment) => {
      return Blog.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } },
        { new: true }
      );
    })
    .then((updatedPost) => {
      res.status(201).json(updatedPost);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      res.status(500).json({ message: "Could not post comment" });
    });
};

exports.deleteComment = (req, res) => {
  const { commentId, postId } = req.body;

  if (!commentId || postId) {
    return res.status(400).json({ message: "Invalid request" });
  }

  Comment.findByIdAndDelete(commentId).then(() => {
    return Blog.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } },
      { new: true }
    )
      .then((updatedPost) => {
        if (!updatedPost) {
          return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Comment deleted" });
      })
      .catch((error) => {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Could not delete comment" });
      });
  });
};
