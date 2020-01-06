const User = require("../models/users");
const jwt = require("jsonwebtoken");

const checkAuth = async function (req, resp, next) {
    try {
        const authToken = req.headers.authorization.replace("Bearer ", "");
        console.log("AT middleware", authToken)
        const token = await jwt.verify(authToken, 'thisismynodecourse');
        console.log(token)
        const getUser = await User.findOne({ _id: token._id, 'tokens.token': authToken })
        //console.log(getUser)
        if (!getUser) {
            throw new Error();
        }
        req.token = authToken;
        req.user = getUser;
        next();
    } catch (e) {
        resp.status(401).send("Unauthorized");
    }

}

module.exports = checkAuth;