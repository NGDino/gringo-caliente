const mongoose = require('mongoose');

// || process.env.DB_LOCAL_URI
const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI ||' mongodb://localhost/gringo-store', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then (con => {
        console.log(`mongo db connected with host ${con.connection.host}`)
    })
}

module.exports = connectDatabase;