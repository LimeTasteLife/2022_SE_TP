const express = require('express');
const { Post, sequelize, Post_content } = require('../models');
const { QueryTypes } = require('sequelize');

const router = express.Router();

const Query_Get_Post_Category =
  'SELECT p.id, p.restaurant_id, p.title, p.mem_count, p.lat, p.long FROM post p JOIN post_cate pc ON p.id = pc.post_id JOIN category c ON c.id = pc.category_id WHERE c.name = :cate ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset';
const Query_Get_Post_User =
  'SELECT p.id, p.restaurant_id, p.title, p.mem_count, p.lat, p.long FROM post p JOIN user_post up ON p.id = up.post_id JOIN user u ON u.id = up.user_id WHERE u.id = :user_id ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset';
// get post lists with category
router.get('/category', async (req, res, next) => {
  try {
    const { category, pageNum } = req.query;
    if (!category) {
      res.status(400).json({
        log: 'wrong input',
      });
    }
    const cate = decodeURIComponent(category);

    const findPostwithCategory = await sequelize.query(
      Query_Get_Post_Category,
      {
        replacements: { cate: cate, limit: 10, offset: parseInt(pageNum) },
        type: QueryTypes.SELECT,
      }
    );
    if (!findPostwithCategory) {
      res.status(500).json({
        log: 'no post found',
      });
    } else {
      console.log(findPostwithCategory);
      res.status(200).json(findPostwithCategory);
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
    const { user_id, pageNum } = req.query;
    if (!pageNum) pageNum = 0;
    const findPostwithUser = await sequelize.query(Query_Get_Post_User, {
      replacements: {
        user_id: parseInt(user_id),
        limit: 10,
        offset: parseInt(pageNum),
      },
      type: QueryTypes.SELECT,
    });
    if (!findPostwithUser) {
      res.status(500).json({
        log: 'no post found',
      });
    } else {
      res.status(200).json(findPostwithUser);
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
      category_id,
      lat,
      long,
    } = req.body.post;
    const createPostData = await Post.create(
      {
        title: title,
        restaurant_id: parseInt(rest_id),
        lat: parseFloat(lat),
        long: parseFloat(long),
        mem_count: parseInt(mem_count),
        Post_content: {
          user_id: parseInt(user_id),
          delivery_fee: parseInt(delivery_fee),
          content: content,
        },
      },
      {
        include: [{ model: Post_content }],
      }
    );
    if (!createPostData) {
      res.status(400).json({
        log: 'making post failure',
      });
    } else {
      await createPostData.addCategory(parseInt(category_id));
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
router.put('/', async (req, res, next) => {
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

router.delete('/', async (req, res, next) => {
  try {
    const { post_id } = req.body;
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'post delete failure',
    });
  }
});

module.exports = router;
