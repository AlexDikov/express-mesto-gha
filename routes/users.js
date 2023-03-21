const router = require('express').Router();
const {
  getUser,
  getUsers,
  modifyUser,
  modifyUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.patch('/me', modifyUser);

router.patch('/me/avatar', modifyUserAvatar);

module.exports = router;
