const mongoose = require('mongoose');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('./Model/userSchema');
const authmiddleware = require('./Middleware/authmiddleware');
const bookcontroller = require('./bookcontroller')
const usercontroller = require('./usercontroller')


mongoose.connect('mongodb+srv://sahilomanwar:EaqSu75Se0rGHAwd@clustermesss.2pykyse.mongodb.net/libmgmt', {
    
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
});


app.use(express.json());

app.get('/',async(req,res)=>{
    res.send("following are the end points that you can use : \n /register \n/login \n /books \n /user \n /books/borrow/:bookid \n /books/return/:bookid \n admin/books/update/:bookid")
})

app.post('/register', async (req, res) => {
    try{
    const { name, username, password, email, mobile, admin } = req.body;
    const user = new User({ name, username, password, email, mobile, admin });
    await user.save();
    res.status(201).json(user);
}

    catch(error){
        res.status(400).json({ message: error.message });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    jwt.sign({ username: user.username, admin: user.admin }, 'secretkey', (err, token) => {
        if (err) return res.status(500).json({ message: 'Error generating token' });
        res.status(200).json({ token });
    });

});

app.use('/books',authmiddleware.authmiddleware,bookcontroller)
app.use('/users',authmiddleware.authmiddleware,usercontroller)
app.use('/admin/books',authmiddleware.authmiddlewareadmin,bookcontroller)



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});