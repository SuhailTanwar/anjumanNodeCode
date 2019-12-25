const express = require('express');
const User = require("../models/create-account");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = new express.Router();

router.post('/create-account', async (req, resp) => {

    const createUser = new User(req.body);
    try {
        await createUser.save();
        const token = await createUser.generateAuthToken();
        resp.status(201).send(token);
    } catch (e) {
        resp.status(500).send(e);
    }
})

router.post('/login', async (req, resp) => {
    try {
        const user = await User.findByCredentail(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        resp.send({ user, token: token })
    } catch (e) {
        resp.status(404).send(e)
    }
})


router.get('/getUsers', async (req, resp) => {

    try {
        const users = await User.find({});
        resp.send(users);
    } catch (e) {
        resp.status(500).send();
    }
    // User.find({}).then((users) => {
    //     resp.send(users)
    // }).catch((error) => {
    //     resp.status(500).send();
    // })
})

router.get('/getUser/:id', async (req, resp) => {
    const _id = req.params.id;
    console.log(_id)
    try {
        console.log("at try block")
        const user = await User.findById(_id);
        console.log(user)
        if (!user) {
            console.log(user)
            return resp.status(404).send();
        } else {
            resp.send(user);
        }

    } catch (e) {
        //console.log("at Catch block", e)
        resp.status(500).send();
    }


    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return resp.status(404).send();
    //     }
    //     resp.send(user);
    // }).catch((err) => {
    //     resp.status(500).send(err);
    // })
})

router.patch('/user/:id', async (req, resp) => {
    const updates = Object.keys(req.body);
    console.log(updates)
    const UpdateColumns = ['firstName', 'lastName', 'password', 'fartherName', 'mobileNo'];
    const updatesPermission = updates.every((update) => UpdateColumns.includes(update))
    console.log("updatesPermission", updatesPermission);
    if (!updatesPermission) {
        return resp.status(404).send("Invalid Updates!!")
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return resp.status(404).send();
        }
        updates.forEach((update) => {
            user[update] = req.body[update];
        })

        await user.save();
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        resp.status(200).send(user);
    } catch (e) {
        resp.status(500).send();
    }
})

router.delete('/deleteUser/:id', async (req, resp) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return resp.status(404).send()
        }

        resp.status(200).send(user)
    } catch (e) {
        resp.status(500).send(e)
    }

})

module.exports = router;