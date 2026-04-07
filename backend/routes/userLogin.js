
import express from 'express';
import UserLogin from '../models/UserLogin.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await UserLogin.find({}, { gmail: 1, password: 1, _id: 0 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { gmail, password, username } = req.body;

  try {
    const user = await UserLogin.findOne({ gmail, password, username });

    if (user) {
      res.status(200).json({
        success: true,
        message: 'Login successful',
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username, email or password',
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
