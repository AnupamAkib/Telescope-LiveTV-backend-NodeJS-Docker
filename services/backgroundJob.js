const cron = require("node-cron");
const axios = require("axios");

const END_POINT = "https://telescope-5uyq.onrender.com/updateChannel";

// Cron job to run every 12 minutes
cron.schedule("*/12 * * * *", async () => {
  try {
    console.log("Running scheduled task...");

    const response = await axios.get(END_POINT);
    
    console.log("Response data:\n", response.data);

  } catch (error) {
    console.error("Error in background job:", error);
  }
});
