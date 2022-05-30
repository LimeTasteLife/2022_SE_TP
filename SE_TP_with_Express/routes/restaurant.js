const express = require('express');
const {
  Restaurant,
  Category,
  Menu,
  sequelize,
  Rest_cate,
} = require('../models');
const { QueryTypes } = require('sequelize');

const router = express.Router();

const limit = 10;
const Query_Get_Restaurant_Category =
  'SELECT r.id, r.name, r.review_avg, r.begin, r.end, r.min_order_amount, r.delivery_fee, r.delivery_time, r.phone, r.address, r.url, r.lat, r.lng FROM restaurant r JOIN rest_cate rc ON r.id = rc.restaurant_id JOIN category c ON c.id = rc.category_id WHERE c.id = :category_id ORDER BY r.created_at DESC LIMIT :limit OFFSET :offset';

// get restaurant lists with category
router.get('/category', async (req, res, next) => {
  try {
    const { category_id, pageNum } = req.query;
    if (!category_id) {
      res.status(400).json({
        log: 'wrong input',
      });
    }
    if (!pageNum) pageNum = 0;

    const findRestaurantwithCategory = await sequelize.query(
      Query_Get_Restaurant_Category,
      {
        replacements: {
          category_id: parseInt(category_id),
          limit: limit,
          offset: parseInt(pageNum) * limit,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (!findRestaurantwithCategory) {
      res.status(500).json({
        log: 'no restaurant found',
      });
    } else {
      res.status(200).json(findRestaurantwithCategory);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'restaurant load failure',
    });
  }
});

// inserting restaurant
router.post('/full', async (req, res, next) => {
  try {
    const { info, menu } = req.body.restaurant;
    const {
      id,
      name,
      review_avg,
      begin,
      end,
      min_order_amount,
      estimated_delivery_time,
      adjusted_delivery_fee,
      phone,
      address,
      url,
      categories,
      lat,
      lng,
    } = info;

    const createRestaurantData = await Restaurant.create({
      id: id,
      name: name,
      review_avg: review_avg,
      begin: begin,
      end: end,
      min_order_amount: min_order_amount,
      delivery_fee: adjusted_delivery_fee,
      delivery_time: estimated_delivery_time,
      phone: phone,
      address: address,
      url: url,
      lat: lat,
      lng: lng,
    });
    if (!createRestaurantData) {
      res.status(400).json({
        log: 'restaurant insert failure',
      });
    } else {
      checkCategory(createRestaurantData, categories);
      addMenus(createRestaurantData, menu, id);
      res.status(200).json({
        log: 'restaurant insert success',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'restaurant insert failure',
    });
  }
});

// updating restaurants
router.patch('/', async (req, res, next) => {
  try {
    const {
      id,
      name,
      review_avg,
      begin,
      end,
      min_order_amount,
      estimated_delivery_time,
      adjusted_delivery_fee,
      phone,
      address,
      url,
      lat,
      lng,
    } = req.body.restaurant;
    const updateRestaurant = await Restaurant.update(
      {
        name: name,
        review_avg: review_avg,
        begin: begin,
        end: end,
        min_order_amount: min_order_amount,
        delivery_fee: adjusted_delivery_fee,
        delivery_time: estimated_delivery_time,
        phone: phone,
        address: address,
        url: url,
        lat: lat,
        lng: lng,
      },
      { where: { id: id } }
    );
    res.status(200).json({
      log: 'restaurant update success',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'restaurant update failure',
    });
  }
});

router.delete('/', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { restaurant_id } = req.body;
    const findRestaurant = await Restaurant.findOne({
      where: { id: restaurant_id },
    });
    if (!findRestaurant) {
      res.status(400).json({
        log: 'no restaurant found',
      });
    } else {
      const destroyMenu = await Menu.destory(
        {
          where: { restaurant_id: restaurant_id },
        },
        { t }
      );
      const destoryRest_cate = await Rest_cate.destroy(
        {
          where: { restaurant_id: restaurant_id },
        },
        { t }
      );
      const destoryRestaurant = await Restaurant.destroy(
        {
          where: { id: restaurant_id },
        },
        { t }
      );
      await t.commit();
      res.status(200).json({
        log: 'restaurant delete success',
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      log: 'restaurant delete failure',
    });
  }
});

async function checkCategory(rest, categories) {
  try {
    if (categories) {
      const result = await Promise.all(
        categories.map(async (category) => {
          //console.log(category);
          return Category.findOrCreate({
            where: { name: category },
            defaults: { name: category },
          });
        })
      );
      await rest.addCategory(result.map((r) => r[0]));
      //console.log('cate add finished');
    }
    return;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function addMenus(rest, menu, rest_id) {
  try {
    await Promise.all(
      menu.map(async (item) => {
        //console.log(item);
        let { original_image, image, price, name } = item;
        const createMenu = await Menu.create({
          restaurant_id: rest_id,
          name: name,
          price: parseInt(price),
          url: image, // original image?
        });
        await rest.addMenu(createMenu);
        //console.log('adding menu finished');
      })
    );
    return;
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports = router;
