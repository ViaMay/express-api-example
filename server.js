const express = require('express');
const cors = require('cors');
const app = express(),
      bodyParser = require("body-parser");
// const {readFileData} = require("./readFileData");
      port = 3001;
const postsRoutes = require('./posts/postsRoutes');
const categoriesRoutes = require('./categories/categoriesRoutes');


app.use(bodyParser.json());
app.use(cors());
app.use('/', postsRoutes); // Использование маршрутов, связанных с постами
app.use('/', categoriesRoutes); //

app.post('/v1/api/sign-up', (req, res) => {
  console.log('api/sign-up called!');
  const { email } = req.body;
  res.status(200).send({
      idToken: "idToken",
      expiresIn: true,
      email,
  });
});

app.get('/', (req,res) => {
  res.send(`<h1>API Running on the port${port}</h1>`);
});


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});



