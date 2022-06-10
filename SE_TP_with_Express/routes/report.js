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
      throw new Error('No user found');
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
      throw new Error('No user found');
    }
    await User.update(
      {
        manner: findUser.manner - 10,
      },
      { where: { id: target_id } },
      { t }
    );
    if (!createReport) {
      throw new Error('Making report failure');
    } else {
      res.status(200).json({
        log: 'report success',
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: err.message,
    });
  }
});

module.exports = router;
