const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});
router.post('/', async (req, res, next) => {
  try {
  } catch (err) {
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
