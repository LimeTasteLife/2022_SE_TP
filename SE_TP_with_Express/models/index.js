const Sequelize = require('sequelize');
const Category = require('./category');
const Comment = require('./comment');
const Menu = require('./menu');
const Post = require('./post');
const Post_cate = require('./post_cate');
const Post_content = require('./post_content');
const Report = require('./report');
const Restaurant = require('./restaurant');
const Rest_cate = require('./rest_cate');
const Transaction = require('./transaction');
const User = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Category = Category;
db.Comment = Comment;
db.Menu = Menu;
db.Post = Post;
db.Post_cate = Post_cate;
db.Post_content = Post_content;
db.Report = Report;
db.Restaurant = Restaurant;
db.Rest_cate = Rest_cate;
db.Transaction = Transaction;
db.User = User;

Category.init(sequelize);
Comment.init(sequelize);
Menu.init(sequelize);
Post.init(sequelize);
Post_cate.init(sequelize);
Post_content.init(sequelize);
Report.init(sequelize);
Restaurant.init(sequelize);
Rest_cate.init(sequelize);
Transaction.init(sequelize);
User.init(sequelize);

Category.associate(db);
Comment.associate(db);
Menu.associate(db);
Post.associate(db);
Post_cate.associate(db);
//Post_content.associate(db);
Report.associate(db);
Restaurant.associate(db);
Rest_cate.associate(db);
Transaction.associate(db);
User.associate(db);

module.exports = db;
