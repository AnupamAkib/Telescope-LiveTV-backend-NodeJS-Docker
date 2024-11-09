const cron = require("node-cron");
const axios = require("axios");

const END_POINT = "https://livetv-njf6.onrender.com/updateChannel";

// Cron job to run every 3 minutes
cron.schedule("*/3 * * * *", async () => {
  try {
    console.log("Running scheduled task...");

    const response = await axios.get(END_POINT);
    
    console.log("Response data:\n", response.data);

  } catch (error) {
    console.error("Error in background job:", error);
  }
});
