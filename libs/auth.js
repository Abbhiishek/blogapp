const JWT = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;


function createTokenforuser(user) {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        fullname: user.fullname,
        profileImageUrl: user.profileImageUrl
    }
    return JWT.sign(payload, secret, { expiresIn: '30d' });
}


function verifyToken(token) {
    return JWT.verify(token, secret);
}

function checkforAuthenticatedUser(cookieName) {
    return (req, res, next) => {
        const token = req.cookies[cookieName];
        if (!token) {
            return next();
        }
        try {
            const user = verifyToken(token);
            req.user = user;
        } catch (error) { }

        next();
    }

}


module.exports = {
    createTokenforuser,
    verifyToken,
    checkforAuthenticatedUser
}