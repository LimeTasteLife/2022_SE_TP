const fs = require('fs');
const { User } = require('../../models');

module.exports = async function insertingTestUserData() {
  try {
    fs.readFile(
      './public/data/user_dummy.json',
      'utf-8',
      async (err, jsonFile) => {
        const jsonData = JSON.parse(jsonFile);
        //console.log(jsonFile);
        const { users } = jsonData;
        let i = 0;
        for await (let item of users) {
          await new Promise((resolve, reject) => setTimeout(resolve, 500));
          await creatingUserData(item);
          i++;
          console.log(i);
        }
      }
    );
    return;
  } catch (err) {
    console.error(err);
    return;
  }
};

async function creatingUserData(user) {
  try {
    let { account, password, name, email, point, img_url } = user;
    const createUserData = await User.create({
      account: account,
      password: password,
      name: name,
      email: email,
      point: parseInt(point),
      img_url: img_url,
    });
    return;
  } catch (err) {
    console.error(err);
    return;
  }
}
