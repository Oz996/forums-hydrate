const router = require("express").Router();
const blogModel = require("../models/blogModel");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, blogModel.newPost);

router.get("/", blogModel.getAllPosts);

router.get("/:id", blogModel.getPostById);

router.put("/:id", authMiddleware, blogModel.updatePost);

router.post("/:id/comments", authMiddleware, blogModel.postComment);

router.delete("/:id/comments", authMiddleware, blogModel.deleteComment);

router.delete("/:id", authMiddleware, blogModel.deletePost);

module.exports = router;
