import cron from "node-cron";
import moment from "moment";
import {
  deletePostAndStoryFromMentionedTable,
  expireStoryAfter24Hours,
  fetchAllActiveStories,
  fetchAllBoostPosts,
  fetchAllLiveActive,
  updateBoostedProduct,
  updateLiveStreamStatus,
} from "../models/user.model.js";
import {
  deleteExpiredBoostProducts,
  fetchAllBoostProducts,
  updateExpiredBoostProducts,
  updateProductTableIsBoost,
} from "../models/seller.model.js";
import axios from "axios";
import crypto from "crypto";
import { checkStreamStatus } from "../controllers/user_controller.js";

const APP_ID = process.env.ZEGO_APP_ID;
const SERVER_SECRET = process.env.ZEGO_SERVER_SECRET;
const STREAM_ID = "live_79_1753105790655";
const ZEGOCLOUD_API = `${process.env.ZEGOCLOUD_API}/${APP_ID}/streams`;
const SECRET_ID = process.env.ZEGOCLOUD_SECRET_ID;
const SIGNATURE_METHOD = "HmacSHA256";

cron.schedule("* * * * *", async () => {
  // cron.schedule('* * * * *', async () => {
  try {
    // ---------------------------Remove the story after completed 24 hrs--------------------------------------//

    const stories = await fetchAllActiveStories();
    for (const story of stories) {
      const createdTime = moment(story.createdAt);
      const currentTime = moment();
      if (currentTime.diff(createdTime, "hours") >= 24) {
        // if (currentTime.diff(createdTime, 'minutes') >= 1) {
        await expireStoryAfter24Hours(story.id);
        await deletePostAndStoryFromMentionedTable(story.id);
      }
    }

    // ---------------------------------------working on expired the boosted products------------------------------//
    const allBoosts = await fetchAllBoostProducts();
    const now = moment();

    for (const boost of allBoosts) {
      let productId = boost.product_id;
      const endDate = moment(boost.end_date);
      if (now.isAfter(endDate)) {
        await updateExpiredBoostProducts(boost.id);
        await updateProductTableIsBoost(productId);
      }
    }

    const boostCheck = await fetchAllBoostPosts();
    if (boostCheck.length > 0) {
      for (const boost of boostCheck) {
        let post_id = boost.post_id;
        const endDate = moment(boost.end_date);
        if (now.isAfter(endDate)) {
          await updateBoostedProduct(boost.id);
          await updateProductTableIsBoost(post_id);
        }
      }
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

// import jwt from 'jsonwebtoken';

// function generateToken(appId, serverSecret) {
//   const payload = {
//     app_id: appId,
//     nonce: Math.floor(Math.random() * 1000000),
//     ctime: Math.floor(Date.now() / 1000),
//     expire: 3600
//   };
//   return jwt.sign(payload, serverSecret);
// }

// cron.schedule('* * * * *', async () => {
//   try {
//     const response = await axios.get(`https://rtc-api.zegocloud.com/v1/apps/${APP_ID}/streams?stream_id=${STREAM_ID}`, {
//       headers: {
//         Authorization: `Bearer ${generateToken(APP_ID, SERVER_SECRET)}` // OR generate using your secret
//       }
//     });

//     console.log('Zego Cloud API cron ran at:', new Date().toISOString());
//     console.log(response);
//     const stream = response.data.data[0];

//     if (stream && stream.status === 'STARTED') {
//       console.log(`Stream ${STREAM_ID} is LIVE`);
//       // Update DB status to live
//     } else {
//       console.log(`Stream ${STREAM_ID} is ENDED`);
//       // Update DB status to ended
//     }

//   } catch (error) {
//     console.error('Failed to fetch stream info:', error.response?.data || error.message);
//   }
// });

function generateSignature(params, secretKey) {
  // 1. Sort params
  const sortedKeys = Object.keys(params).sort();
  const sortedParams = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  // 2. Create string to sign
  const stringToSign = `GETrtc-api.zego.im/?${sortedParams}`;

  // 3. Create HMAC SHA256
  return crypto
    .createHmac("sha256", secretKey) // ✅ Use HMAC-SHA256
    .update(stringToSign)
    .digest("base64");
}

// cron.schedule('* * * * *', async () => {
//   const timestamp = Math.floor(Date.now() / 1000);
//   const sequence = Date.now();
//   const nonce = crypto.randomBytes(8).toString('hex');

//   const params = {
//     Action: "DescribeRTCStreamState",
//     AppId: APP_ID,
//     StreamId: STREAM_ID,
//     Timestamp: timestamp,
//     Sequence: sequence,
//     Nonce: nonce,
//     SecretId: SECRET_ID,
//     SignatureMethod: SIGNATURE_METHOD,
//     SignatureVersion : '2.0',
//   };

//   // Add signature
//   const signature = generateSignature(params, SERVER_SECRET);
//   params.Signature = encodeURIComponent(signature);

//   console.log(params);

//   // Build query string
//   const query = Object.entries(params)
//     .map(([key, val]) => `${key}=${val}`)
//     .join("&");

//   const url = `https://rtc-api.zego.im/?${query}`;

//   try {
//     const response = await axios.get(url);
//     const streamState = response.data?.Data?.Status;

//     console.log(`[CRON] Stream status at ${new Date().toISOString()}: ${streamState}`);
//     if (streamState === "STARTED") {
//       console.log("✅ Stream is LIVE");
//       // Update DB: set stream to LIVE
//     } else {
//       console.log("⚠️ Stream is ENDED or INACTIVE");
//       // Update DB: set stream to ENDED
//     }
//   } catch (err) {
//     console.error("Failed to fetch Zego stream state:", err?.response?.data || err.message);
//   }
// });

cron.schedule("* * * * *", async () => {
  try {
    const Lives = await fetchAllLiveActive();
    if (Lives.length > 0) {
      for (const live of Lives) {
        const data = await checkStreamStatus(live.live_id);
        if (data.success == false && data.code == 41004) {
          await updateLiveStreamStatus(live.live_id);
        }
      }
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});
