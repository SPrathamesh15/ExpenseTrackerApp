const User = require('../models/signup');

exports.postLogInUser = async (req, res, next) => {
    try {
      const useremail = req.body.useremail;
      const existingUser = await User.findOne({ where: { useremail: useremail } });
      if (!existingUser) {
        console.log("user Doesn't exists!")
        return res.status(404).json({ error: "User Doesn't exists"});
      }       
      const existingUserPassword = existingUser.userpassword
      if(existingUser){
            if (existingUserPassword != req.body.userpassword){
                console.log("User password matching",existingUserPassword, req.body.userpassword)
                console.log("Password Doesn't Match!")
                return res.status(400).json({ error: "User Password Doesn't Match!"});
            }
      }
      const data = {
        useremail: useremail,
        // userpassword: userpassword, we are not showing this cause of security reasons
      };
      console.log(data)
      res.status(201).json({ newUserDetails: data });
      console.log('Logged In');
    } catch (err) {
      console.error('Error in postLogInUser:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };