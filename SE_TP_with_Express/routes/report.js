const express = require('express');
const { Report, sequelize, User } = require('../models');

const router = express.Router();

// making post
router.post('/', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { user_id, title, content, email, target_id, target_user_name } =
      req.body.report;
    if (user_id === 0) {
      const error = new Error('No user found');
      error.status = 400;
      throw error;
    }
    const createReport = await Report.create(
      {
        user_id: user_id,
        title: title,
        content: content,
        email: email,
        target_id: target_id,
        target_user_name: target_user_name,
      },
      { t }
    );
    const findUser = await User.findOne({
      where: { id: target_id },
    });
    if (!findUser) {
      const error = new Error('No user found');
      error.status = 400;
      throw error;
    }
    await User.update(
      {
        manner: findUser.manner - 10,
      },
      { where: { id: target_id } },
      { t }
    );
    if (!createReport) {
      const error = new Error('Making report failure');
      error.status = 411;
      throw error;
    } else {
      res.status(200).json({
        log: 'report success',
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(err.status || 500).json({
      log: err.message,
    });
  }
});

module.exports = router;
