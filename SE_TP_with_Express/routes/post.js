const express = require('express');
const { Post, Category, User } = require('../models');

const router = express.Router();

// get post lists with category
router.get('/category', async (req, res, next) => {
  try {
    const category = req.body.category;
    const pageNum = req.body.pageNum;
    if (!pageNum) pageNum = 0;
    const findPostwithCategory = await Post.findAll({
      include: [
        {
          model: Category,
          where: {
            category: category,
          },
        },
      ],
      order: [['createdAt'], ['DESC']],
      limit: 10,
      offset: pageNum,
    });
    if (!findPostwithCategory) {
      res.status(500).json({
        log: 'no post found',
      });
    } else {
      res.status(200).json(findPostwithCategory, {
        log: 'post load success',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'post load failure',
    });
  }
});

// get post lists with user_id
router.get('/user', async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const pageNum = req.body.pageNum;
    if (!pageNum) pageNum = 0;
    const findPostwithCategory = await Post.findAll({
      include: [
        {
          model: User,
          where: {
            user_id: user_id,
          },
        },
      ],
      order: [['createdAt'], ['DESC']],
      limit: 10,
      offset: pageNum,
    });
    if (!findPostwithCategory) {
      res.status(500).json({
        log: 'no post found',
      });
    } else {
      res.status(200).json(findPostwithCategory, {
        log: 'post load success',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'post load failure',
    });
  }
});

// making post
router.post('/', async (req, res, next) => {
  try {
    const {
      delivery_fee,
      title,
      content,
      mem_count,
      rest_id,
      user_id,
      lat,
      long,
    } = req.body.post;
    const createPostData = await Post.create({
      title: title,
      restaurant_id: parseInt(rest_id),
      lat: parseFloat(lat),
      long: parseFloat(long),
      mem_count: parseInt(mem_count),
    });
    const creatPostContentData = await Post_content.create({
      post_id: createPostData.id,
      user_id: parseInt(user_id),
      delivery_fee: parseInt(delivery_fee),
      content: content,
    });
    if (!createPostData || !creatPostContentData) {
      res.status(400).json({
        log: 'making post failure',
      });
    } else {
      await createPostData.addUser(parseInt(user_id));
      res.status(200).json({
        log: 'post insert success',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'post insert failure',
    });
  }
});

// updating post
router.patch('/', async (req, res, next) => {
  try {
    const {
      id,
      delivery_fee,
      title,
      content,
      mem_count,
      rest_id,
      user_id,
      lat,
      long,
    } = req.body.post;
    const updatePostData = await Post.update(
      {
        title: title,
        restaurant_id: parseInt(rest_id),
        lat: parseFloat(lat),
        long: parseFloat(long),
        mem_count: parseInt(mem_count),
      },
      { where: { id: id } }
    );
    const updatePostContentData = await Post_content.update(
      {
        user_id: parseInt(user_id),
        delivery_fee: parseInt(delivery_fee),
        content: content,
      },
      {
        where: { post_id: id },
      }
    );
    res.status(200).json({
      log: 'post update success',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'post update failure',
    });
  }
});

module.exports = router;
