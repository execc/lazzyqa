const util = require('util');
const MongoClient = require('mongodb').MongoClient;

const url = util.format(
    'mongodb://%s/',
    [
        '51.15.211.88:27017'
    ].join(',')
)

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const save = async (collectionName, document) => {
    const db = await MongoClient.connect(url, options)
    const dbo = db.db("db");
    const collection = dbo.collection(collectionName);
    await collection.updateOne({_id: document._id}, { "$set": document }, { upsert: true })
    await db.close()
    console.log(`Saved document ${document._id} to ${collectionName}`)
    return true
}

const loadAll = async (collectionName, projection, skip, limit, sort, query = {}) => {
    const db = await MongoClient.connect(url, options)
    const dbo = db.db("db");
    const collection = dbo.collection(collectionName);
    let cursor = await collection.find(query, { skip, limit, projection })
    if (sort) {
        cursor = cursor.sort(sort)
    }
    const documents = []
    await cursor.forEach(doc => {
        documents.push(doc)
    })
    await cursor.close()
    await db.close()
    console.log(`Got all documents from collection ${collectionName}`)
    return documents
}

const loadDistinct = async (collectionName, field, projection, skip, limit) => {
    const db = await MongoClient.connect(url, options)
    const dbo = db.db("db");
    const collection = dbo.collection(collectionName);
    const documents = await collection.distinct(field, {}, { skip, limit, projection })
    await db.close()
    console.log(`Got all documents from collection ${collectionName}`)
    return documents
}

const loadById = async (collectionName, _id) => {
    const db = await MongoClient.connect(url, options)
    const dbo = db.db("db");
    const collection = dbo.collection(collectionName);
    const document = await collection.findOne({_id})
    return document
}

module.exports = {
    save,
    loadAll,
    loadDistinct,
    loadById
}
