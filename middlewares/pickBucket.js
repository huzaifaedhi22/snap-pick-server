const { getOrders } = require("../controllers/orderController");
const { getZone,getBins } = require('../controllers/productController');
const express = require('express');
const { app } = require("firebase-admin");
const request = require('request');
const axios = require('axios');
const { response } = require("express");
const PickBucket = require('../models/pickBucket');
const cron = require('node-cron');



async function pickBucket(itemsArray) {
  console.log('Running Pick Bucket');

  const merge = itemsArray.flat(1);
  const zoneMap = new Map();
  const uniqueChars = [...new Set(merge)];

  for (const item of uniqueChars) {
    const zone = await getItemZone(item);
    zoneMap.set(item, zone);
  }

  const zones = uniqueChars.map(item => zoneMap.get(item));
  const uniqueZones = [...new Set(zones)];
  const pickBuckets = uniqueZones.map(zone => ({
    zone,
    items: new Map(),
    pickID: generateRandomID(),
    time: '',
  }));

  
  for (const item of merge) {
    const b = zoneMap.get(item);
    for (const pb of pickBuckets) {
      if (b === pb.zone) {
        const count = pb.items.get(item) || 0;
        pb.items.set(item, count + 1);
        break;
      }
    }
  }

 
   
  console.log(pickBuckets);
  const pickBucketsPlain = pickBuckets.map(pb => ({
    zone: pb.zone,
    items: Object.fromEntries(pb.items),
    pickID: pb.pickID,
    time: '4:06s',
    picker: 'CUQLW',
    status : 'pending'
  }));
  createPickBucket(pickBucketsPlain);

  return itemsArray;
}



function countItems(list) {
  const itemCountMap = new Map();
  let count;
  for (const item of list) {
     count = (itemCountMap.get(item) || 0) + 1;
    //itemCountMap.set(item, count);
  }
  return count;
}




async function getItemZone(itemID) {
  const response = await axios.get(`${process.env.HOST_URL}/api/products/${itemID}`);
  return response.data;
}


async function createPickBucket(buckets) {
  const response = await axios.post(`${process.env.HOST_URL}/api/pickBuckets`,buckets);
  return response.data;
}

function generateRandomID() {
  const digits = '0123456789';
  let randomID = '';
  for (let i = 0; i < 6; i++) {
    randomID += digits[Math.floor(Math.random() * digits.length)];
  }
  return randomID;
}


module.exports = {
  pickBucket,
  getItemZone
}
