const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI

const connectDB = async () => {
    try{
        await mongoose.connect(mongoUri);
        console.log('MongoDB conectado');
    } catch(error){
        console.error('Error de conexion a MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDB;