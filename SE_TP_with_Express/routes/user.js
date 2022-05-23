const express = require('express');
const User = require('../models/user');

const router = express.Router();

// user page loading
router.get('/', async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const findUser = await User.findOne({
      where: {
        id: user_id,
      },
    });
    if (!findUser) {
      res.status(400).json({
        log: 'no user found',
      });
    } else {
      res.status(200).json({
        user: [
          {
            name: findUser.name,
            point: findUser.point,
          },
        ],
        log: 'user page load success',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'user page load failure',
    });
  }
});

// user point deposit
router.patch('/dpst', async (req, res, next) => {
  try {
    const { user_id, point } = req.query;
    if (!user_id && !point) {
      res.status(400).json({
        log: 'wrong input',
      });
    }
    const findUser = await User.findOne({
      where: {
        id: user_id,
      },
    });
    if (!findUser) {
      res.status(400).json({
        log: 'no user found',
      });
    } else {
      findUser.update({ point: findUser.point + parseInt(point) });
      await findUser.save();
      res.status(200).json({
        log: `${user_id} user point deposit success`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: `${user_id} user point deposit failure`,
    });
  }
});

// user point withdraw
router.patch('/wtdr', async (req, res, next) => {
  try {
    const { user_id, point } = req.query;
    if (!user_id && !point) {
      res.status(400).json({
        log: 'wrong input',
      });
    }
    const findUser = await User.findOne({
      where: {
        id: user_id,
      },
    });
    if (!findUser) {
      res.status(400).json({
        log: 'no user found',
      });
    } else {
      if (findUser.point < parseInt(point)) {
        res.status(400).json({
          log: 'too much to withdraw',
        });
      } else {
        findUser.update({ point: findUser.point - parseInt(point) });
        await findUser.save();
        res.status(200).json({
          log: `${user_id} user point withdraw success`,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: `${user_id} user point withdraw failure`,
    });
  }
});

module.exports = router;
