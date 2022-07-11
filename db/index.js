const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/the_acme_item_tracker_db');

const { STRING, INTEGER } = Sequelize;

const User = conn.define('user', {
  name: {
    type: STRING,
    allowNull: false,
  },
  ranking: {
    type: INTEGER,
    defaultValue: 5,
  }
});

const Thing = conn.define('thing', {
  name: {
    type: STRING, 
  },
  ranking: {
    type: INTEGER,
    defaultValue: 1,
  }
});

// - a thing can belong to a user and a user can have many things. In seed logic have some of the things belong to users (some unowned things, some owned things).

Thing.belongsTo(User, {as: 'owner', foreignKey: 'userId'});
User.hasMany(Thing, {as: 'thing'});

module.exports = {
  conn,
  User,
  Thing
};
