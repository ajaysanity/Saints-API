const functions = require('firebase-functions');
const admin = require("firebase-admin");
var serviceAccount = require("./FirebaseCredentials.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const express = require("express");
const api = express();
const quote = require('./router/quote')
api.use("/", quote);


exports.api = functions.https.onRequest(api);
