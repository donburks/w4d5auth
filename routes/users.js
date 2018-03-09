const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = (knex) => {

  router.post('/click', (req, res) => {
    let response = {success: false};
    if (req.session.user_id) {
      req.session.counter++;
      response.success = true;
    } 

    res.json(response);
  });

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
    .then((results) => {
      if (results.length) {
        return Promise.all([
          results[0].id, 
          bcrypt.compareSync(password, results[0].password_digest)
        ]);
      } else {
        return Promise.reject("Invalid login");
      }
    })
    .then(data => {
      if (data[1]) {
        req.session.user_id = data[0];
        req.session.counter = 0;
      } else {
        req.flash("error", "Invalid login");
      }

      res.redirect("/");
    })
    .catch(e => {
      console.log("WTF: ", e);
      req.flash("error", "There was an error!");
      res.redirect('/');
    });
  });

  return router;
};
