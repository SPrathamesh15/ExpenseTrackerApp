const User = require('../models/signup');

exports.postAddUser = async (req, res, next) => {
    try {
      const username = req.body.username;
      const useremail = req.body.useremail;
      const userpassword = req.body.userpassword;
  
      const data = await User.create({
        username: username,
        useremail: useremail,
        userpassword: userpassword,
      });
      console.log(data)
      res.status(201).json({ newUserDetails: data });
      console.log('Added to server');
    } catch (err) {
      console.error('Error in postAddProduct:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };