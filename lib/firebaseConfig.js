"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = exports.app = void 0;
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var auth_1 = require("firebase/auth");
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAjfKBhUQNkWnzBS3C4Up1PbFrGBcPpA1Y",
    authDomain: "loja-f2c5b.firebaseapp.com",
    projectId: "loja-f2c5b",
    storageBucket: "loja-f2c5b.firebasestorage.app",
    messagingSenderId: "424675580118",
    appId: "1:424675580118:web:0c80caea47c87f62729177",
    measurementId: "G-3K4DBM2QFD"
};
// Initialize Firebase
var app = (0, app_1.getApps)().length ? (0, app_1.getApp)() : (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
var auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
var db = (0, firestore_1.getFirestore)();
exports.db = db;
