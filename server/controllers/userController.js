const router = require("express").Router();
const userModel = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", userModel.registerUser);

router.post("/login", userModel.loginUser);

router.get("/posts/:id", userModel.getUsersPosts);

// router.get("/", userModel.getUserByEmail);

router.get("/:id", userModel.getUserById);

router.put("/:id", authMiddleware, userModel.updateUser);

router.get("/", userModel.getAllUsers);

router.delete("/:id", authMiddleware, userModel.deleteUser);

module.exports = router;
