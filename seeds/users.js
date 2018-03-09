const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, email: 'Alice@example.com', password_digest: bcrypt.hashSync('test', 10)}),
        knex('users').insert({id: 2, email: 'Bob@example.com', password_digest: bcrypt.hashSync('test', 10)}),
        knex('users').insert({id: 3, email: 'Charlie@example.com', password_digest: bcrypt.hashSync('test', 10)})
      ]);
    });
};
