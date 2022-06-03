const express = require('express');
const dotenv = require('dotenv');
const insertingTestRestaurantData = require('./initializing/insertTestRestaurantData');
const insertingTestUserData = require('./initializing/insertTestUserData');
const insertingTestPostData = require('./initializing/insertTestPostData');

const router = express.Router();
dotenv.config();

router.use(async (req, res, next) => {
  if (process.env.FIRST_CONNECT === 'true') {
    console.log('Test Initializing ...');
    await insertingTestUserData();
    await insertingTestRestaurantData();
    await insertingTestPostData();
    console.log('Test Initializing finished.');
    req.message = 'Test Initializing finished.';
    process.env.FIRST_CONNECT = 'false';
    next();
  } else {
    console.log('Initializing already finished.');
    req.message = 'Initializing already finished.';
    next();
  }
});

router.get('/', (req, res, next) => {
  res.status(200).json({
    log: req.message,
  });
});

module.exports = router;
