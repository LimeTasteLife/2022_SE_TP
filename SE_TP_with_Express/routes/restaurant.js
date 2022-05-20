const express = require('express');
const { Restaurant, Category, Menu } = require('../models');

const router = express.Router();

// get restaurant lists with category
router.get('/category', async (req, res, next) => {
  try {
    const category = req.body.category;
    const pageNum = req.body.pageNum;
    if (!pageNum) pageNum = 0;
    const findRestaurantwithCategory = await Restaurant.findAll({
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
    if (!findRestaurantwithCategory) {
      res.status(500).json({
        log: 'no restaurant found',
      });
    } else {
      res.status(200).json(findRestaurantwithCategory, {
        log: 'restaurant load success',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      log: 'restaurant load failure',
    });
  }
});

// inserting restaurant
router.post('/', async (req, res, next) => {
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
      categories,
      lat,
      lng,
    } = req.body.restaurant;

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
