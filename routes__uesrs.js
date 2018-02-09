const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = (knex) => {

  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  router.post('/login', (req, res) => {
    const {email, password} = req.body.user;
    knex('users')
      .select('id', 'password_digest')
      .where('email', email)
      .limit(1)
      .then((users) => {
        if (users.length) {
          return Promise.all([
            users[0].id,
            bcrypt.compare(password, users[0].password_digest)
          ]);
        } else {
          return Promise.reject(new Error('bad email'));
        }
      })
      .then(([userId, passwordMatches]) => {
        if (passwordMatches) {
          req.session.user_id = userId;
          res.redirect('/');
        } else {
          return Promise.reject(new Error('bad password'));
        }
      })
      .catch((err) => {
        console.error(err);
        req.flash('error', 'There was a problem logging you in :(');
        res.redirect('/');
      });
  });

  return router;
};
