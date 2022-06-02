const fs = require('fs');

fs.readFile('./example.json', 'utf-8', (err, jsonFile) => {
  const jsonData = JSON.parse(jsonFile);
  console.log(jsonFile);
  const { restaurants } = jsonData;
  restaurants.forEach((item) => {
    console.log(item);
  });
});
