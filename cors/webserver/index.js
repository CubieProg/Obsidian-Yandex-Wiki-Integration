import express from 'express';
import cors from 'cors';

const app = express();


var whitelist = ['https://wiki.yandex.ru', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// app.use(cors());

app.get('/', cors(corsOptions), (req, res) => {
  // res.send({ message: 'Hello, World!' });
  res.redirect('https://wiki.yandex.ru/');

});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



// var express = require('express')
// var cors = require('cors')
// var app = express()
 
// var whitelist = ['https://wiki.yandex.ru', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
 
// app.get('/products/:id', cors(corsOptions), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
// })
 
// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })