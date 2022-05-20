const express = require('express');
const { Report } = require('../models');

const router = express.Router();

// making post
router.post('/', async (req, res, next) => {
  try {
    const { user_id, title, content, email, target_id } = req.body.report;
    const createReport = await Report.create({
      user_id: user_id,
      title: title,
      content: content,
      email: email,
      target_id: target_id,
    });
    if (!createReport) {
      res.status(500).json({
        log: 'making report failure',
      });
    } else {
      res.status(200).json({
        log: 'report success',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'report failure',
    });
  }
});

module.exports = router;
