import crypto from 'crypto';
import base64url from 'base64url';
import bcrypt from 'bcrypt';
import Msg from '../utils/message.js';
import { handleError, handleSuccess } from '../utils/responseHandler.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import ejs from 'ejs';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import { sendEmail, sendSupportEmail } from '../utils/emailService.js';
import { addRanchesOwnershipPdf, applyAgainModel, fetchUnreadUsersNotificationByUsersId, insertUserNotifications, updateUsersProfile } from '../models/user.model.js';
import admin from 'firebase-admin';
import mime from "mime-types";
import { get_user_data_by_id } from '../models/admin.model.js';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { findPurchaseByEscrowId } from '../models/investor.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import puppeteer from "puppeteer";
import { upload, uploadPdfToS3 } from '../middleware/upload.js';
import db from '../config/db.js';

const serviceAccount = JSON.parse(
    await fs.readFile(new URL('../utils/serviceAccountKey.json', import.meta.url))
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const capitalizeFirstLetterOfWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const randomStringAsBase64Url = (size) => {
    return base64url(crypto.randomBytes(size));
};

export const generateToken = (user) => {
    return jwt.sign({ data: { id: user.id, }, }, process.env.AUTH_SECRETKEY);
};

export const authenticateUser = async (res, email, password, userData, fcmToken, moduleType) => {
    const user = userData[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        return handleError(res, 400, Msg.invalidPassword, []);
    }
    if (moduleType == "userLogin") {
        let data = { fcmToken: fcmToken }
        await updateUsersProfile(data, user.id);
    }
    const jwt_token = generateToken(user);
    return handleSuccess(res, 200, Msg.loginSuccess, jwt_token);
};

export const hashPassword = async (password) => {
    try {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error("Password hashing failed");
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw new Error("Password comparison failed");
    }
};

export const sendHtmlResponse = (res, statusCode, message) => {
    res.status(statusCode).send(`
        <div style="text-align: center; padding: 20px;">
            <h3>${message}</h3>
        </div>
    `);
};

export const generateRandomString = async (length) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const sendVerificationEmail = async ({ email, code, res }) => {
    const context = {
        verification_code: code,
        msg: Msg.verifiedMessage,
    };
    const projectRoot = path.resolve();
    const emailTemplatePath = path.join(projectRoot, "views", "otp_verification.handlebars");
    const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template(context);

    const emailOptions = {
        to: email,
        subject: Msg.accountActivate,
        html: emailHtml,
    };
    await sendEmail(emailOptions);
    if (res) {
        return handleSuccess(res, 200, `${Msg.accountVerifiedCodeSent}`);
    }
    return { success: true, message: `${Msg.accountVerifiedCodeSent}` };
};

export const sendNotification = async (message, postId) => {
    try {
        let data = postId ? postId : null
        await insertUserNotifications(message, "success", postId);
        let [unreadCount] = await fetchUnreadUsersNotificationByUsersId(message.token);
        message.apns = {
            payload: {
                aps: {
                    badge: unreadCount.unread_count,
                    sound: "default"
                }
            },
            headers: {
                "apns-id": uuidv4()
            }
        }

        message.android = {
            notification: {
                sound: "default"
            }
        }
        const response = await admin.messaging().send(message);
        console.log("🎯 FCM sent:", response);
        const responseText = JSON.stringify(response);
        if (message.data.notificationType == 12) {
            return { success: true, message: Msg.STORY_ADDED_SUCCESSFULLY };
        } else if (message.data.notificationType == 14 || message.data.notificationType == 15 || message.data.notificationType == 16) {
            return { success: true, message: Msg.DELIVERY_STATUS_UPDATE_SUCCESSFULLY };
        } else {
            return { success: true, message: Msg.notificationSentSuccessfull, data: response };
        }
    } catch (error) {
        return { success: false, message: Msg.unableToSendNotification, error: error.message || error };
    }
};

export const createNotificationMessage = async ({
    notificationSend,
    fullName,
    id,
    userId,
    followId,
    usersfetchFcmToken,
    notificationType,
    postId,

    profileImage,
}) => {
    let notification = {};
    switch (notificationSend) {
        case 'followToAnotherUsers':
            notification = {
                title: `${fullName} ${Msg.hasFollowingYou}`,
                body: `${fullName} ${Msg.hasFollowCheckProfile}`
            };
            break;

        case 'commentsOnPost':
            notification = {
                title: `${fullName} ${Msg.commentOnPosts}`,
                body: `${fullName} ${Msg.hasCommentedCheckPost}`
            };
            break;

        case 'likedPost':
            notification = {
                title: `${fullName} ${Msg.likeOnPost}`,
                body: `${fullName} ${Msg.hasLikedCheckPost}`
            };
            break;

        case 'sellerApproved':
            notification = {
                title: `${fullName} ${Msg.hasApprovedAsSeller}`,
                body: `Congratulations, ${fullName}! ${Msg.hasApprovedBodyData}`
            };
            break;

        case 'sellerRejected':
            notification = {
                title: `${Msg.hasRejectAsASeller}`,
                body: `Sorry, ${fullName}.${Msg.hasRejectBodyData}`
            };
            break;

        case 'applyBecomeSeller':
            notification = {
                title: `${fullName} ${Msg.APPLY_TO_SELLER_NOTIFICATION}`,
                body: `You have received a new seller application from ${fullName}. Please review and take the necessary action.`
            };
            break;

        case 'sendMessage':
            notification = {
                title: `New message from ${fullName}`,
                body: `${fullName} sent you a new message. Tap to view.`
            };
            break;

        case 'sendContactToSupportsNotification':
            notification = {
                title: `New support request from ${fullName}`,
                body: `${fullName} has submitted a support inquiry. Please check and respond promptly.`
            };
            break;

        case 'broadcast_notification':
            notification = {
                title: ``,
                body: `${fullName} has submitted a support inquiry. Please check and respond promptly.`
            };
            break;

        case 'addInGroup':
            let groupName = followId //temproary we take a group name 
            notification = {
                title: `${fullName} added you to a new group`,
                body: `You’ve been added to the group "${groupName}"`
            };
            break;

        case 'mentionedInStory':
            notification = {
                title: `${fullName} mentioned you in their story`,
                body: `Tap to view the story where ${fullName} mentioned you.`
            };
            break;

        case 'sendNotificationAppSeller':
            notification = {
                title: `🎉 Your product has been sold!`,
                body: `Order #${followId} has been placed successfully..`
            };
            break;

        case 'orderDeliveredNotification':
            notification = {
                title: "Order Delivered Successfully!",
                body: `Your product "${fullName}" from Order #${postId} has been delivered..`
            };
            break;

        case 'orderShippedNotification':
            notification = {
                title: "Product Shipped!",
                body: `Your product "${fullName}" from Order #${postId} has been shipped..`
            };
            break;

        case 'orderPendingNotification':
            notification = {
                title: "Product Pending",
                body: `Your product "${fullName}" from Order #${postId} is still pending.`
            };
            break;

        case 'taggedInPost':
            notification = {
                title: `${fullName} tagged you in their post`,
                body: `Tap to view the post where ${fullName} tagged you.`
            };
            break;

        case 'adminPayoutToSeller':
            notification = {
                title: `Payout from Trophy Talk`,
                body: `You've received a payout of $${postId} from Trophy Talk. Check your Stripe account for details.`
            };
            break;

        case 'sweepstakesResultAnnounced':
            notification = {
                title: `📢 Sweepstakes Winner Broadcast!`,
                body: `${fullName} is the winner of the "${postId}" sweepstake! The announcement has been shared with all users. Don't miss your shot in the upcoming sweepstakes!`
            };
            break;

        case 'liveStarted':
            notification = {
                title: `Live Started`,
                body: `${fullName} has Started Live Video`
            };
            break;
        case 'applyToBecomeInvestorApproved':
            notification = {
                title: `Apply to become a investor Approved`,
                body: `You have been approved to become a investor`
            };
            break;
        case 'applyToBecomeInvestorRejected':
            notification = {
                title: `Apply to become a investor Rejected`,
                body: `You have been rejected to become a investor`
            };
            break;

        case 'approvalInvestorRanchesOwnership':
            notification = {
                title: `Congratulations on Your Ranch Ownership!`,
                body: `You’ve successfully received ownership for ${fullName}. Visit your My Investment page to view your certificate and details.`
            };
            break;

        case 'rejectedInvestorRanchesOwnership':
            notification = {
                title: `Ranch Ownership Application Rejected`,
                body: `Your ownership request for ${fullName} couldn’t be approved at this time.`
            };
            break;

        case 'ranchesBookingApproval':
            notification = {
                title: `Ranch Booking Confirmed`,
                body: `Your booking for ${fullName} has been successfully approved. You’re all set!`
            };
            break;

        case 'ranchesBookingRejection':
            notification = {
                title: `Ranch Booking Request Declined`,
                body: `Your booking request for ${fullName} could not be approved at this time.`
            };
            break;

        case 'sendMessageNotificationToInvestor':
            notification = {
                title: `New Message from Trophy Talk Admin`,
                body: `You have received a new message regarding your ranch conversation.`,
            };
            break;


        case 'sendMessageNotificationToAdmin':
            notification = {
                title: `New Message from ${fullName}`,
                body: `You have received a new message regarding the ranch.`,
            };
            break;

        default:
            notification = {
                title: `${fullName} ${Msg.hasFollowingYou}`,
                body: `${fullName} ${Msg.hasFollowCheckProfile}`
            };
            break;
    }
    return {
        notification,
        data: {
            sendFrom: String(id || ""),
            sendTo: String(userId || ""),
            followId: String(followId || ""),
            notificationType: String(notificationType || ""),
            postId: String(postId || ""),

             profileImage: profileImage || ""
        },
        token: usersfetchFcmToken || ""
    };
};

export const getMimeType = (file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    switch (ext) {
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        case ".gif":
            return "image/gif";
        case ".mp4":
            return file.mimetype === "application/octet-stream" ? "video/mp4" : "video/mp4";
        case ".avi":
            return "video/x-msvideo";
        case ".mov":
            return "video/quicktime";
        case ".pdf":
            return "application/pdf";
        case ".txt":
            return "text/plain";
        case ".csv":
            return "text/csv";
        default:
            return mime.lookup(ext) || "application/octet-stream";
    }
};

export const generateUniqueProductID = () => {
    const randomNumber = crypto.randomInt(10000, 99999);
    return `TPD${randomNumber}`;
}

export const sendUserSupportEmail = async ({ fullName, data, res }) => {
    const context = {
        fullName: fullName,
        phoneNumber: data.phoneNumber,
        message: data.message
    };
    const projectRoot = path.resolve();
    const emailTemplatePath = path.join(projectRoot, "views", "supportTemplate.handlebars");
    const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template(context);

    const emailOptions = {
        to: data.email,
        subject: Msg.userSupport,
        html: emailHtml,
    };
    await sendSupportEmail(emailOptions);
    if (res) {
        return handleSuccess(res, 200, `${Msg.supportRequestSent}`);
    }
    return { success: true, message: `${Msg.supportRequestSent}.` };
};


export const send_notification_to_user = async (user_id, body) => {
    try {
        const [user] = await get_user_data_by_id(user_id);

        if (!user || !user.fcmToken) {
            console.error(`FCM token not found for user ${user_id}`);
            return;
        }
        const message = {
            token: user.fcmToken,
            notification: {
                title: body.title,
                body: body.body,
            }
        };
        try {
            let [unreadCount] = await fetchUnreadUsersNotificationByUsersId(message.token);
            message.apns = {
                payload: {
                    aps: {
                        badge: unreadCount.unread_count,
                        sound: "default"
                    }
                },
                headers: {
                    "apns-id": uuidv4()
                }
            }

            message.android = {
                notification: {
                    sound: "default"
                }
            }
            await admin.messaging().send(message);
            console.log('Successfully sent message:');
        } catch (error) {
            console.error('Error sending message:', error.message);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
};


export const send_notificaiton_with_email = async (user_id, title, message, image_logo) => {
    try {
        const [user] = await get_user_data_by_id(user_id);
        if (!user || !user.email) {
            console.error(`email not found for user ${user_id}`);
            return;
        }
        const emailTemplatePath = path.resolve(__dirname, "../views/email_notification.ejs");
        const emailHtml = await ejs.renderFile(emailTemplatePath, { title, message, image_logo });
        const emailOptions = {
            to: user.email,
            subject: "Trophy Talk Notification",
            html: emailHtml,
        };
        await sendEmail(emailOptions);
    } catch (error) {
        console.error('Unexpected error:', error);
        return handleError(res, 500, Msg.internalServerError);
    }
};


export const updateOnlineStatus = async (userId, body) => {
    const result = await updateUsersProfile(body, userId);
    return result;
};

export const generateConfirmationId = () => {
    const prefix = 'WGH';
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `${prefix}-${year}-${randomNumber}`;
};

export const generateFiveDigitNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
}

export const getCurrentDateTime = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localTime = new Date(now.getTime() - offsetMs);
    return localTime.toISOString().slice(0, 19).replace('T', ' ');
};


export const generateTransactionId = () => {
    const prefix = 'TX'; // Transaction prefix
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += digits[Math.floor(Math.random() * digits.length)];
    }
    return `${prefix}${id}`;
}


export const generateCleanUsername = (userName, projectName) => {
    const baseName = userName.replace(/[0-9]/g, '');
    const projectPart = projectName.replace(/\s+/g, '').toLowerCase();
    const randomNumber = Math.floor(1000 + Math.random() * 90);
    return `${baseName}_${projectPart}${randomNumber}`;
}


// -------------------------------------🛡️ ESCROW WEBHOOK SECURITY VERIFICATION---------------------------------------------//

export const verifyEscrowWebhookSignature = (signature, payload) => {
    try {
        const crypto = require('crypto');
        const webhookSecret = process.env.ESCROW_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('❌ Escrow webhook secret not configured');
            return false;
        }

        // Calculate expected signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(payload))
            .digest('hex');

        // Compare signatures
        const isValid = signature === expectedSignature;

        if (!isValid) {
            console.error('❌ Escrow webhook signature mismatch');
            console.error('Expected:', expectedSignature);
            console.error('Received:', signature);
        }

        return isValid;
    } catch (error) {
        console.error('Error verifying escrow signature:', error);
        return false;
    }
};

// ------------------------------------ 🎯 HANDLE ESCROW PAYMENT RECEIVED (Investor paid remaining amount)----------------//

export const handleEscrowPaymentReceived = async (event) => {
    try {
        const transaction = event.transaction || event.data;
        console.log(`💰 Escrow Payment Received: ${transaction.id} - $${transaction.amount}`);
        const purchase = await findPurchaseByEscrowId(transaction.escrow_reference_id);
        if (!purchase) {
            console.error('❌ Purchase not found for escrow reference ID:', transaction.escrow_reference_id);
            return;
        }
        console.log('transaction.id', transaction.id);

        const result = await db.query(`
            UPDATE tbl_ranch_purchases 
            SET 
              payment_status = 'ESCROW_RECEIVED',
              escrow_transaction_id = ?,
              reservation_status = 'PENDING',
              updated_at = NOW()
            WHERE escrow_reference_id = ?
            AND payment_status = 'PENDING_ESCROW_DEPOSIT'
          `, [transaction.id, purchase.escrow_reference_id]);

        if (result.affectedRows === 0) {
            console.error(`❌ No pending purchase found for reference: ${purchase.escrow_reference_id}`);
            return;
        }
        const projectRoot = path.resolve(__dirname, "../");
        const emailTemplatePath = path.join(projectRoot, "views", "escrowAccountSendMailToAdmin.hbs");
        const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
        const template = handlebars.compile(templateSource);

        const context = {
            investorName: `${purchase.fullName} `,
            investorEmail: purchase.email,
            ranchName: purchase.ranch_name,
            purchaseId: purchase.id,
            amount: transaction.amount.toLocaleString(),
            receivedDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            referenceId: purchase.escrow_reference_id,
            adminDashboardUrl: `${process.env.ADMIN_URL}/purchases/${purchase.id}`,
            supportUrl: `${process.env.ADMIN_URL}/support`,
            transactionsUrl: `${process.env.ADMIN_URL}/transactions`,
            year: new Date().getFullYear()
        };

        const emailHtml = template(context);
        const emailOptions = {
            to: 'karanpatel.ctinfotech@gmail.com',
            subject: '🚨 Escrow Payment Received - Action Required',
            html: emailHtml,
        };
        await sendEmail(emailOptions);
        console.log(`✅ Escrow payment processed for purchase: ${purchase.id}`);
    } catch (error) {
        console.error('Error handling escrow payment:', error);
    }
};

// export const generateCertificateAndSendEmail = async (purchaseData, purchaseId) => {
//     // try {
//         const templateData = {
//             certificateNumber:
//                 purchaseData.certificateNumber ||
//                 purchaseData.certificate_number ||
//                 `BC-${new Date().getFullYear()}-${Math.random()
//                     .toString(36)
//                     .substr(2, 9)
//                     .toUpperCase()}`,
//             issueDate:
//                 purchaseData.issueDate ||
//                 purchaseData.issue_date ||
//                 new Date().toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                 }),
//             investorName: purchaseData.fullName,
//             investorId: `INV-${purchaseData.id}`,
//             investorEmail: purchaseData.userEmail,
//             ranchName: purchaseData.name,
//             ranchLocation: purchaseData.location,
//             totalAcres: purchaseData.acres,
//             sharesPurchased: purchaseData.shares_purchased,
//             totalShares: purchaseData.total_shares,
//             signatoryName: purchaseData.signatoryName || "Xebah Li, Xinzhou",
//             signatoryTitle: purchaseData.signatoryTitle || "Chief Ranch Officer",
//             companyName: "Trophy Talk LLC",
//             referenceId: purchaseData.escrow_reference_id,
//         };

//         const projectRoot = path.resolve(__dirname, "../");
//         const templatePath = path.join(projectRoot, "views", "ownershipCertificate.hbs");
//         await fs.access(templatePath);
//         const source = await fs.readFile(templatePath, "utf8");
//         const template = handlebars.compile(source);
//         const htmlContent = template(templateData);

//         const browser = await puppeteer.launch({
//             headless: "new",
//             args: [
//                 "--no-sandbox",
//                 "--disable-setuid-sandbox",
//                 "--disable-dev-shm-usage",
//                 "--disable-gpu",
//                 "--no-zygote",
//                 "--single-process"
//             ],
//             executablePath: puppeteer.executablePath(), // ✅ ensures it uses its own Chrome
//         });

//         const page = await browser.newPage();
//         await page.setViewport({ width: 1200, height: 1600 });
//         await page.setContent(htmlContent, { waitUntil: ["networkidle0", "domcontentloaded"] });
//         await page.evaluateHandle("document.fonts.ready");

//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             printBackground: true,
//             margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
//             preferCSSPageSize: true,
//         });

//         await browser.close();

//         const s3Key = `certificates/${templateData.certificateNumber}.pdf`;
//         const s3UploadResult = await uploadPdfToS3(pdfBuffer, s3Key, "application/pdf");
//         // await applyAgainModel({ ranchesOwnershipPdf: s3UploadResult.Location }, purchaseData.user_id);
//         let ranchesOwnershipPdf = s3UploadResult.Location
//         console.log('ranchesOwnershipPdf',ranchesOwnershipPdf);

//         await addRanchesOwnershipPdf(ranchesOwnershipPdf, purchaseId);


//         const emailOptions = {
//             to: purchaseData.userEmail,
//             subject: "Your Ranch Ownership Certificate",
//             html: `
//                 <h2>Congratulations on Your Ranch Ownership!</h2>
//                 <p>Dear ${templateData.investorName},</p>
//                 <p>We are pleased to inform you that your ownership certificate for <strong>${templateData.ranchName}</strong> is ready.</p>
//                 <p>Please find your official ownership certificate attached to this email.</p>
//                 <br>
//                 <p><strong>Investment Details:</strong></p>
//                 <ul>
//                     <li>Ranch: ${templateData.ranchName}</li>
//                     <li>Shares: ${templateData.sharesPurchased}</li>
//                     <li>Ownership: ${templateData.ownershipPercentage}</li>
//                     <li>Investment: ${templateData.investmentValue}</li>
//                 </ul>
//                 <br>
//                 <p>Best regards,<br>${templateData.companyName}</p>
//             `,
//             attachments: [
//                 {
//                     filename: `Ownership_Certificate_${templateData.certificateNumber}.pdf`,
//                     content: pdfBuffer,
//                     contentType: 'application/pdf'
//                 },
//             ],
//         };


//         await sendEmail(emailOptions);
//         return true;
//     // } catch (error) {
//     //     console.error("❌ Error generating or sending PDF:", error);
//     // }
// }

export const generateCertificateAndSendEmail = async (purchaseData, purchaseId) => {
    try {
        const templateData = {
            certificateNumber:
                purchaseData.certificateNumber ||
                purchaseData.certificate_number ||
                `BC-${new Date().getFullYear()}-${Math.random()
                    .toString(36)
                    .substr(2, 9)
                    .toUpperCase()}`,
            issueDate:
                purchaseData.issueDate ||
                purchaseData.issue_date ||
                new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            investorName: purchaseData.fullName,
            investorId: `INV-${purchaseData.id}`,
            investorEmail: purchaseData.userEmail,
            ranchName: purchaseData.name,
            ranchLocation: purchaseData.location,
            totalAcres: purchaseData.acres,
            sharesPurchased: purchaseData.shares_purchased,
            totalShares: purchaseData.total_shares,
            signatoryName: purchaseData.signatoryName || "Xebah Li, Xinzhou",
            signatoryTitle: purchaseData.signatoryTitle || "Chief Ranch Officer",
            companyName: "Trophy Talk LLC",
            referenceId: purchaseData.escrow_reference_id,
        };

        // Load Handlebars template
        const projectRoot = path.resolve(__dirname, "../");
        const templatePath = path.join(projectRoot, "views", "ownershipCertificate.hbs");
        const source = await fs.readFile(templatePath, "utf8");
        const template = handlebars.compile(source);
        const htmlContent = template(templateData);

        // ✅ Launch Puppeteer safely
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });

        // ----------------------here is working on live -------------------no in local commented------//

        // const browser = await puppeteer.launch({
        //     headless: "new",
        //     executablePath: "/usr/bin/chromium-browser",
        //     args: [
        //         "--no-sandbox",
        //         "--disable-setuid-sandbox",
        //         "--disable-dev-shm-usage",
        //         "--disable-gpu",
        //     ],
        // });

        // -----------------------------------------end---------------------------------------//

        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 1600 });
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        await page.evaluateHandle("document.fonts.ready");

        // ✅ Generate PDF safely
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
            preferCSSPageSize: true,
        });

        // ✅ Only close browser after PDF is generated
        await browser.close();

        // Upload PDF to S3
        const s3Key = `certificates/${templateData.certificateNumber}.pdf`;
        const s3UploadResult = await uploadPdfToS3(pdfBuffer, s3Key, "application/pdf");
        const ranchesOwnershipPdf = s3UploadResult.Location;

        await addRanchesOwnershipPdf(ranchesOwnershipPdf, purchaseId);

        // Send Email
        const emailOptions = {
            to: purchaseData.userEmail,
            subject: "Your Ranch Ownership Certificate",
            html: `
          <h2>Congratulations on Your Ranch Ownership!</h2>
          <p>Dear ${templateData.investorName},</p>
          <p>We are pleased to inform you that your ownership certificate for <strong>${templateData.ranchName}</strong> is ready.</p>
          <p>Please find your official ownership certificate attached to this email.</p>
          <br>
          <p><strong>Investment Details:</strong></p>
          <ul>
            <li>Ranch: ${templateData.ranchName}</li>
            <li>Shares: ${templateData.sharesPurchased}</li>
            <li>Total Shares: ${templateData.totalShares}</li>
            <li>Reference ID: ${templateData.referenceId}</li>
          </ul>
          <br>
          <p>Best regards,<br>${templateData.companyName}</p>
        `,
            attachments: [
                {
                    filename: `Ownership_Certificate_${templateData.certificateNumber}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        };

        await sendEmail(emailOptions);
        return true;
    } catch (error) {
        console.error("❌ Error generating or sending PDF:", error);
        throw error;
    }
};

export const rejectionMailSendToInvester = async (purchaseData, rejectionReason) => {
    try {
        const templateData = {
            investorName: purchaseData.fullName,
            investorEmail: purchaseData.userEmail,
            ranchName: purchaseData.name,
            ranchLocation: purchaseData.location,
            sharesPurchased: purchaseData.shares_purchased,
            totalShares: purchaseData.total_shares,
            investmentValue: purchaseData.balance_amount ? `$${parseFloat(purchaseData.balance_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A',
            referenceId: purchaseData.escrow_reference_id || `REF-${purchaseData.id}`,
            rejectionReason: rejectionReason,
            companyName: 'Trophy Talk LLC',
            supportEmail: 'support@trophytalk.com',
            supportPhone: '(555) 123-4567',
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            year: new Date().getFullYear()
        };

        const emailOptions = {
            to: purchaseData.userEmail,
            subject: `Important Update: Your ${templateData.ranchName} Investment - Refund Initiated`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investment Update</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .status-badge {
            background: #fee2e2;
            color: #dc2626;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            display: inline-block;
            margin: 15px 0;
            border: 2px solid #fecaca;
            font-size: 14px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            margin-bottom: 25px;
        }
        
        .greeting h2 {
            color: #1e293b;
            margin-bottom: 10px;
            font-size: 24px;
        }
        
        .message-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #dc2626;
        }
        
        .refund-highlight {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 2px solid #10b981;
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }
        
        .refund-amount {
            font-size: 36px;
            font-weight: bold;
            color: #059669;
            margin: 15px 0;
        }
        
        .investment-details {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        
        .detail-item {
            padding: 15px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .detail-label {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 5px;
        }
        
        .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .rejection-reason {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .reason-text {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #dc2626;
            font-style: italic;
            margin-top: 10px;
            color: #7f1d1d;
        }
        
        .timeline {
            background: #f0f9ff;
            border: 1px solid #7dd3fc;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .timeline-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 10px;
        }
        
        .timeline-number {
            width: 30px;
            height: 30px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .support-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        
        .contact-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 15px 0;
            transition: transform 0.2s;
        }
        
        .contact-button:hover {
            transform: translateY(-2px);
        }
        
        .footer {
            background: #1e293b;
            color: #94a3b8;
            padding: 30px;
            text-align: center;
        }
        
        @media (max-width: 600px) {
            .detail-grid {
                grid-template-columns: 1fr;
            }
            
            .content {
                padding: 25px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-icon">⚠️</div>
            <h1>Investment Status Update</h1>
            <p>Important information regarding your ranch investment</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="status-badge">
                🔄 REFUND INITIATED - Investment Canceled
            </div>
            
            <div class="greeting">
                <h2>Dear ${templateData.investorName},</h2>
            </div>
            
            <div class="message-box">
                <p>Thank you for your interest in <strong>${templateData.ranchName}</strong>. After careful review, we are unable to proceed with your investment at this time.</p>
                <p>Your investment has been <strong>canceled</strong> and a <strong>full refund has been initiated</strong>.</p>
            </div>
            
            <!-- Refund Amount -->
            <div class="refund-highlight">
                <h3>💰 Full Refund Processed</h3>
                <div class="refund-amount">${purchaseData.amount}</div>
                <p>The complete amount is being returned to your original payment method</p>
            </div>
            
            <!-- Investment Details -->
            <div class="investment-details">
                <h3 style="text-align: center; margin-bottom: 20px; color: #1e293b;">Investment Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Ranch Property</div>
                        <div class="detail-value">${templateData.ranchName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Location</div>
                        <div class="detail-value">${templateData.ranchLocation}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Shares Reserved</div>
                        <div class="detail-value">${templateData.sharesPurchased} shares</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Investment Amount</div>
                        <div class="detail-value">${purchaseData.amount}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Reference ID</div>
                        <div class="detail-value">${templateData.referenceId}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status Date</div>
                        <div class="detail-value">${templateData.date}</div>
                    </div>
                </div>
            </div>
            
            <!-- Rejection Reason -->
            <div class="rejection-reason">
                <h4 style="color: #92400e; margin-bottom: 10px;">📝 Reason for Rejection:</h4>
                <div class="reason-text">
                    "${templateData.rejectionReason}"
                </div>
            </div>
            
            <!-- Refund Timeline -->
            <div class="timeline">
                <h4 style="color: #0369a1; margin-bottom: 20px; text-align: center;">⏰ Refund Processing Timeline</h4>
                <div class="timeline-item">
                    <div class="timeline-number">1</div>
                    <div>
                        <strong>Refund Initiated</strong><br>
                        <span style="color: #64748b;">Today - ${templateData.date}</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-number">2</div>
                    <div>
                        <strong>Processing Period</strong><br>
                        <span style="color: #64748b;">1-2 business days for bank processing</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-number">3</div>
                    <div>
                        <strong>Funds Returned</strong><br>
                        <span style="color: #64748b;">3-5 business days to appear in your account</span>
                    </div>
                </div>
            </div>
            
            <!-- Support Section -->
            <div class="support-section">
                <h3 style="color: #0369a1; margin-bottom: 15px;">💬 Need Assistance?</h3>
                <p>Our support team is here to help you with any questions about this process.</p>
                <div style="margin: 20px 0;">
                    <p><strong>Email:</strong> ${templateData.supportEmail}</p>
                    <p><strong>Phone:</strong> ${templateData.supportPhone}</p>
                </div>
                <a href="mailto:${templateData.supportEmail}" class="contact-button">Contact Support Team</a>
            </div>
            
            <!-- Additional Info -->
            <div style="text-align: center; margin-top: 25px; color: #64748b; font-size: 14px;">
                <p>Please allow 3-5 business days for the refund to appear in your original payment method.</p>
                <p>You will receive a confirmation email once the refund is fully processed.</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p style="font-size: 18px; font-weight: bold; color: #f1f5f9; margin-bottom: 10px;">${templateData.companyName}</p>
            <p style="color: #cbd5e1; margin-bottom: 15px;">Secure Ranch Investment Platform</p>
            <p style="font-size: 12px; color: #94a3b8;">
                This is an automated message. Please do not reply to this email.<br>
                © ${templateData.year} ${templateData.companyName}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
            `
        };

        await sendEmail(emailOptions);
        console.log(`✅ Rejection email sent to investor: ${templateData.investorEmail}`);
        return true;

    } catch (error) {
        console.error("❌ Error sending rejection email:", error);
        throw error;
    }
};

export const sendTestNotification = async ({
    token,
    title,
    body,
    image,
    data = {}
}) => {
    try {

        const message = {
            token,
            notification: {
                title: title || "Default Title",
                body: body || "Default Body",
                image: image || null   // dynamic notification image
            },
            android: {
                notification: {
                    sound: "default",
                    image: image || undefined
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: "default",
                        badge: 1
                    }
                },
                fcm_options: {
                    image: image || undefined
                }
            },
            data: {
                ...data,
                notificationType: data.notificationType || "TEST"
            }
        };

        const response = await admin.messaging().send(message);
        console.log("🎯 Dynamic Test FCM Sent:", response);

        return {
            success: true,
            message: "Dynamic Notification Sent Successfully",
            data: response
        };

    } catch (error) {
        console.error("❌ Error sending dynamic notification:", error);
        return {
            success: false,
            message: "Failed to send notification",
            error: error.message || error
        };
    }
};

