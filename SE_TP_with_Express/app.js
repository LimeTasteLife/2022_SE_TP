const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { sequelize } = require('./models');
const indexRouter = require('./routes');
const categoryRouter = require('./routes/category');
const commentRouter = require('./routes/comment');
const postRouter = require('./routes/post');
const reportRouter = require('./routes/report');
const restaurantRouter = require('./routes/restaurant');
const userRouter = require('./routes/user');
const testInitialRouter = require('./routes/testInitial');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);
if (process.env.FIRST_CONNECT === true) {
  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log('Success to connect DB');
    })
    .catch((err) => {
      console.error(err);
    });
} else {
  sequelize
    .sync({})
    .then(() => {
      console.log('Success to connect DB');
    })
    .catch((err) => {
      console.error(err);
    });
}

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// json file parser
// should do it first.
app.use('/testInitial', testInitialRouter);

app.use('/category', categoryRouter);
app.use('/comment', commentRouter);
app.use('/post', postRouter);
app.use('/report', reportRouter);
app.use('/restaurant', restaurantRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const error = new Error(
    `${req.method} ${req.url} \n no response for routers`
  );
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500).json({
    status: err.status,
    log: err.message,
  });
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), ' waiting..');
});
