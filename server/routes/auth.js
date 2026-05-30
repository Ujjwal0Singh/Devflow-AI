const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/sign-up', async (req, res) => {
  try {
    const {email, password} = req.body;
    let user = await User.findOne({email});
    if (user) return res.status(400).json({error: "User Already exist"})

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({email, password: hashedPassword});
    await user.save();

    res.status(201).json({message: "User Registered Successfully"});
  }
  catch (err){
    console.error(err);
    res.status(500).json({error: "Server error during sign-up."})
  }
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error: "Invalid Credentials"});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({error: "Invalid Credentials"});

    const token = jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET,
      {expiresIn: '24h'}
    )
    res.json({token, user: {id: user._id, email: user.email}});
  }
  catch (err){
    res.status(500).json({error: "Server error during login."})
  }
})

module.exports = router;