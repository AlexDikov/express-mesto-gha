const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const router = require("express").Router();

router.get("/", getCards);

router.delete("/:cardId", deleteCard);

router.post("/", createCard);

router.put("/:cardId/likes", likeCard);

router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
