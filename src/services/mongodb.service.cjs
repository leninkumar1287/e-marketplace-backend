const { MongoClient, ObjectId } = require('mongodb');
const { dbCredentials, database } = require('./config.service.cjs');
const { errorMsgFormat, successFormat } = require('./utils/messageFormatter.cjs');
const { StatusCodes } = require('http-status-codes');

// Connection URI
const uri = `mongodb+srv://${dbCredentials.userName}:${dbCredentials.password}@${dbCredentials.appName}.y3evs0k.mongodb.net/?retryWrites=true&w=majority&appName=@${dbCredentials.appName}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dataBaseName = database.databaseName;
const collectionName = database.collectionName;

exports.findOne = async (query) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);
        const result = await collection.findOne({ _id: new ObjectId(query) });
        if (result === null) return null; else return result
    } catch (error) {
        console.error('Error finding document:', error);
    } finally {
        await client.close();
    }
}

exports.findOneUsingQuery = async (query) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);
        const result = await collection.findOne(query);
        if (result === null) return null; else return result
    } catch (error) {
        console.error('Error finding document:', error);
    } finally {
        await client.close();
    }
}

const checkDuplicate = async (query) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);
        const result = await collection.findOne(query);
        if (result === null) return true; else return false;
    } catch (error) {
        console.error('Error finding document:', error);
    } finally {
        await client.close();
    }
}

async function checkingTheFields(data) {
    let duplicateData = {};
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key) && key !== 'password' && key !== 'confirmPassword') {
            console.log(`checking ${key}...\n`)
            const query = { [key]: data[key] };
            const isDuplicate = await checkDuplicate(query);
            if (!isDuplicate) {
                duplicateData.isExists = !isDuplicate ? false : true, // false mean duplicate found
                    duplicateData.duplicateField = `${key}`
                return duplicateData;
            }
            else console.log(`No Duplicate { ${key} : ${data[key]} } found, and is Valid too\n`)
        }
    }
    duplicateData.isExists = true, // True means No Duplicate Found
        duplicateData.duplicateField = null
    return duplicateData; // Return true if no duplicates found
}

exports.findMany = async (query) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);
        const result = await collection.find(query).toArray();
        return result
    } catch (error) {
        console.error('Error finding documents:', error);
    } finally {
        await client.close();
    }
}

exports.insertOne = async (data) => {
    try {
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);
        let duplicateData = await checkingTheFields(data)
        if (duplicateData.isExists) {
            await client.connect();
            const result = await collection.insertOne(data);
            console.log(`Inserted document into the collection`);
            return { result, duplicateData}

        }
        else {
            console.log("duplicate field", duplicateData.duplicateField)
            return duplicateData;
        }

    } catch (error) {
        console.error('Error saving data:', error);
        return error
    } finally {
        await client.close();
    }
}

exports.insertMany = async (data) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);

        const result = await collection.insertMany(data);
        console.log(`Inserted ${result.insertedCount} documents into the collection`);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await client.close();
    }
}

exports.updateOne = async (query, update) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);
        const result = await collection.updateOne({ _id: new ObjectId(query) }, { $set: update });
        console.log(`Updated ${result.modifiedCount} document`);
    } catch (error) {
        console.error('Error updating document:', error);
    } finally {
        await client.close();
    }
}

exports.updateMany = async (query, update) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);

        const result = await collection.updateMany(query, { $set: update });
        console.log(`Updated ${result.modifiedCount} documents`);
    } catch (error) {
        console.error('Error updating documents:', error);
    } finally {
        await client.close();
    }
}

exports.deleteOne = async (query) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);

        const result = await collection.deleteOne(query);
        console.log(`Deleted ${result.deletedCount} document`);
    } catch (error) {
        console.error('Error deleting document:', error);
    } finally {
        await client.close();
    }
}

exports.deleteMany = async (query) => {
    try {
        await client.connect();
        const database = client.db(dataBaseName);
        const collection = database.collection(collectionName);

        const result = await collection.deleteMany(query);
        console.log(`Deleted ${result.deletedCount} documents`);
    } catch (error) {
        console.error('Error deleting documents:', error);
    } finally {
        await client.close();
    }
}