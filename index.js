import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import route from './routes/index.js';
import msg from './utils/message.js'
import { fileURLToPath } from 'url';
import initializeSocket from './utils/socket.js';
import {
  changeStatusOfOrderSummarry,
  checkoutProductModel,
  createOrders,
  insertBoostPost,
  insertOrdersItem,
  insertWalletHistory,
  markSellerOnboardingComplete,
  updatePostBoost,
  usersPurchasePlan,

  // new imports for variant handling
  getVariantById,
  updateVariantStockModel,

} from './models/user.model.js';
import stripePkg from 'stripe';
import { get_product_data_by_id, updateProductQuantityModel, updateSellerPayoutModel } from './models/admin.model.js';
import './utils/cronJob.js'

import serveIndex from 'serve-index';
import { sendNotificationToAppSeller } from './controllers/user_controller.js';
import { createNotificationMessage, handleEscrowPaymentReceived, sendNotification, verifyEscrowWebhookSignature } from './utils/user_helper.js';
import { NotificationTypes } from './utils/constant.js';
import https from 'https';
import { insertBoostProducts, updateProductBoost } from './models/seller.model.js';
import { updateRanchPurchaseStatus } from './models/investor.model.js';

import crypto from 'crypto';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));

const stripe = stripePkg(process.env.STRIPE_SECRET_KEY);
// const STRIPE_WEBHOOK_SECRET = "we_1RNsZESEnNI9ZVcEhLVQLSoM";---Live code
const STRIPE_WEBHOOK_SECRET = "whsec_e231bdfb25a82611b4917ca22a41d22e942f3d6ad019c49fd3952a21329a7620"

// -------------------------------- escrow creadintials ------------------------------------------------//
const ESCROW_WEBHOOK_SECRET = process.env.ESCROW_WEBHOOK_SECRET || "your_escrow_webhook_secret";

// --------------------------------stripe webhook-----------------------------------------------------//
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);

    const eventsOfInterest = [
      'account.updated',
      'capability.updated',
      'account.external_account.created',
      'account.application.authorized',
      'checkout.session.completed',
      'transfer.created',
    ];



    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const paymentIntentId = session.payment_intent;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const metadata = paymentIntent.metadata;
      switch (metadata.type) {
        case 'sweepstake_purchase':
          const sweepData = {
            sweepStacksId: metadata.sweepStacksId,
            user_id: metadata.user_id,
            entryPack: metadata.entryPack,
            totalEntry: metadata.totalEntry,
            sweepstacksName: metadata.sweepstacksName,
            entryAmount: metadata.entryAmount,
            confirmationId: metadata.confirmationId
          };
          await usersPurchasePlan(sweepData);
          break;

        case 'product_order':
          const orderData = {
            id: metadata.order_Id,
            userId: metadata.user_id,
            totalAmount: metadata.totalAmount,
            shippingDetailed: metadata.parseShippingDetailed,
            order_summaryId: metadata.orderSummaryId
          };
          let result = await createOrders(orderData)
          if (result.insertId) {
            await checkoutProductModel(metadata.user_id)
            await changeStatusOfOrderSummarry(metadata.user_id)
            let items = JSON.parse(metadata.items)
            let productSellerId = []
            let productIds = []

            // -------------------------old code---------------------------------//

            // await Promise.all(items.map(async (item) => {
            //   let productDetailed = await get_product_data_by_id(item.product_id)
            //   let orderDetails = {
            //     order_id: metadata.orderId,
            //     product_id: item.product_id,
            //     quantity: item.quantity,
            //     price_at_order: item.price_at_orders,
            //     delivery_charge: productDetailed[0].shipping_charges
            //   }
            //   await insertOrdersItem(orderDetails)
            //   let quanti = productDetailed[0].stock_quantity - item.quantity;
            //   await updateProductQuantityModel(item.product_id, quanti);
            //   productSellerId.push(productDetailed[0].seller_id)
            //   productIds.push(productDetailed[0].id)
            // }))

            // -------------------------old code end---------------------------------//

            // -------------------------new code---------------------------------//
            await Promise.all(
              items.map(async (item) => {
                const [variant] = await getVariantById(item.variant_id);
                if (!variant) {
                  throw new Error("Variant not found");
                }
                if (variant.stock_quantity < item.quantity) {
                  throw new Error("Variant out of stock");
                }
                const orderDetails = {
                  order_id: metadata.order_Id,
                  product_id: item.product_id,
                  variant_id: item.variant_id,
                  quantity: item.quantity,
                  price_at_order: item.price_at_orders,
                  delivery_charge: item.delivery_charge || 0
                };
                await insertOrdersItem(orderDetails);
                const updated = await updateVariantStockModel(item.variant_id, item.quantity);
                if (updated.affectedRows === 0) {
                  throw new Error("Stock update failed");
                }
              })
            );
            // -------------------------new code end---------------------------------//
            let orderId = metadata.orderId
            let obj = { productSellerId, orderId, id: metadata.user_id }
            await sendNotificationToAppSeller(obj)
          }
          break;

        case 'product_promotion':
          const currentDate = new Date();
          const durationDays = parseInt(metadata.duration);
          const endDate = new Date(currentDate);
          endDate.setDate(endDate.getDate() + durationDays);
          const product_promotion = {

            user_id: metadata.seller_id,
            product_id: metadata.product_id,
            package_id: metadata.package_id,
            start_date: currentDate,
            end_date: endDate,
            payment_status: 'paid',
          };

          let insertProductPromotionResult = await insertBoostProducts(product_promotion);
          console.log('insertProductPromotionResult', insertProductPromotionResult);

          if (insertProductPromotionResult.insertId) {
            console.log('true');
            console.log('insertProductPromotionResult.insertId', insertProductPromotionResult.insertId);

            await updateProductBoost(metadata.product_id);
          }
          break;

        case 'post_promotion':
          const current_Date = new Date();
          const duration_Days = parseInt(metadata.duration);
          const end_Date = new Date(current_Date);
          end_Date.setDate(endDate.getDate() + duration_Days);
          const post_promotion = {
            user_id: metadata.user_id,
            post_id: metadata.post_id,
            plan_id: metadata.package_id,
            start_date: current_Date,
            end_date: end_Date,
            payment_status: 'paid',
          };

          let insertPostPromotionResult = await insertBoostPost(post_promotion);
          console.log('insertProductPromotionResult', insertProductPromotionResult);

          if (insertPostPromotionResult.insertId) {
            console.log('true');
            console.log('insertPostPromotionResult.insertId', insertPostPromotionResult.insertId);

            await updatePostBoost(metadata.post_id)
          }
          break;

        case 'wallet_recharge':
          const rechargeData = {
            user_id: metadata.user_id,
            amount: metadata.amount,
            description: metadata.description,
            status: metadata.status,
            transaction_id: metadata.transaction_id,
          };

          let rechargeResult = await insertWalletHistory(rechargeData);
          if (rechargeResult.insertId) {
            console.log('Wallet recharge successful for user:', metadata.user_id);
          } else {
            console.error('Failed to insert wallet recharge record');
          }

        case 'ranch_purchase':
          const session = event.data.object;
          let rechargeResult1 = await updateRanchPurchaseStatus(metadata.confirmationId, session.payment_intent);
          break;



        default:
          console.warn('Unhandled payment type:', metadata.type);
      }
    }

    if (event.type === 'account.updated') {
      // if (eventsOfInterest.includes(event.type)) {
      const account = event.data.object;
      if (account.charges_enabled && account.payouts_enabled) {
        console.log(`Seller ${account.id} onboarding completed!`);
        await markSellerOnboardingComplete(account.id);
      }
    }

    if (event.type === 'transfer.created') {
      console.log('iuggggggggggggggggggggggggggggggggg');

      const transfer = event.data.object;
      const sellerAccountId = transfer.destination;
      const amount = transfer.amount;
      const metadata = transfer.metadata;
      const user_id = metadata.user_id;
      const seller_id = metadata.seller_id;
      const fcmToken = metadata.fcmToken;
      const admin_commission = metadata.admin_commission;
      const total_payout = metadata.total_payout
      console.log('metadata', metadata);

      const data = {
        seller_id: seller_id,
        amount: amount,
        admin_commission,
        total_payout
      };
      await updateSellerPayoutModel(data);

      const notificationData = await createNotificationMessage({
        notificationSend: "adminPayoutToSeller",
        fullName: 'Admin',
        id: metadata.adminId,
        userId: user_id,
        followId: null,
        usersfetchFcmToken: fcmToken,
        notificationType: NotificationTypes.SEND_PAYOUT_NOTIFICATION,
        postId: amount
      });
      await sendNotification(notificationData, postId);

      console.log(`✅ Transfer recorded: ${sellerAccountId} got $${amount / 100}`);
    }


    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// -------------------------------------end---------------------------------------------------------//

// -------------------------------- escrow webhook ------------------------------------------------//

app.post('/webhook-escrow', express.json(), async (req, res) => {
  try {
    console.log('🔔 Escrow Webhook Received');
    const signature = req.headers['escrow-signature'];
    if (process.env.ESCROW_MODE === 'sandbox') {
      console.log('🎯 SANDBOX MODE: Processing without signature verification');
    } else {
      let escrowVerify = await verifyEscrowWebhookSignature(signature, req.body)
      if (!escrowVerify) {
        console.error('❌ Invalid Escrow webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const event = req.body;
    console.log('Escrow Event Type:', event.event_type || event.type);
    console.log('Webhook Payload:', JSON.stringify(event, null, 2));

    switch (event.event_type || event.type) {
      case 'transaction.payment_received':
      case 'payment.received':
      case 'funds.received':
        await handleEscrowPaymentReceived(event);
        break;

      default:
        console.log('Unhandled Escrow event type:', event.event_type || event.type);
    }

    res.status(200).json({ received: true, message: 'Escrow webhook processed successfully' });

  } catch (error) {
    console.error('❌ Escrow Webhook Error:', error.message);
    res.status(500).json({ error: 'Escrow webhook processing failed' });
  }
});


// app.post('/webhook-escrow', express.raw({ type: 'application/json' }), async (req, res) => {
//   try {
//     console.log('🔔 Escrow Webhook Received');
//     const signature = req.headers['escrow-signature'];

//     // ✅ SANDBOX MODE: Always allow with dummy secret
//     if (process.env.ESCROW_MODE === 'sandbox') {
//       console.log('🎯 SANDBOX MODE: Processing webhook');
//       console.log('📧 Received Signature:', signature);

//       // Show what signature should be with dummy secret
//       const expectedSignature = crypto
//         .createHmac('sha256', process.env.ESCROW_WEBHOOK_SECRET || 'whsec_sandbox_test_key_2024')
//         .update(JSON.stringify(req.body))
//         .digest('hex');
//       console.log('🔐 Expected Signature (with dummy secret):', expectedSignature);

//       // Always proceed in sandbox mode
//     } else {
//       // ✅ PRODUCTION MODE: Strict verification
//       let escrowVerify = await verifyEscrowWebhookSignature(signature, req.body);
//       if (!escrowVerify) {
//         console.error('❌ Invalid Escrow webhook signature');
//         return res.status(401).json({ error: 'Invalid signature' });
//       }
//     }
//     const event = req.body;
//     console.log('event.event_type || event.type', event.event_type || event.type);
//     return false
//     console.log('🎯 Event Type:', event.event_type || event.type);
//     console.log('📦 Payload:', JSON.stringify(event, null, 2));
//     console.log('🌐 Mode:', process.env.ESCROW_MODE || 'production');

//     switch (event.event_type || event.type) {
//       case 'transaction.payment_received':
//       case 'payment.received':
//       case 'funds.received':
//         await handleEscrowPaymentReceived(event);
//         break;
//       default:
//         console.log('Unhandled event type:', event.event_type || event.type);
//     }

//     res.status(200).json({
//       received: true,
//       message: 'Webhook processed successfully',
//       mode: process.env.ESCROW_MODE || 'production',
//       environment: 'sandbox_testing'
//     });

//   } catch (error) {
//     console.error('❌ Webhook Error:', error.message);
//     res.status(500).json({ error: 'Webhook processing failed' });
//   }
// });


// -----------------------------------webhok end------------------------------------------------//


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
// app.use(express.static("assets"));+
app.use('/', express.static(path.join(__dirname, 'uploads')));

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Enable directory listing
app.use('/assets', serveIndex(path.join(__dirname, 'public/assets'), { icons: true }));

initializeSocket(server);

// Use routes
app.use('/api', route);

const port = process.env.PORT || 4007;
// server.listen(port, () => {
//   console.log(`${msg.serverRunning} ${port}`);
// });
export default server;

// const httpsServer = https.createServer(
//   {
//     ca: fs.readFileSync("/var/www/html/ssl/ca_bundle.crt"),
//     key: fs.readFileSync("/var/www/html/ssl/private.key"),
//     cert: fs.readFileSync("/var/www/html/ssl/certificate.crt"),
//   },
//   app
// );

// initializeSocket(httpsServer);

// // Start listening
// httpsServer.listen(port, () => {
//   console.log(`Server is running securely on port ${port}`);
// });