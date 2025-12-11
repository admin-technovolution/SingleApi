const admin = require("firebase-admin");
const firebaseServiceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
const firebaseServiceAccountBase64Decoded = Buffer.from(firebaseServiceAccountBase64, "base64").toString("utf8");
const firebaseServiceAccount = JSON.parse(firebaseServiceAccountBase64Decoded);

admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount)
});

module.exports = admin;
