
const firebase = require('../db');
const firestore = firebase.firestore();
const createPickBuckets = async (req, res, next) => {
    try {
        const data = req.body;
        const promises = data.map(bucket => firestore.collection('pickBuckets').add(bucket));
        await Promise.all(promises);
        res.send('Records saved successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

  

  module.exports = {
    createPickBuckets,
    
}