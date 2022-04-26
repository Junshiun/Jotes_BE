const mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");
const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    console.log("connected " + conn.connection.host);
  } catch (error) {
    console.log("fail " + error.message);
    process.exit();
  }
};

module.exports = connectMongo;
