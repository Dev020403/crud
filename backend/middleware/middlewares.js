const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
    };
    const options = {
        expiresIn: "24h",
    };
    const token = jwt.sign(payload, '12345', options);
    return token;
};

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    if (!token) {
        return res.status(403).json({ success: false, message: "Token is required" });
    }
    jwt.verify(token, '12345', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { generateToken, verifyToken };
