const { MongoClient, ServerApiVersion } = require('mongodb');
const { dbCredentials } = require('./config.service.cjs');
const { getRandomNumber } = require('./helper/randomNumber.helper.cjs');
const uri = `mongodb+srv://${dbCredentials.userName}:${dbCredentials.password}@${dbCredentials.appName}.y3evs0k.mongodb.net/?retryWrites=true&w=majority&appName=@${dbCredentials.appName}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let connectionStatus;

exports.connectDb = async () => {
  let attemptCount = getRandomNumber();

  try {
    console.clear();
    while (attemptCount) {
      if (connectionStatus === undefined) {
        process.stdout.write("Db Connection Request Initiated, Please Wait ");
        for (let i = 0; i < attemptCount; i++) {
          process.stdout.write(" .");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      console.clear();
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();

      // Send a ping to confirm a successful connection
      connectionStatus = await client.db("admin").command({ ping: 1 });

      if (connectionStatus.ok) return true;
      else {
        attemptCount++;
        console.log("\nConnection attempt failed. Retrying...");
      }
    }

    throw new Error("Unable to connect to the database after 3 attempts.");
  } catch (error) {
    return error.message;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
