const fs = require('fs');
const { Post, Post_content, Post_cate, sequelize } = require('../../models');
const { QueryTypes } = require('sequelize');

module.exports = async function insertingTestPostData() {
  try {
    fs.readFile(
      './public/data/post_dummy.json',
      'utf-8',
      async (err, jsonFile) => {
        const jsonData = JSON.parse(jsonFile);
        //console.log(jsonFile);
        const { posts } = jsonData;
        let i = 0;
        for await (let item of posts) {
          await new Promise((resolve, reject) => setTimeout(resolve, 500));
          await creatingPostData(item);
          i++;
          console.log(i);
        }
      }
    );
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));

    await justConnecting();
    await justConnecting2();
    return;
  } catch (err) {
    console.error(err);
    return;
  }
};

async function creatingPostData(post) {
  try {
    let {
      delivery_fee,
      title,
      content,
      mem_count,
      rest_id,
      user_id,
      lat,
      long,
    } = post;
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

    await createPostData.addUser(parseInt(user_id));
    return;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function justConnecting() {
  try {
    const p1 = await Post.findOne({
      where: {
        id: 1,
      },
    });
    await p1.addUser(2);
    await p1.addUser(3);
    const p2 = await Post.findOne({
      where: {
        id: 2,
      },
    });
    await p2.addUser(1);
    await p2.addUser(3);
    await p2.addUser(4);
    const p3 = await Post.findOne({
      where: {
        id: 3,
      },
    });
    await p3.addUser(1);
    await p3.addUser(2);
    await p3.addUser(4);
    const p4 = await Post.findOne({
      where: {
        id: 4,
      },
    });
    await p4.addUser(1);
    await p4.addUser(2);
    const p6 = await Post.findOne({
      where: {
        id: 6,
      },
    });
    await p6.addUser(2);
    await p6.addUser(3);
    //console.log(p1, p2, p3, p4, p6);
    console.log('finished');
    return;
  } catch (err) {
    console.error(err);
    return;
  }
}

const query =
  'SELECT rc.category_id FROM post p JOIN restaurant r ON p.restaurant_id = r.id JOIN rest_cate rc ON r.id = rc.restaurant_id WHERE p.id = :id';
async function justConnecting2() {
  try {
    for (i = 1; i <= 6; i++) {
      const findCategory = await sequelize.query(query, {
        replacements: { id: i },
        type: QueryTypes.SELECT,
      });
      const findPost = await Post.findOne({
        where: {
          id: i,
        },
      });
      console.log(findPost);
      for await (item of findCategory) {
        await findPost.addCategory(item.category_id);
      }
    }
    return;
  } catch (err) {
    console.error(err);
    return;
  }
}
