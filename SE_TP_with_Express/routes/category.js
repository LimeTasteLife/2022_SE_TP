const express = require('express');
const { Category } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const findCategoryAll = await Category.findAll({
      where: {},
      order: [['id', 'ASC']],
    });
    if (!findCategoryAll) {
      res.status(400).json({
        log: 'category find failure',
      });
    } else {
      res.status(200).json(findCategoryAll);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'category load failure',
    });
  }
});

module.exports = router;
