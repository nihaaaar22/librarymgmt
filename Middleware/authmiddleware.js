const jwt = require('jsonwebtoken');

const authmiddlewareadmin = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization token found. go to /login. username:rahulv,password:password3 or use token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvaGFua3VtYXIiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTczMzE1MjU3M30.VPZUw2f_0oNvR2mtyILyLx7UvM8YwTCB4AqbG8aSGqI" });
      }
  
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
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization token found. go to /login. username:rahulv,password:password3 or use token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvaGFua3VtYXIiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTczMzE1MjU3M30.VPZUw2f_0oNvR2mtyILyLx7UvM8YwTCB4AqbG8aSGqI " });
      }
  
      const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

module.exports = { authmiddlewareadmin, authmiddleware };