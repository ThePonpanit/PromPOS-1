const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.checkDatabase = functions.https.onRequest(async (req, res) => {
  try {
    // Perform a simple query to check Firestore connectivity
    const testCollection = db.collection("healthCheck");
    const querySnapshot = await testCollection.limit(1).get();

    // If the query executes successfully, Firestore is healthy
    res.status(200).send({
      status: "success",
      message: "Firestore is healthy",
      documentCount: querySnapshot.size,
    });
  } catch (error) {
    // If an error occurs, Firestore is unhealthy
    functions.logger.error("Firestore health check failed:", error);
    res.status(500).send({
      status: "error",
      message: "Firestore is not healthy",
      error: error.message,
    });
  }
});
