const {
  createUser,
  getUser,
  getUsers,
  modifyUser,
  modifyUserAvatar,
} = require("../controllers/users");

const router = require("express").Router();

router.get("/", getUsers);

router.get("/:userId", getUser);

router.post("/", createUser);

router.patch("/me", modifyUser);

router.patch("/me/avatar", modifyUserAvatar);

module.exports = router;
