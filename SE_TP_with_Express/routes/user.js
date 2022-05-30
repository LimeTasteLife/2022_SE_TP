const express = require('express');
const { Transaction, sequelize, User } = require('../models');

const router = express.Router();
const limit = 10;
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

const Query_Get_User_Transaction =
  'SELECT t.amount t.content FROM User u JOIN transaction t ON u.id = t.user_id WHERE u.id = :user_id ORDER BY t.created_at DESC LIMIT :limit OFFSET :offset';
router.get('/transaction', async (req, res, next) => {
  try {
    const { user_id, pageNum } = req.query;
    if (!pageNum) pageNum = 0;
    const findUser = await sequelize.query(Query_Get_User_Transaction, {
      replacements: {
        user_id: user_id,
        limit: limit,
        offset: parseInt(pageNum) * limit,
      },
      type: QueryTypes.SELECT,
    });
    if (!findUser) {
      res.status(400).json({
        log: 'no transaction found',
      });
    } else {
      res.status(200).json(findUser);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({
      log: 'user transaction load failure',
    });
  }
});

// user point deposit
router.patch('/dpst', async (req, res, next) => {
  const t = await sequelize.transaction();
  const { user_id, point } = req.body;
  try {
    if (!user_id && !point) {
      throw new Error('wrong input');
    }
    const findUser = await User.findOne(
      {
        where: {
          id: user_id,
        },
      },
      { t }
    );
    if (!findUser) {
      throw new Error('no user found');
    } else {
      await findUser.update({ point: findUser.point + parseInt(point) }, { t });
      await findUser.save({ t });
      const makeTransaction = Transaction.create(
        {
          user_id: user_id,
          amount: parseInt(point),
          content: '입금',
        },
        { t }
      );
      await findUser.addTransaction(makeTransaction);
      await t.commit();
      res.status(200).json({
        log: `${user_id} user point deposit success`,
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: `${user_id} user point deposit failure`,
    });
  }
});

// user point withdraw
router.patch('/wtdr', async (req, res, next) => {
  const t = await sequelize.transaction();
  const { user_id, point } = req.body;
  try {
    if (!user_id && !point) {
      throw new Error('wrong input');
    }
    const findUser = await User.findOne(
      {
        where: {
          id: user_id,
        },
      },
      { t }
    );
    if (!findUser) {
      throw new Error('no user found');
    } else {
      if (findUser.point < parseInt(point)) {
        throw new Error('too much to withdraw');
      } else {
        await findUser.update(
          { point: findUser.point - parseInt(point) },
          { t }
        );
        await findUser.save({ t });
        const makeTransaction = Transaction.create(
          {
            user_id: user_id,
            amount: parseInt(point) * -1,
            content: '출금',
          },
          { t }
        );
        await findUser.addTransaction(makeTransaction);
        await t.commit();
        res.status(200).json({
          log: `${user_id} user point withdraw success`,
        });
      }
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: `${user_id} user point withdraw failure`,
    });
  }
});

module.exports = router;
