const express = require('express');
const { QueryTypes } = require('sequelize');
const { Post, Comment, sequelize, User } = require('../models');

const router = express.Router();

const Query_Get_Comment_Post =
  'SELECT c.content, c.created_at, u.name, u.id FROM comment c JOIN user u ON u.id = c.user_id WHERE c.post_id = :post_id ORDER BY c.created_at DESC';

router.get('/post', async (req, res, next) => {
  try {
    const { post_id } = req.query;
    const findCommentwithPost = await sequelize.query(Query_Get_Comment_Post, {
      replacements: {
        post_id: parseInt(post_id),
      },
      type: QueryTypes.SELECT,
    });
    if (!findCommentwithPost) {
      res.status(400).json({
        log: 'no comment found',
      });
    } else {
      res.status(200).json(findCommentwithPost);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'comment load failure',
    });
  }
});

router.get('/user', async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const findUser = await User.findOne({
      where: { id: user_id },
    });
    if (!findUser) {
      res.status(400).json({
        log: 'no user found',
      });
    }
    const findCommentwithUser = await Comment.findAll({
      where: { user_id: user_id },
      attributes: ['content', 'created_at', 'post_id', 'user_id'],
      order: [['created_at', 'DESC']],
    });
    if (!findCommentwithUser) {
      res.status(400).json({
        log: 'no comment found',
      });
    } else {
      res.status(200).json(findCommentwithUser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'comment load failure',
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { post_id, content, user_id } = req.body;
    const findPost = await Post.findOne({
      where: { id: post_id },
    });
    console.log(findPost);
    const findUser = await User.findOne({
      where: { id: user_id },
    });
    if (!findPost) {
      res.status(400).json({
        log: 'no post found',
      });
    } else if (!findUser) {
      res.status(400).json({
        log: 'no user found',
      });
    } else {
      const createComment = await Comment.create({
        post_id: post_id,
        content: content,
        user_id: user_id,
      });
      findPost.addComment(createComment);
      if (!createComment) {
        res.status(411).json({
          log: 'creating comment failure',
        });
      } else {
        res.status(200).json({
          log: 'creating comment success',
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'failure',
    });
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const { comment_id } = req.body;

    const findComment = await Comment.findOne({
      where: { id: comment_id },
    });

    if (!findComment) {
      res.status(400).json({
        log: 'no comment found',
      });
    } else {
      const destroyComment = await Comment.destroy({
        where: { id: comment_id },
      });
      res.status(200).json({
        log: 'comment delete success',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'comment delete failure',
    });
  }
});

module.exports = router;
