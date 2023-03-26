const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user.userId } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Ошибка ввода');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner !== req.user.userId) {
        throw new BadRequestError('Невозможно удалить карточку другого пользователя');
      }
      return Card.deleteOne(req.params.cardId)
        .then(() => { res.send({ data: card }); });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.userId } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.send({ data: card });
    }
  })
  .catch(next);
