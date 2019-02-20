const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  app.get('/api/users', async (req, res) => {
    const users = await User.find();
    const result = users.map(user => {
      return {
        ...user._doc,
        password: null
      };
    });
    res.send(result);
  });

  app.post('/api/auth', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send('This user does not exist...');
      throw new Error('This user does not exist...');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      res.status(401).res('Incorrect password...');
      throw new Error('Incorrect password...');
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.TOKEN,
      { expiresIn: '1h' }
    );
    res.send({
      userId: user._id,
      token,
      tokenExpiration: 1
    });
  });
};
