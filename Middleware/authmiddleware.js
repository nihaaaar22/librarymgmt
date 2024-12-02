const jwt = require('jsonwebtoken');

const authmiddlewareadmin = (req, res, next) => {
    
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        if(decoded.admin){
            next();
        }
        else{
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });
};

const authmiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

module.exports = { authmiddlewareadmin, authmiddleware };