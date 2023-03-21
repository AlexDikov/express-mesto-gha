const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Vasya',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Traktorist',
  },
  avatar: {
    type: String,
    default: 'https://gazetavolgodonsk.ru/wp-content/uploads/2020/04/ken-rodrigo-alves-hochet-smenit-pol-i-stat-barbi7.jpg',
    // eslint-disable-next-line no-useless-escape
    pattern: '/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'неккоректный email'],
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcryptjs.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
