const express = require('express');
const User = require("../models/users");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require("../middleware/auth");

const router = new express.Router();

router.post('/qsServices/createUser', async (req, resp) => {
    const createUser = new User(req.body);
    try {
        await createUser.save();
        const token = await createUser.generateAuthToken();
        const headerDto = {
            responseCode: 201
        }
        resp.status(201).send({ token, headerDto });
    } catch (e) {
        resp.status(500).send(e);
    }
})

router.post('/qsServices/login', async (req, resp) => {
    try {
        const user = await User.findByCredentail(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        const headerDto = {
            responseCode: 200
        }
        resp.send({ user, token, headerDto })
    } catch (e) {
        resp.status(404).send(e)
    }
})

router.post('/qsServices/user/logout', checkAuth, async (req, resp) => {
    try {
        req.user.tokens = req.user.tokens.filter((Obj) => {
            return Obj.token !== req.token;
        })
        console.log(req.user.tokens)
        console.log(req.token)
        const user = await req.user.save();
        resp.send("Successfully logout!!");
    } catch (e) {
        resp.status(400).send();
    }
})

router.post('/qsServices/user/logoutAll', checkAuth, async (req, resp) => {
    try {
        req.user.tokens = [];
        const user = await req.user.save();
        const headerDto = {
            responseCode: 200
        }
        resp.status(200).send({ headerDto })
    } catch (e) {
        resp.status(404).send("ERROR")
    }
})

router.get('/qsServices/user/me', checkAuth, async (req, resp) => {
    try {
        resp.status(200).send(req.user);
    } catch (e) {
        resp.status(500).send();
    }
})

router.post('/qsServices/user/updateMe', checkAuth, async (req, resp) => {
    const updates = Object.keys(req.body);
    console.log(updates)
    const UpdateColumns = ['firstName', 'fatherName', 'lastName', 'grandFatherName', 'dob', 'gender', 'mobile', 'email'];
    const updatesPermission = updates.every((update) => UpdateColumns.includes(update))
    console.log("updatesPermission", updatesPermission);
    if (!updatesPermission) {
        return resp.status(401).send({ message: "invalid_updte" })
    }

    try {
        const user = req.user
        updates.forEach((update) => {
            user[update] = req.body[update];
        })

        await user.save();
        resp.status(200).send({ message: "updated", statusCode:200 });
    } catch (e) {
        resp.status(500).send();
    }
})

router.delete('/qsServices/user/deleteMe', checkAuth, async (req, resp) => {
    try {
        await req.user.remove();
        resp.status(200).send(req.user)
    } catch (e) {
        resp.status(500).send(e)
    }

})

module.exports = router;