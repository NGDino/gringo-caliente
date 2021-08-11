const mongoose = require('mongoose');

// || process.env.DB_LOCAL_URI
const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then (con => {
        console.log(`mongo db connected with host ${con.connection.host}`)
    })
}

module.exports = connectDatabase;