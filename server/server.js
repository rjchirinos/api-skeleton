const mongoose = require('mongoose');

const app = require('./express');

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  var isDevMode = true;
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-4zajv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running in port ${PORT}...`);
      if (isDevMode) console.log('App is in development mode...');
    });
  })
  .catch(err => {
    console.error('Unable to connect to MongoDB', err);
  });
