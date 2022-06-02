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
    //await insertingTestRestaurantData();
    await insertingTestPostData();
    console.log('Test Initializing finished.');
    process.env.FIRST_CONNECT = 'false';
    next();
  } else {
    console.log('Initializing already finished.');
    next();
  }
});

module.exports = router;
