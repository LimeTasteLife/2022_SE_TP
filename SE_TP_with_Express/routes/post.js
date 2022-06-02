const express = require('express');
const {
  Post,
  sequelize,
  Post_content,
  Post_cate,
  User_post,
  Restaurant,
  Party,
  Comment,
  User,
  Transaction,
} = require('../models');
const { QueryTypes } = require('sequelize');

const router = express.Router();

const limit = 10;
const Query_Get_Post_Category =
  'SELECT p.id, p.restaurant_id, p.title, p.mem_count, p.lat, p.lng FROM post p JOIN post_cate pc ON p.id = pc.post_id JOIN category c ON c.id = pc.category_id WHERE c.id = :category_id ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset';
const Query_Get_Post_User =
  'SELECT p.id, p.restaurant_id, p.title, p.mem_count, p.lat, p.lng FROM post p JOIN user_post up ON p.id = up.post_id JOIN user u ON u.id = up.user_id JOIN restaurant r ON r.id = p.restaurant_id WHERE u.id = :user_id ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset';

// get post lists with category
router.get('/category', async (req, res, next) => {
  try {
    const { category_id, page_num } = req.query;
    if (!category_id) {
      res.status(400).json({
        log: 'wrong input',
      });
    }

    const findPostwithCategory = await sequelize.query(
      Query_Get_Post_Category,
      {
        replacements: {
          category_id: parseInt(category_id),
          limit: limit,
          offset: parseInt(page_num) * limit,
        },
        type: QueryTypes.SELECT,
      }
    );
    let i = 0;
    for await (let item of findPostwithCategory) {
      const findRestaurantUrl = await Restaurant.findOne({
        attributes: ['url'],
        where: { id: item.restaurant_id },
      });
      const { url } = findRestaurantUrl.dataValues;
      findPostwithCategory[i].url = url;
      i++;
    }

    // console.log(findRestaurantUrl);
    if (!findPostwithCategory) {
      res.status(500).json({
        log: 'no post found',
      });
    } else {
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
    const { user_id, page_num } = req.query;
    if (!page_num) page_num = 0;
    const findPostwithUser = await sequelize.query(Query_Get_Post_User, {
      replacements: {
        user_id: parseInt(user_id),
        limit: limit,
        offset: parseInt(page_num) * limit,
      },
      type: QueryTypes.SELECT,
    });
    let i = 0;
    for await (let item of findPostwithUser) {
      const findRestaurantUrl = await Restaurant.findOne({
        attributes: ['url'],
        where: { id: item.restaurant_id },
      });
      const { url } = findRestaurantUrl.dataValues;
      findPostwithUser[i].url = url;
      i++;
    }
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
      lng,
    } = req.body.post;
    const createPostData = await Post.create(
      {
        title: title,
        restaurant_id: parseInt(rest_id),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
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
      lng,
    } = req.body.post;
    const updatePostData = await Post.update(
      {
        title: title,
        restaurant_id: parseInt(rest_id),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
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
  const t = await sequelize.transaction();
  try {
    const { post_id } = req.body;
    const findPost = await Post.findOne({
      where: { id: post_id },
    });
    if (!findPost) {
      res.status(400).json({
        log: 'no post found',
      });
    } else {
      const destroyPost_cate = await Post_cate.destroy(
        {
          where: { post_id: post_id },
        },
        { t }
      );
      const destoryUser_post = await User_post.destroy(
        {
          where: { post_id: post_id },
        },
        { t }
      );
      const findParty = await Party.findAll(
        {
          where: { post_id: post_id },
        },
        { t }
      );
      for await (item of findParty) {
        if (item.is_checked === true) {
          const findUser = await User.findOne({
            where: { id: item.user_id },
          });
          await User.update(
            {
              point: findUser.point + item.transaction_point,
            },
            { where: { id: item.user_id } },
            { t }
          );
          const createTransaction = await Transaction.create(
            {
              user_id: item.user_id,
              amount: parseInt(item.transaction_point),
              content: item.title + ' 파티해체',
            },
            { t }
          );
          await findUser.addTransaction(createTransaction);
        }
      }
      const destroyParty = await Party.destroy(
        {
          where: { post_id: post_id },
        },
        {
          t,
        }
      );
      const destroyComment = await Comment.destroy(
        {
          where: { post_id: post_id },
        },
        { t }
      );
      const destoryPost_content = await Post_content.destroy(
        {
          where: { post_id: post_id },
        },
        { t }
      );
      const destroyPost = await Post.destroy(
        {
          where: { id: post_id },
        },
        { t }
      );
      await t.commit();
      res.status(200).json({
        log: 'post delete success',
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: 'post delete failure',
    });
  }
});

module.exports = router;
