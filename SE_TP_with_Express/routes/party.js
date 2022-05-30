const express = require('express');
const { sequelize } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

router.post('/', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    c;
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({});
  }
});

router.patch('/', async (req, res, next) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

module.exports = router;
