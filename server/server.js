const app = require('./express');
const PORT = process.env.PORT || 5000;

app.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`App running on port ${PORT}...`);
});
