const functions = require("firebase-functions");

exports.checkFunctions = functions.https.onRequest((req, res) => {
  try {
    // Simple response to verify that Cloud Functions are operational
    res.status(200).send({
      status: "success",
      message: "Cloud Functions are operational",
    });
  } catch (error) {
    // If an error occurs, Functions are unhealthy
    functions.logger.error("Functions health check failed:", error);
    res.status(500).send({
      status: "error",
      message: "Cloud Functions are not operational",
      error: error.message,
    });
  }
});
