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
  console.log('Running Pick Bucket')
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
    items: [],
    pickID: generateRandomID(),
  }));

  for (const item of merge) {
    const b = zoneMap.get(item);
    for (const pb of pickBuckets) {
      if (b === pb.zone) {
        pb.items.push(item);
        break;
      }
    }
  }
  console.log(pickBuckets);
  createPickBucket(pickBuckets);

  return itemsArray;
}



async function getItemZone(itemID) {
  const response = await axios.get(`http://localhost:8080/api/products/${itemID}`);
  return response.data;
}


async function createPickBucket(buckets) {
  const response = await axios.post('http://localhost:8080/api/pickBuckets',buckets);
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