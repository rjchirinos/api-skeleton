const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = app => {
  app.post('/api/users', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const alreadyUser = await User.findOne({ email });
      if (alreadyUser) {
        res.status(400).send('User already exist...');
        throw new Error('User already exist...');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        email,
        password: hashedPassword
      });
      const result = await user.save();
      res.send({
        ...result._doc,
        password: null
      });
    } catch (err) {
      throw err;
    }
  });
};
