const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Please enter valid Email")
            }
        }
    },
    mobile: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate(val) {
            if (val.toString().length != 10) {
                throw new Error("Please enter valid Mobile Number")
            }
        }
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if (val.length < 8) {
                throw new Error("Password length must be minimum 8 characters")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynodecourse');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.statics.findByCredentail = async (email, password) => {
    console.log("At login by credentails")
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error("Unable to Login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to Login");
    }
    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    console.log("at pre save method")
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('Users', userSchema);



module.exports = User;