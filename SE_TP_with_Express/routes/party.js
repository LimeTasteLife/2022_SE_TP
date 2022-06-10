const express = require('express');
const {
  sequelize,
  User,
  Post,
  Party,
  Transaction,
  Post_content,
} = require('../models');

const router = express.Router();

router.get('/post', async (req, res, next) => {
  try {
    const result = [];
    const { post_id } = req.query;
    if (!post_id) {
      throw new Error('wrong input');
    }
    const findPost = await Post.findOne({
      where: { id: post_id },
    });
    if (findPost.cur_mem === findPost.mem_count) {
      throw new Error('party already full');
    }
    if (findPost.is_complete === true) {
      throw new Error('post(party) already complete');
    }
    const findParty = await Party.findAll({
      attributes: [
        'id',
        'content',
        'transaction_point',
        'is_checked',
        'user_id',
      ],
      where: { post_id: post_id },
    });

    if (!findParty) {
      throw new Error('no party found');
    }

    for await (item of findParty) {
      const findUser = await User.findOne({
        attributes: ['name'],
        where: { id: item.user_id },
      });
      item.dataValues.name = findUser.name;
      result.push(item);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: err.message,
    });
  }
});

router.post('/accept', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { party_id } = req.body;
    if (!party_id) {
      throw new Error('wrong input');
    }
    const findParty = await Party.findOne({
      where: { id: party_id },
    });
    if (!findParty) {
      throw new Error('no party found');
    }
    if (findParty.is_checked === true) {
      throw new Error('already joined');
    }
    await Party.update(
      { is_checked: true },
      { where: { id: party_id } },
      { t }
    );
    const findUser = await User.findOne({
      where: { id: findParty.user_id },
    });
    if (findUser.point < findParty.transaction_point) {
      throw new Error('low point');
    }
    await User.update(
      { point: findUser.point - findParty.transaction_point },
      { where: { id: findParty.user_id } },
      { t }
    );

    const findPost = await Post.findOne({
      where: { id: findParty.post_id },
    });
    if (findPost.is_complete === true) {
      throw new Error('Post(party) already complete');
    }
    if (findPost.cur_mem >= findPost.mem_count) {
      throw new Error('Post(party) already full');
    }
    const createTransaction = await Transaction.create(
      {
        user_id: findParty.user_id,
        amount: parseInt(findParty.transaction_point) * -1,
        content: findPost.title + ' 파티 참가',
      },
      { t }
    );
    await findUser.addTransaction(createTransaction, { t });
    if (findPost.cur_mem >= findPost.mem_count) {
      throw new Error('party already fulled');
    }
    await Post.update(
      { cur_mem: find.cur_mem + 1 },
      { where: { id: findParty.post_id } },
      { t }
    );
    await t.commit();
    res.status(200).json({
      log: 'part accept success',
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: err.message,
    });
  }
});

router.post('/complete', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { post_id } = req.body;
    if (!post_id) {
      throw new Error('wrong input');
    }
    const findPost = await Post.findOne(
      {
        where: { id: post_id },
      },
      { t }
    );
    if (findPost.is_complete === true) {
      throw new Error('Post(Party) already complete');
    }
    await Post.update(
      {
        is_complete: true,
      },
      {
        where: { id: post_id },
      },
      { t }
    );
    const findPost_content = await Post_content.findOne({
      where: { post_id: post_id },
    });
    const findParty = await Party.findAll(
      {
        where: { post_id: post_id },
      },
      { t }
    );
    let amount = 0;
    for await (item of findParty) {
      if (item.is_checked === true) {
        amount = amount + item.transaction_point;
        let findUseri = await User.findOne(
          {
            where: { id: item.user_id },
          },
          { t }
        );
        await User.update(
          { manner: findUseri.manner + 1 },
          { where: { id: item.user_id } },
          { t }
        );
      }
    }
    const createTransaction = await Transaction.create(
      {
        user_id: findPost_content.user_id,
        amount: parseInt(amount),
        content: findPost.title + ' 포인트 입금',
      },
      { t }
    );
    const findUser = await User.findOne(
      {
        where: { id: findPost_content.user_id },
      },
      { t }
    );
    await User.update(
      {
        point: findUser.point + amount,
        manner: findUser.manner + 1,
      },
      { where: { id: findPost_content.user_id } },
      { t }
    );
    await findUser.addTransaction(createTransaction, { t });
    await t.commit();
    res.status(200).json({
      log: 'post complete success',
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: err.message,
    });
  }
});

router.delete('/reject', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { party_id } = req.body;
    const findParty = await Party.findOne({
      where: { id: party_id },
    });
    if (!findParty) {
      res.status(400).json({
        log: 'no party found',
      });
    } else {
      if (findParty.is_checked === true) {
        res.status(400).json({
          log: 'failure party already checked',
        });
      } else {
        const destroyParty = await Party.destroy(
          {
            where: { id: party_id },
          },
          { t }
        );
        await t.commit();
        res.status(200).json({
          log: 'party reject success',
        });
      }
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: 'party reject failure',
    });
  }
});

router.post('/join', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { user_id, post_id, transaction_point, content } = req.body;
    if (!user_id || !post_id || !content) {
      throw new Error('wrong input');
    }

    const findUser = await User.findOne({
      where: { id: user_id },
    });
    if (!findUser) {
      throw new Error('no user found');
    }
    if (transaction_point > findUser.point) {
      throw new Error('no point');
    }
    const findPost = await Post.findOne({
      where: { id: post_id },
    });
    if (!findPost) {
      throw new Error('no post found');
    }
    if (findPost.cur_mem === findPost.mem_count) {
      throw new Error('party already full');
    }
    if (findPost.is_complete === true) {
      throw new Error('party already closed');
    }

    const createParty = await Party.create(
      {
        content: content,
        user_id: user_id,
        transaction_point: transaction_point,
      },
      { t }
    );

    await findPost.addParty(createParty, { t });

    await t.commit();
    res.status(200).json({
      log: 'party join success',
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: err.message,
    });
  }
});

router.delete('/', async (req, res, next) => {
  const t = sequelize.transaction();
  try {
  } catch (err) {}
});

router.patch('/', async (req, res, next) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

module.exports = router;
