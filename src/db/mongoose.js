const mongoose = require("mongoose");

mongoose.connect("mongodb://3.136.96.166:27017/qureshi-samaaj-db",
    { useNewUrlParser: true,
     useUnifiedTopology: true 
    });

