const express = require('express'),
      app = express(),
      router = require('./routes'),
      cors = require('cors'),
      mongoose = require('mongoose'),
      httpResponse = require('express-http-response'),
      PORT = process.env.PORT || 3000;
      
      
mongoose.connect('mongodb://127.0.0.1:27017/gupshup', () => {
    console.log("Connected to database successfully.");
});

app.use(express.json());
app.use(cors());
app.use(router);
app.use(httpResponse.Middleware);

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}.`);
})