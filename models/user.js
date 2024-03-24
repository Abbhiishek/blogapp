const mongoose = require('mongoose');
const crypto = require('crypto');
const { createTokenforuser } = require('../libs/auth');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImageUrl: {
        type: String,
        default: "/images/avatar.png"
    },
    fullname: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'potato'],
        default: 'user'
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// specials functions


userSchema.pre('save', function (next) {
    // crazy level things
    const user = this;
    if (!user.isModified('password')) return next();

    // generate salt
    const salt = crypto.randomBytes(16).toString('hex');
    const hashpassword = crypto.createHmac('sha256', salt)
        .update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashpassword;
    next();
});


userSchema.static('authenticate', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('user not found');
    const hashpassword = crypto.createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');
    if (hashpassword !== user.password) throw Error('password is not correct');
    const token = createTokenforuser(user);
    return token;
})

const User = mongoose.model('User', userSchema);
module.exports = User;