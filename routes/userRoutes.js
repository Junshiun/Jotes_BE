const express = require("express");
const {
  registerUser,
  authUser,
  editUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/profile").put(editUser).delete(deleteUser);

module.exports = router;
