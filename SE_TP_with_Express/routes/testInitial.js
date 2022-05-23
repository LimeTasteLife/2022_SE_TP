const express = require('express');
const insertingTestRestaurantData = require('./initializing/insertTestRestaurantData');
const insertingTestUserData = require('./initializing/insertTestUserData');
const insertingTestPostData = require('./initializing/insertTestPostData');

const router = express.Router();

router.use(async (req, res, next) => {
  console.log('Test Initializing ...');
  await insertingTestUserData();
  await insertingTestRestaurantData();
  await insertingTestPostData();
  console.log('Test Initializing finished.');
  next();
});

module.exports = router;
