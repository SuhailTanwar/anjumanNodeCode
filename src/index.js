const express = require('express');
require('../src/db/mongoose');
const userRouter = require("../src/routes/user");

const app = express();
const port = process.env.PORT || 3000;

app.use((req, resp, next) => {
    resp.status(503).send("Site is under maintaince please try after some time.");
})

app.use(express.json());
app.use(userRouter);


app.listen(port, () => {
    console.log("Server is up on port " + port)
})