const express = require('express');
const { resolve } = require('path');
const Profile = require('./models/Profile');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
const port = 3010;
const MONGO_URI = "mongodb+srv://vigneshpan08:vigneshpan08@cluster0.2pnpynh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose
.connect(MONGO_URI)
.then(()=>{
    console.log("✔️ mongoDB connection successful!")
})
.catch((err)=> console.error("❌ Connection Failed",err))


app.get('/', (req, res) => {
  res.send({message:"Welcome to the Server!"});

});

app.post('/profile', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Profile({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({ success: true, message: 'Profile Creation Successful!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', err });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
