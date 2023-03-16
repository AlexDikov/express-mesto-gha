const router = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  modifyUser,
  modifyUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', createUser);

router.patch('/me', modifyUser);

router.patch('/me/avatar', modifyUserAvatar);

module.exports = router;
