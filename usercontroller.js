const express = require('express');
const router = express.Router();
const user = require('./Model/userSchema')


router.get('/', async (req, res) => {
    try {
        let users = await user.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send("Error in retrieving the users");
    }
});

module.exports = router