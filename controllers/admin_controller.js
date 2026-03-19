import path from "path";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { readFile } from "fs/promises";
// import fs from "fs";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import crypto from "crypto";
import ejs from "ejs";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import Msg from "../utils/message.js";
import { sendEmail } from "../utils/emailService.js";
import {
  handleError,
  handleSuccess,
  joiErrorHandle,
} from "../utils/responseHandler.js";
import {
  mediaTypes,
  NotificationTypes,
  StatusCode,
  variableTypes,
} from "../utils/constant.js";
import {
  active_inactive_seller_model,
  approved_reject_seller_request_model,
  contentManagementfindOneBy,
  delete_ads_data,
  delete_adsMediaByIds,
  delete_Media_dataByIds,
  delete_post_by_id,
  delete_product_by_id,
  delete_sweepstake_data,
  deleteAudioModel,
  editAudioByIdModel,
  fetch_adsMedia_by_id,
  fetch_all_sweepstakes,
  fetch_sweepstakes_by_id,
  fetch_sweepstakesFile_by_id,
  fetch_sweepstakesMedia_by_id,
  fetch_UsersBysweepstakesid,
  fetchAdminNotificationById,
  fetchAdsById,
  fetchAdsMediaById,
  fetchAllAds,
  fetchAllAudioByIdModel,
  fetchAllAudioModel,
  fetchAllUsers,
  fetchLiveStream,
  fetchOrderItemByID,
  fetchPostPromotionalPackages,
  fetchProductDetailedById,
  fetchProductPromotionalPackages,
  fetchProductsImagesByProductId,
  fetchSellerIds,
  fetchSweepstacksIds,
  fetchSweepstacksWinnerUser,
  fetchSweepstakesid,
  fetchTermsAndConditionsModel,
  fetchuserEntryPackeges,
  fetchWalletBalanceByIds,
  fetchWalletHistoryByIds,
  get_admin_data_by,
  get_admin_data_by_email,
  get_admin_data_by_id,
  get_all_content,
  get_all_posts,
  get_all_product_data,
  get_all_supports,
  get_all_user_data,
  get_boosted_all_post_data,
  get_boosted_all_product_data,
  get_boosted_view_count,
  get_dashbaord_data,
  get_group_data_chat,
  get_post_by_id,
  get_product_data_by_id,
  get_seller_data_by_id,
  get_support_by_id,
  get_support_reply,
  get_user_data_by_email,
  get_user_data_by_id,
  getAdminWallet,
  getAllListOfSeller,
  getAllProductActiveData,
  getAllSellerPayoutListModel,
  getAllSellers,
  getLiveStreamViews,
  getProductCategories,
  getProductImages,
  getSellerProducts,
  insert_ads_data,
  insert_support_reply,
  insert_sweepstake_data,
  insertAdsMediaModel,
  insertSweepstacksMediaModel,
  isSellerAccountCreatedOrNot,
  mark_as_resolved_support,
  modelFetchAllUserOrders,
  modelFetchOrdersByOrderId,
  monthlyFilterRevenue,
  postViewsOnBoost,
  productTotalSales,
  sumTotalEnteries,
  sumTotalRevenue,
  sumTotalSweepstacksAmount,
  suspend_unsuspend_user_model,
  sweepstacks_winners,
  sweepstacksWinnersModel,
  update_admin_data,
  update_admin_data_by,
  update_admin_password,
  update_admin_profile,
  update_content,
  update_sweepstake_data,
  updateAdminCommissionModel,
  updateAdminFcmToken,
  updateAdsInfo,
  updateContentManagments,
  updateOrdersData,
  updatePostPromotionalPackages,
  updateProductPromotionalPackages,
  updateSweepstackEndDateModel,
  weeklyFilterRevenue,
  yearlyFilterRevenue,
  getSellerProfuctQuantity,
  fetchPrivacyPolicy,
  fetchTermsAndConditions,
  fetchAllContactSupports,
  fetchCreditAndDebitOfParticularUsers,
  fetchUserTranctionByThereId,
  fetchAllUserTranctionHistory,
  marketPlaceSell,
  fetchUserApplyToBecomeInvestorModel,
  fetchUserApplyToBecomeInvestorMediaModel,
  approveUserApplyToBecomeInvestorModel,
  rejectUserApplyToBecomeInvestorModel,
  createRanchModel,
  insertRanchesMediaModel,
  fetchRanchesMediaModel,
  fetchRanchesModel,
  fetchRanchesByIdModel,
  updateRanchesStatus,
  deleteRanchesMediaById,
  updateRanchesModel,
  hardDeleteRanchesMedia,
  getAllInvestorApplications,
  getInvestorApplicationsById,
  softRanchesDeleted,
  insertRanchesDocuments,
  fetchRanchesDocumentsModel,
  hardDeleteRanchesDocumentsId,
  hardDeleteRanchesImagesId,

  // -----------------------FETCH PURCHASES RANCHES--------------//

  modelFetchPurchasesRanches,
  fetchPurchasesRanchesModel,
  fetchRanchImagesByRanchId,
  fetchRanchDocumentsByRanchId,
  approvedInvesterRanches,
  fetchInvesterAndUsersDetailByPurchaseRanchesId,
  fetchTotalSharesSold,
  fetchInvester_supports,
  invester_support_by_id,
  finallyApprovedInvesterRanches,
  finallyRejectInvesterRanches,
  insertRanchBlackoutDays,
  fetchRanchBlackoutDays,
  deleteRanchBlackoutDays,
  bookingRequestModel,
  fetchBookingRanchesByIdsModel,
  bookingApprovedAndRejectById,
  bookingRequestModelbyIds,
  fetchRanchesbookedDatesByIds,
  updateNotActiveAdminChats,
  fetchInvestorSupportReply,
  getSellerLastPayoutDataModel,
  getAdminAllWallet,
  getAllSellerPayoutListAdminModel,
  updateSellerPayoutModel,
  get_all_product_data_by_variant,
} from "../models/admin.model.js";
import {
  createNotificationMessage,
  generateCertificateAndSendEmail,
  getCurrentDateTime,
  rejectionMailSendToInvester,
  send_notificaiton_with_email,
  send_notification_to_user,
  sendNotification,
} from "../utils/user_helper.js";
import {
  addProductCategoryModel,
  fetchSellerInfoById,
  getAllProductCategoryModel,
  getCategoryDataByCategoryID,
  getCategoryDataById,
  getCategoryDataByName,
  getCategoryDataByNameInUpdate,
  getLastPayoutDataModel,
  getProductCategoryByIDModel,
  getProductColorsByPid,
  getProductListModal,
  getProductOrderDataModel,
  getProductVariantsByPid,
  getSellerDetailsByUserId,
  getUserProductImagesByColorModal,
  upadteProductCategoryModel,
  updateSellerInfo,
} from "../models/seller.model.js";
import {
  applyAgainModel,
  editShippingAddressByIdModel,
  fetchAllPostPromotionPackagesModel,
  fetchBookingRanchesById,
  fetchInvesterByThereIds,
  fetchInvesterFormModel,
  fetchInvesterMediaModel,
  fetchOrdersItem,
  fetchRanchesBlackoutDaysModel,
  fetchSupportCategoryByCategoryIds,
  fetchUserById,
  fetchUsersById,
  insertAudioModel,
  modelFetchInvestedRanchesById,
  updateTotalShares
} from "../models/user.model.js";
import { deleteFileFromS3, getPublicUrl } from "../middleware/upload.js";
import { body } from "express-validator";
import dayjs from "dayjs";
import { baseurl } from "../config/path.js";
import Stripe from "stripe";
import axios from "axios";

import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import * as DropboxSign from "@dropbox/sign";
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { releaseFundsToRanchOwner } from "../utils/escrowClient.js";
// Dropbox Sign client
const API_KEY =
  "5058acf21a4c4ed977bf3b646a3b8576a608284eb0912419134ffc1406ccbe5c";

const signatureRequestApi = new DropboxSign.SignatureRequestApi();
signatureRequestApi.username = API_KEY;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const saltRounds = process.env.SALT_ROUNDS;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
const image_logo = process.env.LOGO_URL;
const APP_URL = process.env.APP_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
dotenv.config();

//======================================= Auth ============================================

export const loginAdmin = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;
    const schema = Joi.object({
      email: Joi.string()
        .min(5)
        .max(255)
        .email({ tlds: { allow: false } })
        .lowercase()
        .required(),
      password: Joi.string().min(8).max(15).required(),
      fcmToken: Joi.string().optional().allow("", null),
    });
    const result = schema.validate(req.body);
    if (result.error) return joiErrorHandle(res, result.error);
    const [existingAdmin] = await get_admin_data_by_email(email);
    if (!existingAdmin) {
      return handleError(res, 400, Msg.INVALID_EMAIL_PASSWORD);
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!isPasswordValid) {
      return handleError(res, 400, Msg.INVALID_EMAIL_PASSWORD);
    }
    const token = jwt.sign(
      { id: existingAdmin.id, email: existingAdmin.email },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      }
    );
    let adminId = existingAdmin.id;
    await updateAdminFcmToken(fcmToken, adminId);
    return res.status(200).json({
      success: true,
      status: 200,
      message: Msg.LOGIN_SUCCESSFUL,
      token: token,
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, error.message);
  }
};

export const render_forgot_password_page = (req, res) => {
  try {
    return res.render("resetPasswordAdmin.ejs");
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

export const forgot_password = async (req, res) => {
  try {
    const forgotPasswordSchema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return handleError(res, 400, error.details[0].message);
    }
    const { email } = value;
    const [admin] = await get_admin_data_by_email(email);
    if (!admin) {
      return handleError(res, 404, Msg.ADMIN_NOT_FOUND);
    }

    if (admin.is_verified === false) {
      return handleError(res, 400, Msg.VERIFY_EMAIL_FIRST);
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(email);

    const resetTokenExpiry = new Date(Date.now() + 3600000);

    const update_admin_datad = await update_admin_data(
      resetToken,
      resetTokenExpiry,
      email
    );
    console.log(update_admin_datad, "update_admin_datad");

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/api/admin/reset-password?token=${resetToken}`;
    const emailTemplatePath = path.resolve(
      __dirname,
      "../views/forgotPasswordAdmin.ejs"
    );
    const emailHtml = await ejs.renderFile(emailTemplatePath, {
      resetLink,
      image_logo,
    });
    const emailOptions = {
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
    };
    await sendEmail(emailOptions);
    return handleSuccess(res, 200, Msg.PASSWORD_RESET_LINK_SENT(email));
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

export const reset_password = async (req, res) => {
  try {
    const resetPasswordSchema = Joi.object({
      token: Joi.string().required(),
      newPassword: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long",
        "any.required": "New password is required",
      }),
    });
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return handleError(res, 400, error.details[0].message);
    }
    const { token, newPassword } = value;

    const [admin] = await get_admin_data_by(token);
    if (!admin) {
      return handleError(res, 400, Msg.INVALID_EXPIRED_TOKEN);
    }
    if (admin.show_password === newPassword) {
      return handleError(res, 400, Msg.PASSWORD_CAN_NOT_SAME);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const update_result = await update_admin_data_by(
      hashedPassword,
      newPassword,
      admin.id
    );

    if (update_result.affectedRows > 0) {
      return handleSuccess(res, 200, Msg.PASSWORD_RESET_SUCCESS);
    } else {
      return handleError(res, 500, Msg.PASSWORD_RESET_FAILED);
    }
  } catch (error) {
    console.error("Error in reset password controller:", error);
    return handleError(res, 500, error.message);
  }
};

export const render_success_reset = (req, res) => {
  return res.render("successReset.ejs");
};

export const getProfile = async (req, res) => {
  try {
    const adminReq = req.admin;
    const [admin] = await get_admin_data_by_id(adminReq.id);
    if (!admin) {
      return handleError(res, 404, Msg.ADMIN_NOT_FOUND);
    }
    if (admin.profile_image && !admin.profile_image.startsWith("http")) {
      admin.profile_image = `${APP_URL}${admin.profile_image}`;
    }
    return handleSuccess(res, 200, Msg.ADMIN_PROFILE_FETCHED, admin);
  } catch (error) {
    console.error("Error in getProfile:", error);
    return handleError(res, 500, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updateProfileSchema = Joi.object({
      full_name: Joi.string().required(),
      mobile_number: Joi.string().required(),
      admin_commission: Joi.number().required().min(0).messages({
        "any.required":
          "The admin_commission field cannot be empty. Please provide a admin_commission.",
        "number.base": "admin_commission must contain only numeric values",
        "number.min":
          "admin_commission must be a positive number and cannot be less than zero.",
      }),
    });

    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return handleError(res, 400, error.details[0].message);
    }

    const { full_name, mobile_number, admin_commission } = value;
    const adminReq = req.admin;
    const [admin] = await get_admin_data_by_id(adminReq.id);
    if (!admin) {
      return handleError(res, 404, Msg.ADMIN_NOT_FOUND);
    }
    let profile_image = admin.profile_image;
    if (req.file) {
      profile_image = req.file.filename;
    }
    console.log(profile_image);

    const update_profile = await update_admin_profile(
      full_name,
      profile_image,
      mobile_number,
      admin_commission,
      adminReq.id
    );

    return handleSuccess(res, 200, "Profile updated successfully");
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return handleError(res, 400, Msg.CUREENT_NEW_REQUIERED);
    }
    const admin = req.admin;
    if (!admin) {
      return handleError(res, 404, Msg.ADMIN_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return handleError(res, 400, Msg.CURRENT_PASSWORD_INCORRECT);
    }

    if (admin.show_password === newPassword) {
      return handleError(res, 400, Msg.PASSWORD_CAN_NOT_BE_SAME);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const update_admin = await update_admin_password(
      hashedPassword,
      newPassword,
      admin.id
    );

    return handleSuccess(res, 200, Msg.PASSWORD_CHANGED_SUCCESSFULLY);
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

//======================================= User ============================================
export const get_users_data = async (req, res) => {
  try {
    let all_users = await get_all_user_data();
    if (all_users.length == 0) {
      return handleError(res, 404, Msg.USER_NOT_FOUNT);
    }
    all_users.map(async (user) => {
      if (user.profileImage && !user.profileImage.startsWith("http")) {
        user.profileImage = `${APP_URL}${user.profileImage}`;
      }
      if (user.backgroundImage && !user.backgroundImage.startsWith("http")) {
        user.backgroundImage = `${APP_URL}${user.backgroundImage}`;
      }
    });
    return handleSuccess(res, 200, Msg.USER_RETRIVED, all_users);
  } catch (error) {
    console.error("Error in getProfile:", error);
    return handleError(res, 500, error.message);
  }
};

export const suspend_unsuspend_user = async (req, res) => {
  try {
    const updateProfileSchema = Joi.object({
      user_id: Joi.number().required(),
      suspend_status: Joi.number().required(),
    });

    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return handleError(res, 400, error.details[0].message);
    }

    const { user_id, suspend_status } = value;

    const [user] = await get_user_data_by_id(user_id);
    if (!user) {
      return handleError(res, 404, Msg.USER_NOT_FOUND);
    }

    const result = await suspend_unsuspend_user_model(user_id, suspend_status);
    let response_message = suspend_status ? "Suspended" : "Unsuspended";
    return handleSuccess(
      res,
      200,
      Msg.USER_SUSPEND_UNSUSPENDED(response_message)
    );
  } catch (error) {
    console.error("Error in suspend_unsuspend_user:", error);
    return handleError(res, 500, error.message);
  }
};

//======================================= Seller ============================================
export const get_seller_data = async (req, res) => {
  try {
    const sellers = await getAllSellers(APP_URL);
    const productImages = await getProductImages(APP_URL);
    const productCategories = await getProductCategories();
    const categoryMap = Object.fromEntries(
      productCategories.map((cat) => [cat.id, cat.category_name])
    );
    const imagesMap = productImages.reduce((acc, img) => {
      if (!acc[img.product_id]) {
        acc[img.product_id] = [];
      }
      if (img.pImage && !img.pImage.startsWith("http")) {
        acc[img.product_id].push(APP_URL + img.pImage);
      } else {
        acc[img.product_id].push(img.pImage);
      }
      return acc;
    }, {});
    for (const seller of sellers) {
      try {
        const product_data = await getSellerProducts(
          seller.seller_id,
          seller.userName
        );
        // console.log({ product_data })
        seller.products = product_data;
        let product_quantity = 0;
        let product_price = 0;
        for (const item of product_data || []) {
          const product_val = await getSellerProfuctQuantity(item?.product_id);
          if (product_val && product_val[0]) {
            product_quantity += Number(product_val[0]?.total_quantity || 0);
            product_price += Number(product_val[0]?.total_earnings || 0);
          }
        }
        seller.total_products = product_data.length;
        seller.total_products = product_data.length;
        seller.total_sales = isNaN(product_quantity) ? 0 : product_quantity;
        seller.total_earnings = isNaN(product_price) ? 0 : product_price;
        seller.user = {
          user_id: seller.user_id,
          full_name: seller.full_name,
          userName: seller.userName,
          bio: seller.bio,
          profileImage: seller.profileImage,
          backgroundImage: seller.backgroundImage,
          huntingTitle: seller.huntingTitle,
          isVerified: seller.isVerified,
        };
      } catch (error) {
        console.error(
          `Error fetching products for seller ${seller.seller_id}:`,
          error.message
        );
        seller.products = [];
        seller.total_products = 0;
        seller.total_sales = 0;
        seller.total_earnings = 0;
      }

      seller.products = seller.products.map((product) => ({
        ...product,
        productImages: imagesMap[product.product_id] || [],
        category_name: categoryMap[product.category] || null,
      }));
    }

    return handleSuccess(res, 200, Msg.SELLER_RETRIEVED, sellers);
  } catch (error) {
    console.error("Database Error in get_seller_data:", error.message);
    return handleError(res, 500, "Failed to fetch seller data.");
  }
};

export const active_inactive_seller = async (req, res) => {
  try {
    const updateProfileSchema = Joi.object({
      seller_id: Joi.number().required(),
      status: Joi.number().valid(0, 1).required(),
    });

    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return handleError(res, 400, error.details[0].message);
    }
    const { seller_id, status } = value;

    const [seller] = await get_seller_data_by_id(seller_id);
    if (!seller) {
      return handleError(res, 404, Msg.SELLER_NOT_FOUNT);
    }

    const result = await active_inactive_seller_model(seller_id, status);

    let response_message = status ? "Active" : "Inactive";
    return handleSuccess(
      res,
      200,
      Msg.ACTIVE_INACTIVE_SELLER(response_message)
    );
  } catch (error) {
    console.error("Error in suspend_unsuspend_user:", error);
    return handleError(res, 500, error.message);
  }
};

export const approved_reject_seller_request = async (req, res) => {
  try {
    const adminReq = req.admin;
    const updateProfileSchema = Joi.object({
      seller_id: Joi.number().required(),
      is_apporved: Joi.number().valid(1, 2).required(),
    });

    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) joiErrorHandle(res, error);

    const { seller_id, is_apporved } = value;

    const [seller] = await get_seller_data_by_id(seller_id);
    if (!seller) {
      return handleError(res, 404, Msg.SELLER_NOT_FOUNT);
    }
    const [user] = await get_user_data_by_id(seller.userId);
    if (!seller) {
      return handleError(res, 404, Msg.USER_NOT_FOUND);
    }

    let rejected_at = new Date();
    // let rejected_at = null
    let response_message = is_apporved == 1 ? "Approved" : "Rejected";
    if (response_message == "Rejected") {
      rejected_at = new Date();
    }

    const result = await approved_reject_seller_request_model(
      seller_id,
      rejected_at,
      is_apporved
    );

    let postId = 0;
    const notificationData = await createNotificationMessage({
      notificationSend: is_apporved == 1 ? "sellerApproved" : "sellerRejected",
      fullName: user.fullName,
      id: adminReq.id,
      userId: user.id,
      followId: null,
      usersfetchFcmToken: user.fcmToken,
      notificationType: is_apporved == 1 ? 4 : 5,
      postId: 0,
    });
    await sendNotification(notificationData, postId);

    return handleSuccess(
      res,
      200,
      Msg.SELLER_APPOROVE_REJECT(response_message)
    );
  } catch (error) {
    console.error("Error in suspend_unsuspend_user:", error);
    return handleError(res, 500, "Internal Server Error");
  }
};

// export const getSellerDetailedById = async (req, res) => {
//   try {
//     const { sellerId } = req.query;
//     if (!sellerId) return handleError(res, 400, "sellerId is required");

//     const sellerDetailsArr = await fetchSellerIds(sellerId);
//     const productImages = await getProductImages(APP_URL);
//     const sellerDetails = sellerDetailsArr?.[0] || {};

//     const fetchProducts = await fetchProductDetailedById(sellerId);

//     const imagesMap = productImages.reduce((acc, img) => {
//       if (!acc[img.product_id]) {
//         acc[img.product_id] = [];
//       }

//       const imageUrl = img.pImage?.startsWith("http")
//         ? img.pImage
//         : APP_URL + img.pImage;
//       acc[img.product_id].push(imageUrl);
//       return acc;
//     }, {});

//     const productDetails = fetchProducts.map((product) => ({
//       ...product,
//       productImages: imagesMap[product.pId] || [],
//       total_sales: 0,
//     }));

//     const sellerInfo = {
//       ...sellerDetails,
//       productDetails: productDetails || [],
//     };

//     return handleSuccess(res, 200, Msg.dataFoundSuccessful, sellerInfo);
//   } catch (err) {
//     return handleError(res, 500, err.message);
//   }
// };

//======================================= Posts ============================================
export const get_posts_data = async (req, res) => {
  try {
    let all_posts = await get_all_posts();
    if (all_posts.length === 0) {
      return handleError(res, 404, Msg.POST_NOT_FOUND);
    }

    all_posts = await Promise.all(
      all_posts.map(async (post) => {
        let post_images = [];
        let post_video = "";

        if (typeof post.imageUrl === "string" && post.imageUrl.trim() !== "") {
          try {
            post_images = post.imageUrl.trim().startsWith("[")
              ? JSON.parse(post.imageUrl)
              : [post.imageUrl];
          } catch (err) {
            console.error("Invalid JSON in imageUrl:", post.imageUrl);
            return handleError(res, 500, "Invalid image URL format");
          }
        }

        if (typeof post.videoUrl === "string" && post.videoUrl.trim() !== "") {
          try {
            post_video =
              post.videoUrl.trim().startsWith("{") ||
                post.videoUrl.trim().startsWith("[")
                ? JSON.parse(post.videoUrl)
                : post.videoUrl;
          } catch (err) {
            console.error("Invalid JSON in videoUrl:", post.videoUrl);
            return handleError(res, 500, "Invalid video URL format");
          }
        }

        post_images = await Promise.all(
          post_images.map(async (post_image) => {
            return post_image && !post_image.startsWith("http")
              ? `${APP_URL}${post_image}`
              : post_image;
          })
        );

        if (
          typeof post_video === "string" &&
          post_video.trim() !== "" &&
          !post_video.startsWith("http")
        ) {
          post_video = `${APP_URL}${post_video}`;
        }

        return {
          ...post,
          imageUrl: post_images,
          videoUrl: post_video,
          share_count: 0,
        };
      })
    );

    return handleSuccess(res, 200, Msg.POST_RETRIVED, all_posts);
  } catch (error) {
    console.error("Error in get_posts_data:", error);
    return handleError(res, 500, "Internal Server Error");
  }
};

export const delete_post = async (req, res) => {
  try {
    const delete_post_schema = Joi.object({
      post_id: Joi.number().required(),
    });

    const { error, value } = delete_post_schema.validate(req.body);
    if (error) joiErrorHandle(res, error);

    const { post_id } = value;
    let post_data = await get_post_by_id(post_id);
    if (post_data.length == 0) {
      return handleError(res, 404, Msg.POST_NOT_FOUND);
    }
    const { videoUrl, videoThumbnail, imageUrl } = post_data[0];
    let filesToDelete = [];
    if (videoUrl) {
      filesToDelete.push(videoUrl);
    }
    if (videoThumbnail) {
      filesToDelete.push(videoThumbnail);
    }
    if (imageUrl) {
      try {
        let images =
          typeof imageUrl === "string" ? JSON.parse(imageUrl) : imageUrl;
        if (Array.isArray(images)) {
          images.forEach((url) => {
            if (url) filesToDelete.push(url);
          });
        }
      } catch (err) {
        console.error("Error parsing imageUrl:", err);
      }
    }
    for (let fileUrl of filesToDelete) {
      await deleteFileFromS3(fileUrl);
    }
    await delete_post_by_id(post_id);
    return handleSuccess(res, 200, Msg.POST_DELETED);
  } catch (error) {
    console.error("Error in getProfile:", error);
    return handleError(res, 500, error.message);
  }
};

//======================================= Product ============================================
// export const get_product_data = async (req, res) => {
//   try {
//     let all_product = await get_all_product_data();
//     if (!all_product || all_product.length === 0) {
//       return handleSuccess(res, 200, Msg.PRODUCT_RETRIVED, []);
//     }

//     const mergedProducts = all_product.reduce((acc, product) => {
//       const existingProduct = acc.find((item) => item.pId === product.pId);

//       let product_images = [];

//       if (
//         typeof product.productImages === "string" &&
//         product.productImages.trim() !== ""
//       ) {
//         const trimmedImages = product.productImages.trim();

//         if (trimmedImages.startsWith("[") || trimmedImages.startsWith("{")) {
//           try {
//             const parsedImages = JSON.parse(trimmedImages);
//             if (Array.isArray(parsedImages)) {
//               product_images = parsedImages;
//             } else if (typeof parsedImages === "string") {
//               product_images = [parsedImages];
//             } else {
//               console.warn("Unexpected format in productImages:", parsedImages);
//             }
//           } catch (err) {
//             console.error("Error parsing productImages:", trimmedImages);
//             product_images = [trimmedImages];
//           }
//         } else {
//           product_images = [trimmedImages];
//         }
//       }

//       product_images = product_images.map((product_image) => {
//         return product_image && !product_image.startsWith("http")
//           ? `${APP_URL}${product_image}`
//           : product_image;
//       });

//       if (existingProduct) {
//         existingProduct.productImages = [
//           ...existingProduct.productImages,
//           ...product_images,
//         ];
//       } else {
//         acc.push({
//           ...product,
//           total_seles: 1000,
//           productImages: product_images,
//         });
//       }

//       return acc;
//     }, []);

//     return handleSuccess(res, 200, Msg.PRODUCT_RETRIVED, mergedProducts);
//   } catch (error) {
//     console.error("Error in get_product_data:", error);
//     return handleError(res, 500, "Internal Server Error");
//   }
// };

export const delete_product = async (req, res) => {
  try {
    const delete_product_schema = Joi.object({
      product_id: Joi.string().required(),
    });

    const { error, value } = delete_product_schema.validate(req.body);
    if (error) joiErrorHandle(res, error);

    const { product_id } = value;

    const [product_data] = await get_product_data_by_id(product_id);
    if (!product_data) return handleError(res, 404, "Product Not Found");
    const data = {
      status: 1,
    };
    const result = await delete_product_by_id(product_id);

    return handleSuccess(res, 200, "Product deleted successfully.");
  } catch (error) {
    console.error("Error in delete_product:", error);
    return handleError(res, 500, "Internal Server Error");
  }
};

//======================================= Supports ============================================
export const get_supports_data = async (req, res) => {
  try {
    let all_support = await get_all_supports();

    if (all_support.length === 0) {
      return handleError(res, 404, Msg.SUPPORT_NOT_FOUND);
    }
    all_support = await Promise.all(
      all_support.map(async (support) => {
        let user = await get_user_data_by_email(support.email);
        let userData = await fetchUsersById(support.user_id);
        let fullName = userData[0].fullName;
        let reply = await get_support_reply(support.email);
        let categoryName = null;
        let categoryImage = null;
        if (support.categoryId != null) {
          let fetchCategoryDetails = await fetchSupportCategoryByCategoryIds(
            support.categoryId
          );
          if (fetchCategoryDetails && fetchCategoryDetails.length > 0) {
            categoryName = fetchCategoryDetails[0].categoryName;
            categoryImage = fetchCategoryDetails[0].categoryImage;
          }
        }
        return {
          ...support,
          support_reply: reply,
          user,
          issued_category: "Hunter",
          priority_lavel: "High",
          subject: "support for hunter",
          attachment: "",
          categoryName,
          categoryImage,
          fullName,
        };
      })
    );
    const userDetails = [];
    const sellerDetail = [];
    const investorDetail = [];
    // ================================
    // ADD INVESTOR SUPPORTS HERE
    // ================================
    let investorSupports = await fetchInvester_supports();

    investorSupports.forEach(async (inv) => {
      let data = await fetchInvestorSupportReply(inv.id)
      investorDetail.push({
        id: inv.id,
        user_id: inv.user_id,
        fullname: inv.fullname,
        email: inv.email,
        phoneNumber: inv.phoneNumber || null,
        reason: inv.reason || null,
        message: inv.message || null,
        support_reply: data,
        user: [],
        createdAt: inv.createdAt,
        updatedAt: inv.updatedAt,
      });
    });


    all_support.forEach((item) => {
      if (item.categoryName === null) {
        sellerDetail.push(item);
      } else {
        userDetails.push(item);
      }
    });
    return handleSuccess(res, 200, Msg.SUPPORT_RETRIVED, {
      userDetails,
      sellerDetail,
      investorDetail,
    });
  } catch (error) {
    console.error("Error in get_supports_data:", error);
    return handleError(res, 500, error.message);
  }
};

export const reply_to_support = async (req, res) => {
  try {
    const schema = Joi.object({
      support_id: Joi.number().required(),
      replyMessage: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return joiErrorHandle(res, error);

    const { support_id, replyMessage } = value;

    const [support] = await get_support_by_id(support_id);
    if (!support) {
      return handleError(res, 404, "Support request not found.");
    }

    const emailTemplatePath = path.resolve(
      __dirname,
      "../views/support_reply.ejs"
    );

    const emailHtml = await ejs.renderFile(emailTemplatePath, {
      replyMessage,
      image_logo,
    });

    const emailOptions = {
      to: support.email,
      subject: "Trophy Talk Support",
      html: emailHtml,
    };

    await sendEmail(emailOptions);

    await insert_support_reply(replyMessage, support.email);

    return handleSuccess(res, 200, "Support reply sent successfully.");
  } catch (error) {
    console.error("Error in reply_to_support:", error);
    return handleError(res, 500, error.message);
  }
};

export const mark_as_resolved = async (req, res) => {
  try {
    const schema = Joi.object({
      support_id: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return joiErrorHandle(res, error);

    const { support_id, replyMessage } = value;

    const [support] = await get_support_by_id(support_id);
    if (!support) {
      return handleError(res, 404, "Support request not found.");
    }
    await mark_as_resolved_support(support_id);

    return handleSuccess(res, 200, "Mark As Resolved successfully.");
  } catch (error) {
    console.error("Error in reply_to_support:", error);
    return handleError(res, 500, error.message);
  }
};

//======================================= Category ============================================
export const addProductCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    const check_category = await getCategoryDataByName(category_name);
    if (check_category?.length != 0) {
      return handleError(res, 400, Msg.PRODUCT_CATEGORY_ERROR);
    }
    const data = {
      category_name: category_name,
      seller_id: 0,
    };
    const add_category = await addProductCategoryModel(data);
    if (add_category.affectedRows > 0) {
      return handleSuccess(res, 201, Msg.ADD_PRODUCT_CATEGORY);
    } else {
      return handleError(res, 400, Msg.ADD_PRODUCT_CATEGORY_ERROR);
    }
  } catch (err) {
    return handleError(res, 500, err.message);
  }
};

export const updateProductCategory = async (req, res) => {
  try {
    const { category_id, category_name } = req.body;
    const check_category = await getCategoryDataByCategoryID(category_id);
    if (check_category?.length == 0) {
      return handleError(res, 400, Msg.PRODUCT_CATEGORY_NOT_EXIST);
    }
    const data = {
      category_name: category_name,
    };

    const check_category_product_cateogory_name =
      await getCategoryDataByNameInUpdate(category_name, category_id);

    if (check_category_product_cateogory_name?.length != 0) {
      return handleError(res, 400, Msg.PRODUCT_CATEGORY_ERROR);
    }

    const update_category = await upadteProductCategoryModel(data, category_id);
    if (update_category.affectedRows > 0) {
      return handleSuccess(res, 200, Msg.UPDATE_PRODUCT_CATEGORY);
    } else {
      return handleError(res, 304, Msg.UPDATE_PRODUCT_CATEGORY_ERROR);
    }
  } catch (err) {
    return handleError(res, 500, err.message);
  }
};

export const getAllCategoryData = async (req, res) => {
  try {
    const category_data = await getAllProductCategoryModel();
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, category_data);
  } catch (err) {
    return handleError(res, 500, Msg.INTERNAL_SERVER_ERROR);
  }
};

export const deleteProductCategory = async (req, res) => {
  try {
    const { category_id } = req.query;
    const category_data = await getProductCategoryByIDModel(category_id);
    if (category_data?.length == 0) {
      return handleError(res, 400, Msg.dataNotFound);
    }
    const data = {
      is_active: 1,
    };
    const delete_category = await upadteProductCategoryModel(data, category_id);
    if (delete_category.affectedRows > 0) {
      return handleSuccess(res, 200, Msg.DELETE_PRODUCT_CATEGORY);
    } else {
      return handleError(res, 304, Msg.DELETE_PRODUCT_CATEGORY_ERROR);
    }
  } catch (err) {
    return handleError(res, 500, err.message);
  }
};

//======================================= Dashboard ============================================
export const dashboard = async (req, res) => {
  try {
    const [result] = await get_dashbaord_data();
    let productList = await getAllProductActiveData();
    let fetchAllAdsData = await fetchAllAds();
    let totalRevenue = await sumTotalRevenue();
    let sweepstackRevenueCount = await sumTotalSweepstacksAmount();
    const data = {
      total_products: productList.length > 0 ? productList.length : 0,
      total_orders: totalRevenue.length > 0 ? totalRevenue[0].total_orders : 0,
      total_revenue:
        totalRevenue.length > 0 ? totalRevenue[0].total_revenue : 0,
      sweepstackRevenueCount:
        sweepstackRevenueCount.length > 0
          ? sweepstackRevenueCount[0].sweepstacks_revenue
          : 0,
      active_subscription_count: 0,
      total_users: result.total_users || 0,
      total_sellers: result.total_sellers || 0,
      total_ads: fetchAllAdsData.length > 0 ? fetchAllAdsData.length : 0,
    };

    return handleSuccess(res, 200, Msg.DASHBOARD_DATA_RETRIVED, data);
  } catch (error) {
    console.error("Error in dashboard:", error);
    return handleError(res, 500, error.message);
  }
};

//======================================= Admin Notification ============================================
export const fetchAllAdminNotifications = async (req, res) => {
  try {
    const adminReq = req.admin;
    const [admin] = await get_admin_data_by_id(adminReq.id);
    let getAllNotifications = await fetchAdminNotificationById(adminReq.id);
    return handleSuccess(
      res,
      200,
      Msg.dataFoundSuccessful,
      getAllNotifications
    );
  } catch (err) {
    return handleError(res, 500, err.message);
  }
};

//======================================= Broadcast Notification =======================================
export const send_broadcast_notification = async (req, res) => {
  try {
    const schema = Joi.object({
      user_ids: Joi.array().required(),
      user_ids: Joi.array().required(),
      title: Joi.string().required(),
      notification_to: Joi.string().valid("app", "email", "both").required(),
      message: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return joiErrorHandle(res, error);

    const { user_ids, title, message, notification_to } = value;
    if (user_ids.length == 0)
      return handleError(res, 400, "Please Select at least one user");

    let message_body = {
      tittle: title,
      body: message,
    };
    if (notification_to == "both") {
      await Promise.all(
        user_ids.map(async (user_id) => {
          await send_notification_to_user(user_id, message_body);
          await send_notificaiton_with_email(
            user_id,
            title,
            message,
            image_logo
          );
        })
      );
    }

    if (notification_to == "app") {
      await Promise.all(
        user_ids.map(async (user_id) => {
          await send_notification_to_user(user_id, message_body);
        })
      );
    }
    if (notification_to == "email") {
      await Promise.all(
        user_ids.map(async (user_id) => {
          await send_notificaiton_with_email(
            user_id,
            title,
            message,
            image_logo
          );
        })
      );
    }

    return handleSuccess(res, 200, "Notification Sent Successfully.");
  } catch (error) {
    console.error("Error in reply_to_support:", error);
    return handleError(res, 500, error.message);
  }
};

//======================================= Supports ============================================
export const get_group_data = async (req, res) => {
  try {
    let group_data = await get_group_data_chat();

    if (group_data.length === 0) {
      return handleError(res, 404, Msg.GROUP_DATA_NOT_FOUNT);
    }

    let final_data = group_data.map((group) => {
      group.member_count = 0;
      return {
        ...group,
      };
    });
    return handleSuccess(res, 200, Msg.GROUP_DATA_RETRIVED, final_data);
  } catch (error) {
    console.error("Error in get_supports_data:", error);
    return handleError(res, 500, error.message);
  }
};

//==================================== Content Management ======================================
export const get_contents = async (req, res) => {
  try {
    const content = await get_all_content();
    if (!content) {
      return handleError(res, 404, "Content not found");
    }
    return handleSuccess(res, 200, "Content fetched successfully", content);
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

export const updateContent = async (req, res) => {
  try {
    const updateSchema = Joi.object({
      content_management_id: Joi.number().required(),
      content_type: Joi.string()
        .valid("terms_and_service", "privacy_policy")
        .optional(),
      content: Joi.string().optional(),
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) return joiErrorHandle(res, error);

    const { content_management_id, content_type, content } = value;
    const [existingContent] = await contentManagementfindOneBy(
      content_management_id
    );
    if (!existingContent) {
      return handleError(res, 404, "Content not found");
    }
    await update_content(content, content_type, content_management_id);

    return handleSuccess(
      res,
      200,
      "Content updated successfully",
      existingContent
    );
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

//==================================== Sweep Stacks ======================================

export const add_sweepstake = async (req, res) => {
  try {
    const schema = Joi.object({
      sweepstakes_name: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      description: Joi.string().allow("", null),
      entry_price: Joi.any().required(),
      winningPrice: Joi.any().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return joiErrorHandle(res, error);

    const {
      sweepstakes_name,
      start_date,
      end_date,
      description,
      entry_price,
      winningPrice,
    } = value;
    let attachment = [];
    console.log(req.files, "req.files");
    let mediaFiles = req.files.file;
    console.log("mediaFiles", mediaFiles);

    if (mediaFiles.length > 0) {
      attachment = mediaFiles.map((file) => {
        const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
        return getPublicUrl(safeKey);
      });
    }
    // let attachment = req.file ? getPublicUrl(req.file.key) : "";
    let isSweepstacksAdded = await insert_sweepstake_data(
      sweepstakes_name,
      start_date,
      end_date,
      description,
      JSON.stringify(entry_price),
      null,
      winningPrice
    );
    if (isSweepstacksAdded.insertId) {
      attachment.map(async (item) => {
        let type;
        const extension = item.split(".").pop().toLowerCase();
        if (
          ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(
            extension
          )
        ) {
          type = "image";
        } else {
          type = "video";
        }
        let obj = {
          sweepstacksId: isSweepstacksAdded.insertId,
          media: type,
          videoThumbnail: null,
          file: item,
        };
        await insertSweepstacksMediaModel(obj);
      });
      return handleSuccess(res, 201, "Sweepstake added successfully");
    } else {
      return handleError(res, 400, "Failed to add sweepstacks");
    }
  } catch (error) {
    console.error("Error in add_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const get_all_sweepstakes = async (req, res) => {
  try {
    let data = await fetch_all_sweepstakes();
    // data = data.map(item => ({ ...item, entry_price: item.entry_price ? JSON.parse(item.entry_price) : {}, }));
    const now = new Date();
    data = await Promise.all(
      data.map(async (item) => {
        const startDate = new Date(item.start_date);
        const endDate = new Date(item.end_date);
        let sweepstackStatus = "";
        if (now < startDate) {
          sweepstackStatus = "coming soon";
        } else if (now >= startDate && now <= endDate) {
          sweepstackStatus = "open";
        } else {
          sweepstackStatus = "completed";
        }
        let attachment = await fetch_sweepstakesMedia_by_id(
          item.sweepstakes_id
        );
        return {
          ...item,
          attachment: attachment ? attachment : [],

          entry_price: item.entry_price
            ? JSON.parse(
              typeof item.entry_price === "string"
                ? JSON.parse(item.entry_price)
                : item.entry_price
            )
            : {},
          status: sweepstackStatus,
        };
      })
    );
    return handleSuccess(res, 200, "Sweepstakes fetched successfully", data);
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const update_sweepstake = async (req, res) => {
  try {
    let schema = Joi.object({
      sweepstakes_id: Joi.number().required(),
      sweepstakes_name: Joi.string().optional(),
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
      description: Joi.string().allow("", null),
      entry_price: Joi.any().optional(),
      winningPrice: Joi.any().optional(),
      deleteFileId: Joi.any().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return joiErrorHandle(res, error);
    let {
      sweepstakes_id,
      sweepstakes_name,
      start_date,
      end_date,
      description,
      entry_price,
      winningPrice,
      deleteFileId,
    } = value;
    const [sweepstake_data] = await fetch_sweepstakes_by_id(sweepstakes_id);
    if (!sweepstake_data) return handleError(res, 404, "SweepStake Not Found");
    let attachment = [];
    let mediaFiles = req.files.file;
    entry_price = entry_price
      ? JSON.stringify(entry_price)
      : sweepstake_data.entry_price;
    await update_sweepstake_data(
      sweepstakes_id,
      sweepstakes_name,
      start_date,
      end_date,
      description,
      entry_price,
      winningPrice
    );
    deleteFileId = deleteFileId ? JSON.parse(deleteFileId) : [];
    if (deleteFileId.length > 0) {
      await Promise.all(
        deleteFileId.map(async (item) => {
          let data = await fetch_sweepstakesFile_by_id(item);
          let mediaUrl = data[0].file;
          let mediaId = data[0].id;
          await deleteFileFromS3(mediaUrl);
          await delete_Media_dataByIds(mediaId);
        })
      );
    }

    if (mediaFiles && mediaFiles.length > 0) {
      attachment = mediaFiles.map((file) => {
        const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
        return getPublicUrl(safeKey);
      });
    }
    if (attachment.length > 0) {
      attachment.map(async (item) => {
        let type;
        const extension = item.split(".").pop().toLowerCase();
        if (
          ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(
            extension
          )
        ) {
          type = "image";
        } else {
          type = "video";
        }
        let obj = {
          sweepstacksId: sweepstakes_id,
          media: type,
          videoThumbnail: null,
          file: item,
        };
        await insertSweepstacksMediaModel(obj);
      });
    }
    return handleSuccess(res, 200, "Sweepstake updated successfully");
  } catch (error) {
    console.error("Error in update_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const delete_sweepstake = async (req, res) => {
  try {
    const schema = Joi.object({
      sweepstakes_id: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return joiErrorHandle(res, error);

    const { sweepstakes_id } = value;

    const [sweepstake_data] = await fetch_sweepstakes_by_id(sweepstakes_id);
    if (!sweepstake_data) return handleError(res, 404, "Sweep Stake Not Found");
    let fetchMedia = await fetch_sweepstakesMedia_by_id(sweepstakes_id);
    if (fetchMedia && fetchMedia.length > 0) {
      fetchMedia.map(async (item) => {
        await deleteFileFromS3(item.file);
      });
    }
    await delete_sweepstake_data(sweepstakes_id);
    return handleSuccess(res, 200, "Sweepstake deleted successfully");
  } catch (error) {
    console.error("Error in delete_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchSweepstacksById = async (req, res) => {
  try {
    let { id } = req.query;
    let data = await fetch_sweepstakes_by_id(id);
    if (data.length == 0) {
      return handleError(res, 400, error.message);
    }
    let sweepstacksData = await fetchSweepstakesid(id);
    let winnerUsersDetailed = await fetchSweepstacksWinnerUser(id);
    let attachment = await fetch_sweepstakesMedia_by_id(id);
    const now = new Date();
    const startDate = new Date(data[0].start_date);
    const endDate = new Date(data[0].end_date);
    let sweepstackStatus = "";
    if (now < startDate) {
      sweepstackStatus = "coming soon";
    } else if (now >= startDate && now <= endDate) {
      sweepstackStatus = "open";
    } else {
      sweepstackStatus = "completed";
    }
    data[0].status = sweepstackStatus;
    data[0].revenue =
      sweepstacksData.length > 0 ? sweepstacksData[0].totalRevenue : 0;
    data[0].participants =
      sweepstacksData.length > 0 ? sweepstacksData[0].totalParticipate : 0;
    data[0].winner_user_detailed =
      winnerUsersDetailed.length > 0 ? winnerUsersDetailed[0] : {};
    (data[0].entry_price = data[0].entry_price
      ? JSON.parse(
        typeof data[0].entry_price === "string"
          ? JSON.parse(data[0].entry_price)
          : data[0].entry_price
      )
      : {}),
      (data[0].attachment = attachment ? attachment : attachment);
    return handleSuccess(res, 200, "Sweepstakes fetched successfully", data[0]);
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

export const fetchAllUserOrders = async (req, res) => {
  try {
    let data = await modelFetchAllUserOrders();

    if (data.length > 0) {
      data = await Promise.all(
        data.map(async (item) => {
          let allOrderItem = await fetchOrdersItem(item.id);
          item.totalItem = allOrderItem.length > 0 ? allOrderItem.length : 0;
          return item;
        })
      );
      return handleSuccess(res, 200, "Order found successfully", data);
    } else {
      return handleError(res, 404, "No Orders list");
    }
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchUserOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.query;
    let data = await modelFetchOrdersByOrderId(orderId);
    if (data.length === 0) {
      return handleError(res, 404, "No Orders found");
    }
    data = await Promise.all(
      data.map(async (item) => {
        const firstShippingDeta = item.shippingDetailed
          ? JSON.parse(item.shippingDetailed)
          : {};
        item.shippingDetailed = firstShippingDeta[0] || {};
        const fetchOrdersItem = await fetchOrderItemByID(item.id);
        const enrichedItems = await Promise.all(
          fetchOrdersItem.map(async (i) => {
            const productImages = await fetchProductsImagesByProductId(
              i.product_id
            );
            return {
              ...i,
              productImages: productImages.length > 0 ? productImages : [],
            };
          })
        );
        item.ordersItem = enrichedItems;
        return item;
      })
    );
    return handleSuccess(res, 200, "Order found successfully", data[0]);
  } catch (error) {
    console.error("Error in fetchUserOrderByOrderId:", error);
    return handleError(res, 500, error.message);
  }
};

export const add_ads = async (req, res) => {
  try {
    let adsImages = [];
    let mediaFiles = req.files.file;
    if (mediaFiles.length > 0) {
      adsImages = mediaFiles.map((file) => {
        const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
        return getPublicUrl(safeKey);
      });
    }
    let result = await insert_ads_data(req.body);
    if (result.insertId) {
      adsImages.map(async (item) => {
        let type;
        const extension = item.split(".").pop().toLowerCase();
        if (
          ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(
            extension
          )
        ) {
          type = "image";
        } else {
          type = "video";
        }
        let obj = {
          ads_id: result.insertId,
          media: type,
          videoThumbnail: null,
          file: item,
        };
        await insertAdsMediaModel(obj);
      });

      return handleSuccess(res, 201, "Ads added successfully");
    } else {
      return handleError(res, 400, "Failed to add ads");
    }
  } catch (error) {
    console.error("Error in add_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const get_all_ads = async (req, res) => {
  try {
    let data = await fetchAllAds();
    if (data.length === 0) {
      return handleError(res, 400, "Empty ads", []);
    }
    data = await Promise.all(
      data.map(async (item) => {
        let fetchMedia = await fetch_adsMedia_by_id(item.id);
        item.adsMediaFiles = fetchMedia.length > 0 ? fetchMedia : [];
        return item;
      })
    );
    return handleSuccess(res, 200, "Ads found successfully", data);
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchSweepstacksUsersBysweepstacksId = async (req, res) => {
  try {
    let { sweepstacksId } = req.query;
    let data = await fetch_UsersBysweepstakesid(sweepstacksId);
    if (data.length === 0) {
      return handleError(res, 400, "This sweepstacks has no users", []);
    }
    let uniqueUsers = [];
    const seenIds = new Set();

    for (const user of data) {
      if (!seenIds.has(user.id)) {
        uniqueUsers.push(user);
        seenIds.add(user.id);
      }
    }
    uniqueUsers = await Promise.all(
      uniqueUsers.map(async (item) => {
        let userEntryPackeges = await fetchuserEntryPackeges(item.id);
        item.entryPackages = userEntryPackeges;
        return item;
      })
    );
    return handleSuccess(
      res,
      200,
      "Sweepstacks users found successfully",
      uniqueUsers
    );
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const sweepstacksWinners = async (req, res) => {
  try {
    let result = await sweepstacksWinnersModel(req.body);
    let winnerUsersDetails = await fetchUsersById(req.body.user_id);
    let userName = winnerUsersDetails[0].fullName;
    let sweepstackDetails = await fetchSweepstacksIds(req.body.sweepstack_id);
    let sweepstacksName = sweepstackDetails[0].sweepstakes_name;
    if (result.insertId) {
      let { sweepstack_id } = req.body;
      const currentDateTime = await getCurrentDateTime();
      await updateSweepstackEndDateModel(sweepstack_id, currentDateTime);

      let sendNotificationToAllUsers = await fetchAllUsers(req.body.user_id);
      sendNotificationToAllUsers.map(async (item) => {
        let usersfetchFcmToken = item.fcmToken;
        let followId = 0;
        let notificationType = NotificationTypes.SEND_ALL_NOTIFICATION_USERS;
        let notificationSend = "sweepstakesResultAnnounced";
        let id = 0;
        let fullName = userName;
        let postId = sweepstacksName;
        let userId = item.id;
        const sendNotificationToAlluser = await createNotificationMessage({
          notificationSend,
          fullName,
          id,
          userId,
          followId,
          usersfetchFcmToken,
          notificationType,
          postId,
        });
        await sendNotification(sendNotificationToAlluser);
      });

      return handleSuccess(res, 201, "Sweepstacks winner announced");
    } else {
      return handleError(res, 400, "Failed to add sweepstacks winner");
    }
  } catch (error) {
    console.error("Error in add_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchTotalRevenue = async (req, res) => {
  try {
    let data = await sumTotalRevenue();
    let sweepstackRevenueCount = await sumTotalSweepstacksAmount();
    let marketPlaceSellProducts = await marketPlaceSell();

    let revenueOutput = {
      total_revenue: data.length > 0 ? data[0].total_revenue : 0,
      sweepstackRevenueCount:
        sweepstackRevenueCount.length > 0
          ? sweepstackRevenueCount[0].sweepstacks_revenue
          : 0,
      total_market_place_sales: marketPlaceSellProducts.length,
    };
    return handleSuccess(res, 200, "Revenue found successfully", revenueOutput);
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const delete_ads = async (req, res) => {
  try {
    let { adsId } = req.body;
    let fetchMedia = await fetch_adsMedia_by_id(adsId);
    if (fetchMedia && fetchMedia.length > 0) {
      fetchMedia.map(async (item) => {
        await deleteFileFromS3(item.file);
      });
    }
    await delete_ads_data(adsId);
    return handleSuccess(res, 200, "Ads deleted successfully");
  } catch (error) {
    console.error("Error in delete_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const revenue_graph = async (req, res) => {
  try {
    const filter = req.query.filter || "weekly";
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    if (filter === "weekly") {
      const results = await weeklyFilterRevenue();
      const revenueMap = {};
      results.forEach((r) => {
        const label = dayjs(r.date).format("ddd");
        revenueMap[label] = r.totalRevenue;
      });

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const weeklyData = days.map((label) => ({
        label,
        totalRevenue: revenueMap[label] || "0",
      }));

      return handleSuccess(
        res,
        200,
        "Weekly revenue data fetched successfully",
        weeklyData
      );
    }

    if (filter === "monthly") {
      if (!year || !month)
        return handleError(
          res,
          400,
          "Year and month are required for monthly filter"
        );
      const results = await monthlyFilterRevenue(year, month);
      const revenueMap = {};
      results.forEach((r) => {
        const day = r.label.split(" ")[0];
        revenueMap[parseInt(day)] = r.totalRevenue;
      });
      const totalDays = dayjs(`${year}-${month}-01`).daysInMonth();
      const fullMonthData = [];
      for (let day = 1; day <= totalDays; day++) {
        const date = dayjs(`${year}-${month}-${day}`).format("DD");
        fullMonthData.push({
          label: date,
          totalRevenue: revenueMap[day] || "0",
        });
      }
      return handleSuccess(
        res,
        200,
        "Monthly revenue data fetched successfully",
        fullMonthData
      );
    }
    if (filter === "yearly") {
      if (!year)
        return handleError(res, 400, "Year is required for yearly filter");

      const results = await yearlyFilterRevenue(year);
      const monthMap = {};
      results.forEach((r) => (monthMap[r.label] = r.totalRevenue));
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const yearlyData = months.map((label) => ({
        label,
        totalRevenue: monthMap[label] || "0",
      }));
      return handleSuccess(
        res,
        200,
        "Yearly revenue data fetched successfully",
        yearlyData
      );
    }
    return handleError(res, 400, "Invalid filter provided");
  } catch (err) {
    console.error(err);
    return handleError(res, 500, err.message);
  }
};

export const fetchSweepstackResponse = async (req, res) => {
  try {
    let data = await fetch_all_sweepstakes();
    const now = new Date();
    data = data.map((item) => {
      const startDate = new Date(item.start_date);
      const endDate = new Date(item.end_date);
      let sweepstackStatus = "";
      if (now < startDate) {
        sweepstackStatus = "coming soon";
      } else if (now >= startDate && now <= endDate) {
        sweepstackStatus = "open";
      } else {
        sweepstackStatus = "completed";
      }
      return {
        ...item,
        status: sweepstackStatus,
      };
    });
    let totalOpenSweepstacks = data.filter(
      (item) => item.status === "open"
    ).length;
    let totalEnteries = await sumTotalEnteries();
    let sweepstackRevenueCount = await sumTotalSweepstacksAmount();
    let sweepstacksWinners = await sweepstacks_winners();
    let revenueOutput = {
      totalOpenSweepstacks,
      total_enteries:
        totalEnteries.length > 0 ? totalEnteries[0].Total_enteries : 0,
      sweepstackRevenueCount:
        sweepstackRevenueCount.length > 0
          ? sweepstackRevenueCount[0].sweepstacks_revenue
          : 0,
      winners_announced:
        sweepstacksWinners.length > 0
          ? sweepstacksWinners[0].winners_announced
          : 0,
    };
    return handleSuccess(res, 200, "Revenue found successfully", revenueOutput);
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const updateAdsData = async (req, res) => {
  try {
    let { id, tag, deleteFileId } = req.body;
    let adsData = { tag };
    let adsImg = [];
    let mediaFiles = req.files.file;
    const result = await updateAdsInfo(adsData, id);
    deleteFileId = deleteFileId ? JSON.parse(deleteFileId) : [];
    if (deleteFileId.length > 0) {
      await Promise.all(
        deleteFileId.map(async (item) => {
          let data = await fetchAdsMediaById(item);
          let mediaUrl = data[0].file;
          let mediaId = data[0].id;
          await deleteFileFromS3(mediaUrl);
          await delete_adsMediaByIds(mediaId);
        })
      );
    }
    if (mediaFiles && mediaFiles.length > 0) {
      adsImg = mediaFiles.map((file) => {
        const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
        return getPublicUrl(safeKey);
      });
    }
    if (adsImg.length > 0) {
      adsImg.map(async (item) => {
        let type;
        const extension = item.split(".").pop().toLowerCase();
        if (
          ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(
            extension
          )
        ) {
          type = "image";
        } else {
          type = "video";
        }
        let obj = {
          ads_id: id,
          media: type,
          videoThumbnail: null,
          file: item,
        };
        await insertAdsMediaModel(obj);
      });
    }
    if (result.affectedRows > 0) {
      return handleSuccess(res, 200, "Ads Update Successfully", result);
    }
    return handleError(res, 400, "Failed To Update Ads", []);
  } catch (err) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const update_orderStatus = async (req, res) => {
  try {
    let { id, delivery_status } = req.body;
    let obj = { delivery_status: delivery_status };
    const result = await updateOrdersData(obj, id);
    if (result.affectedRows > 0) {
      return handleSuccess(
        res,
        200,
        "Delivery status updated successfully",
        result
      );
    }
    return handleError(res, 400, "Failed To Update Delivery status", []);
  } catch (err) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchContentMangmentByType = async (req, res) => {
  try {
    let { content_type } = req.query;
    let data = await fetchTermsAndConditionsModel(content_type);
    if (data.length === 0) {
      return handleError(res, 400, "No content found ", []);
    }
    return handleSuccess(res, 200, "Content found successfully", data[0]);
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const updateContentManagmentsBythereType = async (req, res) => {
  try {
    let { content_description, content_type } = req.body;
    if (!content_type) {
      return handleError(res, 400, "content_type Must be required ", []);
    }
    let fetchContent = await fetchTermsAndConditionsModel(content_type);
    if (fetchContent.length === 0) {
      return handleError(res, 400, "No content found ", []);
    }
    let obj = {
      content_description: content_description,
    };
    let data = await updateContentManagments(obj, content_type);
    if (data.affectedRows === 0) {
      return handleError(res, 400, "failed to update content managments", []);
    }
    return handleSuccess(res, 200, "Update successfully", data[0]);
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

// Seller Payout
// export const getAllSellerToPayList = async (req, res) => {
//   try {
//     const admin = req.admin;
//     const getSellerList = await getAllListOfSeller();
//     const admin_commission = parseFloat(admin?.admin_commission ?? 0);
//     await Promise.all(
//       getSellerList.map(async (items) => {
//         const getPreviousPaidToSeller = await getLastPayoutDataModel(items?.id);
//         const dashboardData = await getProductOrderDataModel(items?.id);
//         let val = 0;
//         for (const item of dashboardData) {
//           const price_order = parseFloat(item?.price_at_order ?? 0);
//           const quantity = parseFloat(item?.quantity ?? 0);
//           const delivery_charge = parseFloat(item?.delivery_charge ?? 0);
//           if ([price_order, quantity, delivery_charge].some(isNaN)) {
//             console.warn("Invalid order data for seller:", items.id, item);
//             continue;
//           }
//           val += price_order * quantity + delivery_charge;
//         }
//         const prevPaid =
//           parseFloat(getPreviousPaidToSeller?.[0]?.total_amount) || 0;
//         const total_payout = val - prevPaid;
//         const commission_cut = (total_payout * admin_commission) / 100;
//         const amountToSeller = total_payout - commission_cut;
//         items.amount = Math.round(amountToSeller * 100) / 100;
//         items.commission = Math.round(commission_cut * 100) / 100;
//       })
//     );
//     const filteredSellers = getSellerList.filter((seller) => seller.amount > 0);
//     return handleSuccess(res, 200, Msg.dataFoundSuccessful, filteredSellers);
//   } catch (error) {
//     return handleError(res, 500, error.message);
//   }
// };

// export const getAllSellerPayoutList = async (req, res) => {
//   try {
//     const getAllPayoutList = await getAllSellerPayoutListModel();
//     const walletData = await getAdminWallet();
//     console.log({ walletData: walletData?.length });

//     // Calculate wallet total
//     let val2 = 0;
//     for (const item of walletData) {
//       const price_order = parseFloat(item?.price_at_order ?? 0);
//       const quantity = parseFloat(item?.quantity ?? 0);
//       const delivery_charge = parseFloat(item?.delivery_charge ?? 0);
//       val2 += price_order * quantity + delivery_charge;
//     }
//     console.log({ val2: val2 });
//     // Calculate total payouts safely
//     const totalPayoutAmount = getAllPayoutList.reduce((sum, item) => {
//       return sum + parseFloat(item?.amount ?? 0);
//     }, 0);
//     console.log({ totalPayoutAmount: totalPayoutAmount });

//     // Attach seller data
//     await Promise.all(
//       getAllPayoutList.map(async (item) => {
//         const sellerData = await get_seller_data_by_id(item?.seller_id);
//         item.businessName = sellerData[0]?.businessName;
//         item.bussinesslogo = sellerData[0]?.bussinesslogo;
//       })
//     );

//     const admin_wallet = val2 - totalPayoutAmount;
//     console.log(admin_wallet);

//     const data12 = {
//       getAllPayoutList,
//       admin_wallet: parseFloat(admin_wallet.toFixed(2)),
//     };

//     return handleSuccess(res, 200, Msg.dataFoundSuccessful, data12);
//   } catch (error) {
//     console.log("Error:", error);
//     return handleError(res, 500, error.message);
//   }
// };

// export const payPaymentToSeller = async (req, res) => {
//   try {
//     const adminReq = req.admin;
//     const { seller_id, amount, commission_amount } = req.body;
//     let isSellerHasAccount = await isSellerAccountCreatedOrNot(seller_id);
//     let adminData = await get_admin_data_by_id(adminReq.id);
//     let sellerData = await get_seller_data_by_id(seller_id);
//     let user_id = sellerData[0]?.userId;
//     let fetchUser = await fetchUserById(user_id);
//     let account_id = isSellerHasAccount[0].account_id;
//     const account = await stripe.accounts.retrieve(account_id);
//     if (!account.charges_enabled || !account.payouts_enabled) {
//       return handleSuccess(
//         res,
//         400,
//         "Seller account is not eligible for payouts."
//       );
//     }
//     const payoutAmount = Math.round(Number(amount));
//     const amountNumber = parseFloat(amount ?? 0);
//     const commissionNumber = parseFloat(commission_amount ?? 0);
//     const total_payout = parseFloat(
//       (amountNumber + commissionNumber).toFixed(2)
//     );
//     const transfer = await stripe.transfers.create({
//       amount: payoutAmount,
//       currency: "usd",
//       destination: account_id,
//       description: `Admin payout to seller ${account_id}`,
//       metadata: {
//         user_id: user_id,
//         fcmToken: fetchUser[0]?.fcmToken,
//         seller_id: seller_id.toString(),
//         amount: payoutAmount,
//         total_payout: total_payout.toString(),
//         adminId: adminReq.id.toString(),
//         admin_commission: commissionNumber,
//       },
//     });
//     return handleSuccess(res, 200, "Amount transferred successfully", transfer);
//   } catch (error) {
//     console.log("Error:", error);
//     return handleError(res, 500, error.message);
//   }
// };

export const audio_add = async (req, res) => {
  try {
    let mediaFiles = req?.files?.audio;
    if (mediaFiles && mediaFiles.length > 0) {
      await Promise.all(
        mediaFiles.map(async (item) => {
          let obj = {
            songName: req.body.songName,
            artist: req.body.artist,
            audio: getPublicUrl(req.files.audio[0].key),
          };
          await insertAudioModel(obj);
        })
      );
      return handleSuccess(res, 201, "Audio added successfully");
    }
    return handleSuccess(res, 400, "Failed to add audio");
  } catch (error) {
    console.error("Error in audio_add:", error);
    return handleError(res, 500, error.message);
  }
};

export const updateAudio = async (req, res) => {
  try {
    let { id } = req.params;
    let fetchAllAudio = await fetchAllAudioByIdModel(id);
    if (fetchAllAudio.length == 0) {
      return handleError(
        res,
        400,
        "Oops! This audio isn’t available right now."
      );
    }
    let audio = fetchAllAudio[0].audio;
    if (req.files) {
      if (req.files.audio && fetchAllAudio[0].audio) {
        await deleteFileFromS3(fetchAllAudio[0].audio);
      }
      audio = req.files.audio
        ? getPublicUrl(req.files.audio[0].key)
        : fetchAllAudio[0].audio;
    }
    req.body.audio = audio;
    const result = await editAudioByIdModel(req.body, id);
    if (result.affectedRows) {
      return handleSuccess(res, 200, "Nice! Audio has been updated.", result);
    }
    return handleError(
      res,
      400,
      "Oops! Something went wrong while updating the audio."
    );
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchAllAudio = async (req, res) => {
  try {
    let fetchAllAudio = await fetchAllAudioModel();
    if (fetchAllAudio.length === 0) {
      return handleError(res, 400, "Oops! Audio not available right now.", []);
    }
    return handleSuccess(res, 200, "Audio found successfully.", fetchAllAudio);
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const delete_audio = async (req, res) => {
  try {
    let { id } = req.body;
    let fetchAllAudio = await fetchAllAudioByIdModel(id);
    if (fetchAllAudio && fetchAllAudio.length > 0) {
      fetchAllAudio.map(async (item) => {
        await deleteFileFromS3(item.audio);
      });
    }
    await deleteAudioModel(id);
    return handleSuccess(res, 200, "Audio deleted successfully");
  } catch (error) {
    console.error("Error in delete_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const updateAdminCommission = async (req, res) => {
  try {
    const admin = req.admin;
    const { admin_commission } = req.body;
    const data = {
      admin_commission,
    };
    const update_commission = await updateAdminCommissionModel(data, admin?.id);
    if (update_commission?.affectedRows > 0) {
      return handleSuccess(
        res,
        StatusCode.status200,
        Msg.ADMIN_COMMISSION_UPDATED_SUCCESSFULLY
      );
    } else {
      return handleSuccess(
        res,
        StatusCode.status200,
        Msg.ADMIN_COMMISSION_UPDATED_ERROR
      );
    }
  } catch (error) {
    console.log("Error :", error);
    return handleError(res, 500, error.message);
  }
};

export const get_boosted_product_data = async (req, res) => {
  try {
    let all_product = await get_boosted_all_product_data();
    if (!all_product || all_product.length === 0) {
      return handleSuccess(res, 200, Msg.PRODUCT_RETRIVED, []);
    }

    const mergedProducts = all_product.reduce((acc, product) => {
      // const existingProduct = acc.find(item => item.pId === product.pId);

      let product_images = [];

      if (
        typeof product.productImages === "string" &&
        product.productImages.trim() !== ""
      ) {
        const trimmedImages = product.productImages.trim();

        if (trimmedImages.startsWith("[") || trimmedImages.startsWith("{")) {
          try {
            const parsedImages = JSON.parse(trimmedImages);
            if (Array.isArray(parsedImages)) {
              product_images = parsedImages;
            } else if (typeof parsedImages === "string") {
              product_images = [parsedImages];
            } else {
              console.warn("Unexpected format in productImages:", parsedImages);
            }
          } catch (err) {
            console.error("Error parsing productImages:", trimmedImages);
            product_images = [trimmedImages];
          }
        } else {
          product_images = [trimmedImages];
        }
      }

      product_images = product_images.map((product_image) => {
        return product_image && !product_image.startsWith("http")
          ? `${APP_URL}${product_image}`
          : product_image;
      });

      // if (existingProduct) {
      //     existingProduct.productImages = [...existingProduct.productImages, ...product_images];
      // } else {
      acc.push({
        ...product,
        // total_seles: 1000,
        productImages: product_images,
      });
      // }

      return acc;
    }, []);

    const data = await Promise.all(
      mergedProducts.map(async (item) => {
        const boostViewCount = await get_boosted_view_count(
          item.boosted_product_id
        );
        item.boostViewCount = boostViewCount[0].viewCount;
        let [total_sales] = await productTotalSales(
          item.pId,
          item.start_date,
          item.end_date
        );
        item.total_sales = total_sales.total_sales;
        return item;
      })
    );

    return handleSuccess(res, 200, Msg.Boost_PRODUCT_RETRIVED, mergedProducts);
  } catch (error) {
    console.error("Error in get_product_data:", error);
    return handleError(res, 500, "Internal Server Error");
  }
};

export const get_boosted_post_data = async (req, res) => {
  try {
    let all_post = await get_boosted_all_post_data();
    if (!all_post || all_post.length === 0) {
      return handleSuccess(res, 200, Msg.Boosted_Product_Retrived, []);
    }

    const data = await Promise.all(
      all_post.map(async (item) => {
        item.imageUrl = item.imageUrl != null ? JSON.parse(item.imageUrl) : [];
        item.hasTags = item.hasTags != null ? JSON.parse(item.hasTags) : [];
        let views = await postViewsOnBoost(
          item.id,
          item.start_date,
          item.end_date
        );
        item.total_views = views[0].total_views;
      })
    );

    return handleSuccess(res, 200, Msg.Boosted_Product_Retrived, all_post);
  } catch (error) {
    console.error("Error in get_product_data:", error);
    return handleError(res, 500, "Internal Server Error");
  }
};

export const fetchPostPromotionalPackage = async (req, res) => {
  try {
    let fetchPostPromotionPackages = await fetchPostPromotionalPackages();
    if (fetchPostPromotionPackages.length > 0) {
      return handleSuccess(
        res,
        200,
        Msg.dataFoundSuccessful,
        fetchPostPromotionPackages
      );
    } else {
      return handleError(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchProductPromotionalPackage = async (req, res) => {
  try {
    let fetchPostPromotionPackages = await fetchProductPromotionalPackages();
    if (fetchPostPromotionPackages.length > 0) {
      return handleSuccess(
        res,
        200,
        Msg.dataFoundSuccessful,
        fetchPostPromotionPackages
      );
    } else {
      return handleError(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const updatePostPromotionalPackage = async (req, res) => {
  try {
    const admin = req.admin;
    const { reach, price, duration_days, id } = req.body;
    const data = {
      reach,
      price,
      duration_days,
    };
    if (!id || !price || !duration_days) {
      return handleError(res, 400, Msg.idPriceDurationIsRequire);
    }
    const update_commission = await updatePostPromotionalPackages(data, id);
    if (update_commission?.affectedRows > 0) {
      return handleSuccess(
        res,
        StatusCode.status200,
        Msg.Boost_Promotional_post_Package_Update
      );
    } else {
      return handleSuccess(
        res,
        StatusCode.status200,
        Msg.Boost_Promotional_post_Package_Update_Error
      );
    }
  } catch (error) {
    console.log("Error :", error);
    return handleError(res, 500, error.message);
  }
};

export const updateProductPromotionalPackage = async (req, res) => {
  try {
    const admin = req.admin;
    const { reach, price, duration_days, id } = req.body;
    const data = {
      reach,
      price,
      duration_days,
    };
    if (!id || !price || !duration_days) {
      return handleError(res, 400, Msg.idPriceDurationIsRequire);
    }
    const update_commission = await updateProductPromotionalPackages(data, id);
    if (update_commission?.affectedRows > 0) {
      return handleSuccess(
        res,
        StatusCode.status200,
        Msg.Boost_Promotional_product_Package_Update
      );
    } else {
      return handleSuccess(
        res,
        StatusCode.status200,
        Msg.Boost_Promotional_product_Package_Update_Error
      );
    }
  } catch (error) {
    console.log("Error :", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchLiveStreamData = async (req, res) => {
  try {
    let liveStream = await fetchLiveStream();
    if (liveStream.length > 0) {
      const data = await Promise.all(
        liveStream.map(async (item) => {
          item.participants = await getLiveStreamViews(item.live_id);
        })
      );

      return handleSuccess(res, 200, Msg.dataFoundSuccessful, liveStream);
    } else {
      return handleError(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchUserWalletData = async (req, res) => {
  try {
    let user = await get_all_user_data();
    if (user.length > 0) {
      const data = await Promise.all(
        user.map(async (item) => {
          item.wallet_history = await fetchWalletHistoryByIds(item.id);
          [item.wallet_balance] = await fetchWalletBalanceByIds(item.id);
        })
      );

      return handleSuccess(res, 200, Msg.dataFoundSuccessful, user);
    } else {
      return handleError(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchAllUsersContactSupport = async (req, res) => {
  try {
    let user = await fetchAllContactSupports();
    if (user.length > 0) {
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, user);
    } else {
      return handleSuccess(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const termsAndConditions = async (req, res) => {
  try {
    let user = await fetchTermsAndConditions();
    if (user.length > 0) {
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, user[0]);
    } else {
      return handleSuccess(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const privacy_policy = async (req, res) => {
  try {
    let user = await fetchPrivacyPolicy();
    if (user.length > 0) {
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, user[0]);
    } else {
      return handleSuccess(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// Assuming you have Express and MySQL connection setup as `db`

export const user_transactions = async (req, res) => {
  try {
    const userId = req.query.user_id;
    let transactions = await fetchUserTranctionByThereId(userId);
    if (transactions.length == 0) {
      return handleError(res, 400, "This user has no transaction history", []);
    }
    let userDetails = await fetchUserById(userId);
    const totals = await fetchCreditAndDebitOfParticularUsers(userId);
    let data = [userDetails[0], transactions, totals];
    return handleSuccess(res, 200, "Transaction data found", data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

export const fetchAllUserTransactions = async (req, res) => {
  try {
    let transactions = await fetchAllUserTranctionHistory();
    if (transactions.length == 0) {
      return handleError(res, 400, "No transaction history", []);
    }
    console.log("transactions", transactions);

    const data = await Promise.all(
      transactions.map(async (item) => {
        let userDetails = await fetchUserById(item.user_id);
        console.log("userDetails", userDetails);
        item.email = userDetails[0].email;
        item.fullName = userDetails[0].user_name;
        item.profileImage = userDetails[0].profileImage;
        return item;
      })
    );
    return handleSuccess(res, 200, "Transaction data found", data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// -------------------------user apply to become a investor-------------------------------------//
export const fetchUserApplyToBecomeInvestor = async (req, res) => {
  try {
    let user = await fetchUserApplyToBecomeInvestorModel();
    if (user.length > 0) {
      const data = await Promise.all(
        user.map(async (item) => {
          item.documents = await fetchUserApplyToBecomeInvestorMediaModel(
            item.id
          );
          return item;
        })
      );
      return handleSuccess(
        res,
        200,
        Msg.APPLY_TO_BECOME_INVESTOR_RETRIVED,
        data
      );
    } else {
      return handleError(
        res,
        400,
        Msg.APPLY_TO_BECOME_INVESTOR_RETRIVED_FAILED,
        []
      );
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const createRanch = async (req, res) => {
  try {
    let ranchesMedia = [];
    let mediaFiles = req.files.file;
    let ranchesDocuments = req.files.ranchesDocuments;

    if (mediaFiles.length > 0) {
      ranchesMedia = mediaFiles.map((file) => {
        const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
        return getPublicUrl(safeKey);
      });
    }
    req.body.remainingShares = req.body.total_shares
    let data = {
      name: req.body.name,
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      price_per_share: req.body.price_per_share,
      total_shares: req.body.total_shares,
      acres: req.body.acres,
      description: req.body.description,
      projected_roi_percent: req.body.projected_roi_percent,
      amenities: req.body.amenities,
      remainingShares: req.body.remainingShares,
    }

    let result = await createRanchModel(data);
    if (result.insertId) {
      if (ranchesDocuments?.length > 0) {
        ranchesDocuments = ranchesDocuments.map(async (file) => {
          let obj = {
            ranch_id: result.insertId,
            documents: file.location,
          };
          await insertRanchesDocuments(obj);
        });
      }

      ranchesMedia.map(async (item) => {
        let obj = {
          ranch_id: result.insertId,
          url: item,
        };
        await insertRanchesMediaModel(obj);
      });

      let blackoutDates = req.body.blackout_dates;
      if (blackoutDates && blackoutDates.length > 0) {
        await Promise.all(blackoutDates.map(async (item) => {
          let obj = {
            ranch_id: result.insertId,
            blackout_date: item,
            reason: item.reason || null
          }
          await insertRanchBlackoutDays(obj);
        }))
      }
    }
    return handleSuccess(res, 200, Msg.RANCH_CREATED);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

// export const createRanch = async (req, res) => {
//   try {
//     let ranchesMedia = [];
//     let mediaFiles = req.files.file;
//     let ranchesDocuments = req.files.ranchesDocuments;

//     if (mediaFiles.length > 0) {
//       ranchesMedia = mediaFiles.map((file) => {
//         const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
//         return getPublicUrl(safeKey);
//       });
//     }
//     req.body.remainingShares = req.body.total_shares
//     let result = await createRanchModel(req.body);
//     if (result.insertId) {

//       // ---------------inset blackout days--------------------------//

//       if (req.body.blackout_days) {
//         let blackoutDays = JSON.parse(req.body.blackout_days);
//         for (let blackout of blackoutDays) {
//           let blackoutObj = {
//             ranch_id: result.insertId,
//             blackout_date: blackout.date,
//             reason: blackout.reason
//           };
//           await insertRanchBlackoutDays(blackoutObj);
//         }
//       }
//       // ---------------------------end-----------------------------//

//       if (ranchesDocuments?.length > 0) {
//         ranchesDocuments = ranchesDocuments.map(async (file) => {
//           let obj = {
//             ranch_id: result.insertId,
//             documents: file.location,
//           };
//           await insertRanchesDocuments(obj);
//         });
//       }

//       ranchesMedia.map(async (item) => {
//         let obj = {
//           ranch_id: result.insertId,
//           url: item,
//         };
//         await insertRanchesMediaModel(obj);
//       });
//     }
//     return handleSuccess(res, 200, Msg.RANCH_CREATED);
//   } catch (error) {
//     return handleError(res, 500, Msg.internalServerError);
//   }
// };

export const fetchRanch = async (req, res) => {
  try {
    let ranch = await fetchRanchesModel();
    const data = await Promise.all(
      ranch.map(async (item) => {
        if (item.amenities) {
          item.amenities = item.amenities
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((v) => v.trim());
        }
        item.images = await fetchRanchesMediaModel(item.id);
        item.ranchesDocuments = await fetchRanchesDocumentsModel(item.id);
        let data = await fetchTotalSharesSold(item.id)
        item.remainingShares =
          data[0]?.total_shares_purchased == null || data[0].total_shares_purchased == 0
            ? item.total_shares
            : item.total_shares - data[0].total_shares_purchased;

        item.shares_sold = data[0].total_shares_purchased;
        item.blackout_days = await fetchRanchesBlackoutDaysModel(item.id);

        return item;
      })
    );
    return handleSuccess(res, 200, Msg.RANCH_MEDIA_RETRIVED, data);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchRanchByIds = async (req, res) => {
  try {
    let { ranch_id } = req.query;
    let ranch = await fetchRanchesByIdModel(ranch_id);
    const data = await Promise.all(
      ranch.map(async (item) => {
        item.remaining = item.total_shares - item.shares_sold;
        item.images = await fetchRanchesMediaModel(item.id);
        item.ranchesDocuments = await fetchRanchesDocumentsModel(item.id);
        return item;
      })
    );

    // ------------------fetch blackout dates--------------------------------------//

    let rows = await fetchRanchBlackoutDays(ranch_id);
    let blackout_date = [];
    if (rows.length > 0) {
      blackout_date = rows.map(r => ({
        id: r.id,
        date: r.blackout_date
      }));
    }
    data[0].blackout_date = blackout_date.length > 0 ? blackout_date : [];

    return handleSuccess(res, 200, Msg.RANCH_MEDIA_RETRIVED, data[0]);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const ranchesOwnershipDashboard = async (req, res) => {
  try {
    let ranch = await fetchRanchesModel();
    let ranchesOwnershipDashboard = await fetchPurchasesRanchesModel()
    let data = {
      total_ranches: ranch.length,
      share_sold: 0,
      total_revenue: ranchesOwnershipDashboard[0].total_revenue,
      total_invester: ranchesOwnershipDashboard[0].total_investors,
    };
    return handleSuccess(res, 200, Msg.RANCH_OWNERSHIP_DASHBOARD, data);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const ranchesStatusChanges = async (req, res) => {
  try {
    let { status, ranch_id } = req.body;
    let messageStatus = status;
    let result = await updateRanchesStatus(status, ranch_id);
    if (result.affectedRows > 0) {
      return handleSuccess(
        res,
        200,
        `Ranch has been ${messageStatus} successfully.`
      );
    } else {
      return handleError(res, 400, `No ranch found with ID ${ranch_id}.`);
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

const toArray = (value) => {
  if (!value) return [];
  // Already array → return as is
  if (Array.isArray(value)) return value;

  // If value is JSON string array → parse it
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) { }

  // Otherwise convert single value → array
  return [value];
};

export const updateRanch = async (req, res) => {
  try {
    let { id, ...body } = req.body;
    if (!id) {
      return handleError(res, 400, "Ranch Id must be require");
    }
    let ranchesImagesDelete = req?.body?.ranchesImagesDelete ? JSON.parse(req?.body?.ranchesImagesDelete) : [];
    let ranchesDocumentsDelete = req?.body?.ranchesDocDelete ? JSON.parse(req?.body?.ranchesDocDelete) : [];
    if (ranchesImagesDelete.length > 0) {
      ranchesImagesDelete.map(async (item) => {
        await hardDeleteRanchesImagesId(item);
      });
    }
    if (ranchesDocumentsDelete.length > 0) {
      ranchesDocumentsDelete.map(async (item) => {
        await hardDeleteRanchesDocumentsId(item);
      });
    }

    let ranchDocs = await fetchRanchesByIdModel(id);
    let ranchesImages = [];
    let ranchesDocuments = req.files.ranchesDocuments;
    const ranchesUpdateFields = Object.keys(body)
      .filter(
        key =>
          !['ranchesImagesDelete', 'ranchesDocsDelete', 'ranchesDocDelete', 'blackout_dates', 'remove_blackout_days']
            .includes(key.trim())
      )
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {});

    const result = await updateRanchesModel(ranchesUpdateFields, id);
    if (req.files && req.files.file && req.files.file.length > 0) {
      let mediaFiles = req.files.file;
      ranchesImages = mediaFiles.map((file) => {
        const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
        return getPublicUrl(safeKey);
      });

      ranchesImages.map(async (item) => {
        let obj = {
          ranch_id: id,
          url: item,
        };
        await insertRanchesMediaModel(obj);
      });
    }
    if (req.files && req.files.ranchesDocuments && req.files.ranchesDocuments.length > 0) {
      let mediaFiles = req.files.ranchesDocuments;
      ranchesDocuments = mediaFiles.map((file) => {
        const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
        return getPublicUrl(safeKey);
      });

      ranchesDocuments.map(async (file) => {
        let obj = {
          ranch_id: id,
          documents: file,
        };
        await insertRanchesDocuments(obj);
      });
    }


    // -------------------------------update ranches blackdates----------------------//

    const removeBlackoutDays = toArray(req.body.remove_blackout_days);
    const blackoutDates = toArray(req.body.blackout_dates || req.body.blackout_date);
    if (removeBlackoutDays.length > 0) {
      await Promise.all(removeBlackoutDays.map(async (item) => {
        await deleteRanchBlackoutDays(item);
      }));
    }
    if (blackoutDates.length > 0) {
      await Promise.all(blackoutDates.map(async (item) => {
        await insertRanchBlackoutDays({ ranch_id: id, blackout_date: item });
      }));
    }


    return handleSuccess(res, 200, Msg.RANCH_UPDATED);
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const deleteImagesRanchesById = async (req, res) => {
  try {
    let { ranch_id } = req.body;
    if (!ranch_id) {
      return handleError(res, 400, "Ranch id must be require");
    }
    await hardDeleteRanchesMedia(ranch_id);
    return handleSuccess(res, 200, "Ranches  image deleted successfully");
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const getGeoLocation = async (req, res) => {
  try {
    const { location } = req.query;
    const apiKey = "AIzaSyCFv1JZ8BGppw-ZyncurrbMpResLu5J2_c";

    if (!location) {
      return res
        .status(400)
        .json({ success: false, message: "Location is required" });
    }
    const autoCompleteRes = await axios.post(
      `https://places.googleapis.com/v1/places:autocomplete`,
      { input: location },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
      }
    );

    if (
      !autoCompleteRes.data.suggestions ||
      autoCompleteRes.data.suggestions.length === 0
    ) {
      return res
        .status(404)
        .json({ success: false, message: "No suggestions found" });
    }
    const suggestions = await Promise.all(
      autoCompleteRes.data.suggestions.map(async (s) => {
        const placeId = s.placePrediction.placeId;

        const detailsRes = await axios.get(
          `https://places.googleapis.com/v1/places/${placeId}`,
          {
            params: { key: apiKey },
            headers: {
              "X-Goog-FieldMask":
                "id,displayName,formattedAddress,location,addressComponents",
            },
          }
        );

        const place = detailsRes.data;

        return {
          name: place.displayName?.text,
          formatted: place.formattedAddress,
          latitude: place.location?.latitude,
          longitude: place.location?.longitude,
          components: place.addressComponents,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const fetchInvesterByIds = async (req, res) => {
  try {
    let { insvester_id } = req.query;
    let ranch = await fetchRanchesByIdModel(ranch_id);
    const data = await Promise.all(
      ranch.map(async (item) => {
        if (item.amenities) {
          item.amenities = item.amenities
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((v) => v.trim());
        }
        item.remaining = item.total_shares - item.shares_sold;
        item.images = await fetchRanchesMediaModel(item.id);
        return item;
      })
    );
    return handleSuccess(res, 200, Msg.RANCH_MEDIA_RETRIVED, data[0]);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchInvesterFormByUserId = async (req, res) => {
  try {
    let { id } = req.query;

    let rows = await fetchInvesterFormModel(id);
    let media = await fetchInvesterMediaModel(id);
    if (!rows || rows.length === 0) {
      let data = {};
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No investor form found",
        data,
      });
    }

    rows[0].documents = media.length > 0 ? media[0].documents : null;

    return handleSuccess(res, 200, Msg.INVESTER_APPLICATION_UPDATED, rows[0]);
  } catch (error) {
    console.error("fetchInvesterForm error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const deletedRanchesById = async (req, res) => {
  try {
    let { ranch_id } = req.body;
    if (!ranch_id) {
      return handleError(res, 400, "Ranch id must be require");
    }
    await softRanchesDeleted(ranch_id);
    await deleteRanchesMediaById(ranch_id);
    await deleteRanchesMediaById(ranch_id);
    return handleSuccess(res, 200, "Ranches deleted successfully");
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// -------------------------------------------Developer rohan gupta--------------------------------------//

export const fetchAllUserInvesterApplication = async (req, res) => {
  try {
    let rows = await getAllInvestorApplications();
    return handleSuccess(res, 200, Msg.INVESTER_APPLICATION_UPDATED, rows);
  } catch (error) {
    console.error("fetchInvesterForm error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchApplicationByIds = async (req, res) => {
  try {
    const { id } = req.query;
    const rows = await getInvestorApplicationsById(id);

    const prettyName = (fileType = "") =>
      fileType
        .split("_")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const parsedRows = rows.map(item => {
      let docs = [];

      if (item.documents) {
        try {
          if (typeof item.documents === "string") {
            // parse only if it's a string
            docs = JSON.parse(item.documents);
          } else if (Array.isArray(item.documents)) {
            // already JSON array
            docs = item.documents;
          } else {
            // fallback in case it's something else
            docs = [];
          }
        } catch (err) {
          console.error("Bad JSON in documents:", err.message);
          docs = [];
        }
      }

      // enrich with fileName
      docs = docs.map(d => ({
        ...d,
        fileName: d.fileType ? prettyName(d.fileType) : ""
      }));

      return { ...item, documents: docs };
    });

    const result = parsedRows[0] || {};

    return handleSuccess(res, 200, Msg.INVESTER_APPLICATION_UPDATED, result);
  } catch (error) {
    console.error("fetchApplicationByIds error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const approveRejectUserApplyToBecomeInvestor = async (req, res) => {
  try {
    const { id, status } = req.body;
    const application = await fetchUserApplyToBecomeInvestorModel(id);
    if (!application)
      return handleError(res, 404, "Investor application not found");
    if (status == 1) {
      await approveUserApplyToBecomeInvestorModel(id);
    } else {
      await rejectUserApplyToBecomeInvestorModel(id);
    }
    const userData = await fetchUsersById(id);
    if (!userData?.[0]) return handleError(res, 404, "User not found");

    const { email, fullName, fcmToken = "", id: userId } = userData[0];
    const notificationType =
      status === 1
        ? NotificationTypes.APPLY_TO_BECOME_INVESTOR_APPROVED_NOTIFICATION
        : NotificationTypes.APPLY_TO_BECOME_INVESTOR_REJECTED_NOTIFICATION;

    const notificationSend =
      status === 1
        ? "applyToBecomeInvestorApproved"
        : "applyToBecomeInvestorRejected";

    const message = await createNotificationMessage({
      notificationSend,
      fullName,
      id,
      userId,
      followId: null,
      usersfetchFcmToken: fcmToken,
      notificationType,
      postId: null,
    });
    await sendNotification(message, null);

    return handleSuccess(res, 200, status === 1 ? "Investor application approved successfully" : "Investor application rejected successfully"
    );
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};


// ------------------------------fetch all purchases ranches ---------------------------//

export const fetchInvesterOwnerships = async (req, res) => {
  try {
    let rows = await modelFetchPurchasesRanches();
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No invested ranches found",
        data: rows,
      });
    }
    let data = await Promise.all(
      rows.map(async (item) => {
        console.log('item', item);
        if (item.amenities) {
          item.amenities = item.amenities
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((v) => v.trim());
        }
        let investerDetails = await fetchInvesterByThereIds(item.investor_id);
        console.log('investerDetails', investerDetails);
        item.images = await fetchRanchImagesByRanchId(item.ranch_id);
        item.ranchesDocuments = await fetchRanchDocumentsByRanchId(item.ranch_id);;
        let userDeatils = await fetchUsersById(investerDetails[0].user_id);
        item.userFullName = userDeatils.length > 0 ? userDeatils[0].fullName : null;
        item.remaining = item.total_shares - item.shares_sold;
        item.shares_sold = item.total_shares - parseFloat(item.remainingShares || 0);
        item.id = item.modelFetchPurchasesRanches
        return item;
      })
    )
    return handleSuccess(res, 200, "Ranch purchases retrieved successfully", data)
  } catch (error) {
    console.error("fetchInvesterOwnerships error:", error);
    return handleError(res, 500, error);
  }
};

// ------------------------------approve or reject ranch purchase----------------------------------//

export const approveAndReleaseFunds = async (req, res) => {
  try {
    const { purchaseId } = req.body;
    const [purchase] = await fetchInvesterAndUsersDetailByPurchaseRanchesId(purchaseId);
    await finallyApprovedInvesterRanches(purchaseId)
    const projectRoot = path.resolve(__dirname, "../");
    const emailTemplatePath = path.join(projectRoot, "views", "approvalSendMailToTitleCompany.hbs");
    const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
    const template = handlebars.compile(templateSource);
    let remaining = purchase.remainingShares - purchase.shares_purchased;
    await updateTotalShares(remaining, purchase.ranch_id);
    const context = {
      investorName: `${purchase.fullName} `,
      investorEmail: purchase.email,
      ranchName: purchase.name,
      purchaseId: purchase.id,
      amount: purchase.total_amount,
      referenceId: purchase.escrow_reference_id,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }),
      year: new Date().getFullYear()
    };

    const emailHtml = template(context);
    const emailOptions = {
      to: purchase.email,
      subject: `🚀 ACTION REQUIRED: Release Funds - ${context.referenceId} - ${context.amount}`,
      html: emailHtml,
    };
    await sendEmail(emailOptions);
    await generateCertificateAndSendEmail(purchase, purchaseId)

    // ----------------------send push notification to investor ranches approval--------------------------------//
    let usersFcmToken = purchase.user_fcmToken;
    let investorFcmToken = purchase.investor_fcmToken;
    let notificationType = NotificationTypes.APPROVAL_INVESTOR_RANCHES_OWNERSHIP;
    let followId = purchaseId;
    let notificationSend = "approvalInvestorRanchesOwnership";
    let postId = purchaseId;
    let fcmTokens = [];
    if (usersFcmToken) fcmTokens.push(usersFcmToken);
    if (investorFcmToken) fcmTokens.push(investorFcmToken);
    let fullName = purchase.name
    let id = purchase.investor_id
    let userId = purchase.user_id
    await Promise.all(fcmTokens.map(async (usersfetchFcmToken) => {
      let message = await createNotificationMessage({ notificationSend, fullName, id, userId, followId, usersfetchFcmToken, notificationType, postId });
      message.data.investorId = String(purchase.investor_id);
      await sendNotification(message, postId);
    }))

    return res.json({
      success: true,
      message: "Funds released to ranch owner successfully!",
      purchase_id: purchaseId,
      amount: purchase.balance_amount,
      escrow_transaction_id: purchase.escrow_transaction_id,
    });

  } catch (error) {
    console.error('❌ Fund release error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const rejectAndRefundFunds = async (req, res) => {
  try {
    const { purchaseId, rejectionReason } = req.body;
    const [purchase] = await fetchInvesterAndUsersDetailByPurchaseRanchesId(purchaseId);
    await finallyRejectInvesterRanches(purchaseId)
    const projectRoot = path.resolve(__dirname, "../");
    const emailTemplatePath = path.join(projectRoot, "views", "rejectionSendMailToTitleCompany.hbs");
    const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
    const template = handlebars.compile(templateSource);

    const context = {
      investorName: `${purchase.fullName} `,
      investorEmail: purchase.email,
      ranchName: purchase.name,
      purchaseId: purchase.id,
      amount: purchase.total_amount,
      referenceId: purchase.escrow_reference_id,
      rejectionReason: rejectionReason,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }),
      year: new Date().getFullYear()
    };

    const emailHtml = template(context);
    const emailOptions = {
      to: purchase.email,
      subject: `❌ ACTION REQUIRED: Refund Funds - ${context.referenceId} - ${context.amount}`,
      html: emailHtml,
    };
    await sendEmail(emailOptions);
    await rejectionMailSendToInvester(purchase, rejectionReason)

    // ----------------------send push notification to investor ranches rejected--------------------------------//
    let usersFcmToken = purchase.user_fcmToken;
    let investorFcmToken = purchase.investor_fcmToken;
    let notificationType = NotificationTypes.REJECTED_INVESTOR_RANCHES_OWNERSHIP;
    let followId = purchaseId;
    let notificationSend = "rejectedInvestorRanchesOwnership";
    let postId = purchaseId;
    let fcmTokens = [];
    if (usersFcmToken) fcmTokens.push(usersFcmToken);
    if (investorFcmToken) fcmTokens.push(investorFcmToken);
    let fullName = purchase.name
    let id = purchase.investor_id
    let userId = purchase.user_id
    await Promise.all(fcmTokens.map(async (usersfetchFcmToken) => {
      let message = await createNotificationMessage({ notificationSend, fullName, id, userId, followId, usersfetchFcmToken, notificationType, postId });
      message.data.investorId = String(purchase.investor_id);
      await sendNotification(message, postId);
    }))
    return res.json({
      success: true,
      message: "Funds refund to investor successfully!",
      purchase_id: purchaseId,
      amount: purchase.balance_amount,
      escrow_transaction_id: purchase.escrow_transaction_id,
    });

  } catch (error) {
    console.error('❌ Fund release error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const invester_supports_data = async (req, res) => {
  try {
    let all_support = await fetchInvester_supports();
    if (all_support.length === 0) {
      return handleError(res, 404, Msg.SUPPORT_NOT_FOUND);
    }
    const currentYear = new Date().getFullYear();

    all_support = await Promise.all(
      all_support.map(async (support) => {
        const formattedId = `TT-SUP-${currentYear}-${String(support.id).padStart(3, '0')}`;
        return { ...support, ticket_number: formattedId, id: support.id };
      })
    );

    return handleSuccess(res, 200, Msg.SUPPORT_RETRIVED, all_support);
  } catch (error) {
    console.error("Error in get_supports_data:", error);
    return handleError(res, 500, error.message);
  }
};

export const reply_to_invester_support = async (req, res) => {
  try {
    const schema = Joi.object({
      support_id: Joi.number().required(),
      replyMessage: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return joiErrorHandle(res, error);

    const { support_id, replyMessage } = value;

    const [support] = await invester_support_by_id(support_id);
    if (!support) {
      return handleError(res, 404, "Support request not found.");
    }

    const emailTemplatePath = path.resolve(
      __dirname,
      "../views/support_reply.ejs"
    );

    const emailHtml = await ejs.renderFile(emailTemplatePath, {
      replyMessage,
      image_logo,
    });

    const emailOptions = {
      to: support.email,
      subject: "Trophy Talk Support",
      html: emailHtml,
    };

    await sendEmail(emailOptions);
    let data = {
      investorContactSupportId: support_id,
      reply_message: replyMessage,
      email: support.email,
    }
    await investor_support_reply_model(data);

    return handleSuccess(res, 200, "Support reply sent successfully.");
  } catch (error) {
    console.error("Error in reply_to_support:", error);
    return handleError(res, 500, error.message);
  }
};

// -----------------------------------ranches blackout days------------------------------------------------ 

export const insertRanchesBlackoutDays = async (req, res) => {
  try {
    let blackoutDates = req.body.blackout_dates;
    await Promise.all(blackoutDates.map(async (item) => {
      let obj = {
        ranch_id: req.body.ranch_id,
        blackout_date: item,
        reason: item.reason || null
      }
      await insertRanchBlackoutDays(obj);
    }))
    return handleSuccess(res, 200, "Ranches blackout days created successfully");
  } catch (error) {
    console.error("Error in insertRanchesBlackoutDays:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const updateRanchesBlackoutDays = async (req, res) => {
  try {
    if (req.body.remove_blackout_days && req.body.remove_blackout_days.length > 0) {
      await Promise.all(req.body.remove_blackout_days.map(async (item) => {
        await deleteRanchBlackoutDays(item);
      }))
    }

    if (req.body.blackout_date && req.body.blackout_date.length > 0) {
      await Promise.all(req.body.blackout_date.map(async (item) => {
        let obj = {
          ranch_id: req.body.ranch_id,
          blackout_date: item
        }
        await insertRanchBlackoutDays(obj);
      }))
    }

    return handleSuccess(res, 200, "Ranches blackout days updated successfully");
  } catch (error) {
    console.error("Error in updateRanchesBlackoutDays:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchRanchesBlackoutDays = async (req, res) => {
  try {
    const { ranch_id } = req.query;
    let rows = await fetchRanchBlackoutDays(ranch_id);

    if (rows.length === 0) {
      const blackoutDetails = {
        ranch_id: ranch_id,
        blackout_date: [],
        reason: null,
        status: 0,
        createdAt: null,
        updatedAt: null
      };
      return handleSuccess(res, 200, "Ranches blackout days not found", blackoutDetails);
    }

    const blackoutData = {
      ranch_id: rows[0].ranch_id,
      blackout_date: rows.map(r => ({
        id: r.id,
        date: r.blackout_date
      })),
      reason: rows[0].reason,
      status: rows[0].status,
      createdAt: rows[0].createdAt,
      updatedAt: rows[0].updatedAt
    };

    return handleSuccess(res, 200, "Ranches blackout days retrieved successfully", blackoutData);
  } catch (error) {
    console.error("Error in fetchRanchesBlackoutDays:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const bookingRequestManagment = async (req, res) => {
  try {
    let rows = await bookingRequestModel();
    if (rows.length === 0) {
      return handleSuccess(res, 200, "booking request not found", []);
    }
    return handleSuccess(res, 200, "booking request ", rows);
  } catch (error) {
    console.error("Error in fetchRanchesBlackoutDays:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// export const approveAndRejectBookingRequest = async (req, res) => {
//   try {
//     const { bookingId, status } = req.body;
//     let fetchBookingRequestData = await fetchBookingRanchesByIdsModel(bookingId)
//     let result = await bookingApprovedAndRejectById(bookingId, status)
//     // ----------------------send push notification to investor ranches approval--------------------------------//
//     let usersFcmToken = fetchBookingRequestData[0].userFcmToken;
//     let investorFcmToken = fetchBookingRequestData[0].investerFcmToken;
//     let notificationType;
//     let followId = bookingId;
//     let notificationSend;
//     if (status == 'approved') {
//       notificationType = NotificationTypes.RANCHES_BOOKING_APPROVAL;
//       notificationSend = "ranchesBookingApproval";
//     } else {
//       notificationType = NotificationTypes.RANCHES_BOOKING_REJECTION;
//       notificationSend = "ranchesBookingRejection";
//     }
//     let postId = fetchBookingRequestData[0].ranches_id;
//     let fcmTokens = [];
//     if (usersFcmToken) fcmTokens.push(usersFcmToken);
//     if (investorFcmToken) fcmTokens.push(investorFcmToken);
//     let fullName = fetchBookingRequestData[0].name
//     let id = fetchBookingRequestData[0].userId
//     let userId = fetchBookingRequestData[0].userId
//     await Promise.all(fcmTokens.map(async (usersfetchFcmToken) => {
//       let message = await createNotificationMessage({ notificationSend, fullName, id, userId, followId, usersfetchFcmToken, notificationType, postId });
//       message.data.investorId = String(fetchBookingRequestData[0].investerId);
//       await sendNotification(message, postId);
//     }))
//     return res.json({ success: true, message: `Ranches booking ${status} succesfully`, });

//   } catch (error) {
//     console.error('❌ Fund release error:', error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };


export const approveAndRejectBookingRequest = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    let fetchBookingRequestData = await fetchBookingRanchesByIdsModel(bookingId);
    await bookingApprovedAndRejectById(bookingId, status);

    let usersFcmToken = fetchBookingRequestData[0].userFcmToken;
    let investorFcmToken = fetchBookingRequestData[0].investerFcmToken;

    let notificationType;
    let followId = bookingId;
    let notificationSend;

    if (status == 'approved') {
      notificationType = NotificationTypes.RANCHES_BOOKING_APPROVAL;
      notificationSend = "ranchesBookingApproval";
    } else {
      notificationType = NotificationTypes.RANCHES_BOOKING_REJECTION;
      notificationSend = "ranchesBookingRejection";
    }

    let postId = fetchBookingRequestData[0].ranches_id;
    let fullName = fetchBookingRequestData[0].name;

    if (usersFcmToken) {
      let id = fetchBookingRequestData[0].userId;
      let userId = fetchBookingRequestData[0].userId;
      let baseMessage = await createNotificationMessage({
        notificationSend, fullName, id, userId, followId,
        notificationType, postId
      });
      baseMessage.data.investorId = String(fetchBookingRequestData[0].investerId);
      let userMessage = { ...baseMessage, token: usersFcmToken };
      await sendNotification(userMessage, postId);
    }

    if (investorFcmToken) {
      let id = fetchBookingRequestData[0].investerId;
      let userId = fetchBookingRequestData[0].investerId;
      let baseMessage = await createNotificationMessage({
        notificationSend, fullName, id, userId, followId,
        notificationType, postId
      });
      baseMessage.data.investorId = String(fetchBookingRequestData[0].investerId);
      let investorMessage = { ...baseMessage, token: investorFcmToken };
      await sendNotification(investorMessage, postId);
    }

    return res.json({
      success: true,
      message: `Ranches booking ${status} succesfully`,
    });

  } catch (error) {
    console.error('❌ Booking update error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const fetchBookingRequestManagmentById = async (req, res) => {
  try {
    let { bookingId } = req.query
    let rows = await bookingRequestModelbyIds(bookingId);
    if (rows.length === 0) {
      return handleSuccess(res, 200, "booking request not found", {});
    }
    let bookedDates = await fetchRanchesbookedDatesByIds(bookingId)
    rows[0].bookedDates = bookedDates.length > 0 ? bookedDates : []
    return handleSuccess(res, 200, "booking request retrived successfully ", rows[0]);
  } catch (error) {
    console.error("Error in fetchRanchesBlackoutDays:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const notActiveAdmin = async (req, res) => {
  try {
    let { chatId } = req.body
    let rows = await updateNotActiveAdminChats(chatId);
    return handleSuccess(res, 200, 'admin inactive successfully');
  } catch (error) {
    console.error("fetchInvesterForm error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// ---------------------------new code for admin payout to seller----------------------------//

export const getAllSellerToPayList = async (req, res) => {
  try {
    const admin = req.admin;
    const sellers = await getAllListOfSeller();
    const adminCommissionPercent = parseFloat(admin.admin_commission);
    await Promise.all(
      sellers.map(async (seller) => {
        const orderItems = await getProductOrderDataModel(seller.id);
        let grossSales = 0;
        for (const item of orderItems) {
          const price = Number(item.price_at_order ?? 0);
          const qty = Number(item.quantity ?? 0);
          const delivery = Number(item.delivery_charge ?? 0);
          grossSales += (price * qty) + delivery;
        }
        // 2️⃣ Already paid payouts (gross)
        const [paid] = await getSellerLastPayoutDataModel(seller.id);
        const alreadyPaid = Number(paid?.total_amount ?? 0);
        const pendingGross = grossSales - alreadyPaid;
        if (pendingGross <= 0) {
          seller.amount = "0.00";
          seller.commission = "0.00";
          return;
        }
        const commissionAmount = (pendingGross * adminCommissionPercent) / 100;
        const netAmount = pendingGross - commissionAmount;
        seller.amount = Number(netAmount).toFixed(2);
        seller.commission = Number(commissionAmount).toFixed(2);
        seller.gross_amount = Number(pendingGross).toFixed(2);
      })
    );
    const pendingSellers = sellers.filter((s) => Number(s.amount) > 0);
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, pendingSellers);
  } catch (error) {
    console.error("getAllSellerToPayList error:", error);
    return handleError(res, 500, error.message);
  }
};

export const getAllSellerPayoutList = async (req, res) => {
  try {
    const payoutList = await getAllSellerPayoutListAdminModel();
    const orderItems = await getAdminAllWallet();
    let totalGrossSales = 0;
    for (const item of orderItems) {
      const price = Number(item.price_at_order || 0);
      const qty = Number(item.quantity || 0);
      const shipping = Number(item.delivery_charge || 0);
      totalGrossSales += (price * qty) + shipping;
    }
    let totalNetPaidToSellers = 0;
    for (const payout of payoutList) {
      totalNetPaidToSellers += Number(payout.payout_amount || 0);
    }
    const admin_wallet = totalGrossSales - totalNetPaidToSellers;
    await Promise.all(
      payoutList.map(async (item) => {
        const sellerData = await get_seller_data_by_id(item.seller_id);
        item.businessName = sellerData?.[0]?.businessName || null;
        item.bussinesslogo = sellerData?.[0]?.bussinesslogo || null;
      })
    );

    return handleSuccess(res, 200, Msg.dataFoundSuccessful, {
      payouts: payoutList,
      admin_wallet: Number(admin_wallet).toFixed(2),
      total_gross_sales: Number(totalGrossSales).toFixed(2),
      total_paid_to_sellers: Number(totalNetPaidToSellers).toFixed(2),
    });

  } catch (error) {
    console.error("getAllSellerPayoutList error:", error);
    return handleError(res, 500, error.message);
  }
};

export const payPaymentToSeller = async (req, res) => {
  try {
    const admin = req.admin;
    const { seller_id, amount, commission_amount } = req.body;
    if (!seller_id || !amount) {
      return handleError(res, 400, "seller_id and amount are required");
    }

    const netAmount = Number(amount);              // 62.13
    const commission = Number(commission_amount); // 7.87
    const grossAmount = netAmount + commission;   // 70.00

    if (netAmount <= 0) {
      return handleError(res, 400, "Invalid payout amount");
    }
    const [sellerAccount] = await isSellerAccountCreatedOrNot(seller_id);

    if (!sellerAccount) {
      return handleError(res, 400, "Seller account not found");
    }
    console.log('sellerAccount', sellerAccount);

    // const accountId = 'acct_1Snh76SkecpXVeiD';
    // const account = await stripe.accounts.retrieve(accountId);

    // if (!account.charges_enabled || !account.payouts_enabled) {
    //   return handleError(res, 400, "Seller account not eligible for payouts");
    // }
    const stripeAmount = Math.round(netAmount * 100); // 6213
    const [seller] = await get_seller_data_by_id(seller_id);
    const userId = seller.userId;
    const [user] = await fetchUserById(userId);
    // const transfer = await stripe.transfers.create({
    //   amount: stripeAmount, // cents
    //   currency: "usd",
    //   application_fee_amount: commission,
    //   destination: accountId,
    //   description: `Admin payout to seller ${seller_id}`,
    //   metadata: {
    //     seller_id: seller_id.toString(),
    //     user_id: userId.toString(),
    //     payout_amount: netAmount.toFixed(2),
    //     admin_commission: commission.toFixed(2),
    //     gross_amount: grossAmount.toFixed(2),
    //     admin_id: admin.id.toString(),
    //     fcmToken: user?.fcmToken || ""
    //   }
    // });

    // -------------------testing purpose------------------//
    const data = {
      seller_id: seller_id,
      payout_amount: netAmount.toFixed(2),
      admin_commission: commission.toFixed(2),
      gross_amount: grossAmount.toFixed(2),
      // stripe_transfer_id: transfer.id,
      stripe_transfer_id: 'test_transfer_id_741hjhk',

    };


    await updateSellerPayoutModel(data);

    // ------------------------end----------------//

    return handleSuccess(res, 200, "Payout initiated", {
      // stripe_transfer_id: transfer.id,
      payout_amount: netAmount.toFixed(2),
      commission: commission.toFixed(2),
      gross_amount: grossAmount.toFixed(2)
    });

  } catch (error) {
    console.error("payPaymentToSeller error:", error);
    return handleError(res, 500, error.message);
  }
};

export const get_product_data = async (req, res) => {
  try {
    const products = await get_all_product_data();
    await Promise.all(
      products.map(async (product) => {
        product.businessName = product.businessName;
        product.bussinessDescription = product.bussinessDescription;
        const colors = await getProductColorsByPid(product.pId);
        if (!colors || colors.length === 0) {
          product.colors = [];
          product.variants = [];
          return product;
        }
        const colorResults = [];
        for (const color of colors) {
          const colorImages = await getUserProductImagesByColorModal(product.pId, color.id);
          const variants = await getProductVariantsByPid(product.pId, color.id);
          colorResults.push({
            color: color.color_name,
            images: colorImages?.length ? colorImages : [],
            variants: variants || []
          });
        }
        product.colors = colorResults;
        const allVariants = colorResults.flatMap(c => c.variants || []);
        product.stock_summary = {
          stock_quantity: allVariants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0),
          low_stock_alert: allVariants.filter(v => v.stock_quantity <= v.low_stock_alert).length
        };
        return product;
      })
    );
    return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, products);
  } catch (err) {
    console.error("Get product list error:", err);
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const getSellerDetailedById = async (req, res) => {
  try {
    const { sellerId } = req.query;
    if (!sellerId) return handleError(res, 400, "sellerId is required");
    const sellerDetailsArr = await fetchSellerIds(sellerId);
    const sellerDetails = sellerDetailsArr?.[0] || {};
    const products = await getProductListModal(sellerId);
    let productWithVarients = await Promise.all(
      products.map(async (product) => {
        product.businessName = sellerDetails.businessName;
        product.bussinessDescription = sellerDetails.bussinessDescription;
        const colors = await getProductColorsByPid(product.pId);
        if (!colors || colors.length === 0) {
          product.colors = [];
          product.variants = [];
          return product;
        }
        const colorResults = [];
        for (const color of colors) {
          const colorImages = await getUserProductImagesByColorModal(product.pId, color.id);
          const variants = await getProductVariantsByPid(product.pId, color.id);
          colorResults.push({
            color: color.color_name,
            images: colorImages?.length ? colorImages : [],
            variants: variants || []
          });
        }
        product.colors = colorResults;
        const allVariants = colorResults.flatMap(c => c.variants || []);
        product.stock_summary = {
          stock_quantity: allVariants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0),
          low_stock_alert: allVariants.filter(v => v.stock_quantity <= v.low_stock_alert).length
        };
        return product;
      })
    );
    const sellerInfo = {
      ...sellerDetails,
      productDetails: productWithVarients || [],
    };

    return handleSuccess(res, 200, Msg.dataFoundSuccessful, sellerInfo);
  } catch (err) {
    return handleError(res, 500, err.message);
  }
};
