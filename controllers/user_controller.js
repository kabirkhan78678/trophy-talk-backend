import dotenv from "dotenv";
import Msg from "../utils/message.js";
import path from "path";
import db from "../config/db.js";
import handlebars from "handlebars";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/emailService.js";
import {
  mediaTypes,
  NotificationTypes,
  StatusCode,
  variableTypes,
} from "../utils/constant.js";
import { handleError, handleSuccess } from "../utils/responseHandler.js";
import {
  isUsersExistsOrNot,
  userRegistration,
  updateUserForgotPasswordOtp,
  updateUserPassword,
  fetchUsersById,
  changePassword,
  updateUsersProfile,
  updateUserOtp,
  updateUsersByOtp,
  fetchBlockedUsersDetailed,
  create_blocked,
  unblockedToUsers,
  fetchBlockedListUsers,
  insertFollowersUsers,
  retrieveMyFollowers,
  retrieveMyFollowing,
  isUsersFollowToAnotherUsers,
  unFollow,
  fetchThereOwnPostModel,
  fetchOtherPostModel,
  fetchUsersLikeToPostDataByUsersId,
  UsersUnLikeToPost,
  addUserLikeToPost,
  fetchLikeOnParticularPost,
  userViewOtherPost,
  fetchTotalViewsOnPost,
  isAllreadyUserViewThePost,
  createNewPosts,
  fetchUsersNotificationByUsersId,
  fetchAllUsersModel,
  fetchBlockedByUsersIdAndCurrentUserLogin,
  accountDeleteModel,
  addCommentsOnParticularPost,
  fetchCommentAccordingToParentCommentId,
  fetchCommentAccordingToPostId,
  addLikesOnParticularCommentPost,
  fetchLikeOnPostCommentedByUsersId,
  UsersUnLikeToCommentedPost,
  pushNotificationOff,
  pushNotificationOn,
  giveAwayAnnoucmentOff,
  giveAwayAnnoucmentOn,
  deletePostByCommentsId,
  fetchUsersByPostId,
  deleteAllNotificationOfGivenUsers,
  deleteNotificationByIds,
  deletePostByIds,
  updateUsersPostsById,
  insertUsersSupports,
  checkAvailableProductModel,
  addProductToCartModal,
  updateCartDataModel,
  deleteCartProductByIdModal,
  getAllCartProductModel,
  getCartDataByCartIdModal,
  addProductToFavoritesModal,
  removeProductToFavoritesModel,
  getFavorietsProductDetailsById,
  getFavoritesProductListModel,
  checkProductDataByIdModel,
  getFavoritesProductBYIDModel,
  fetchSupportCategory,
  checkoutProductModel,
  addAddressModel,
  getAddressModel,
  createGroupChat,
  createSingleChat,
  checkIsUserChatExistsOrNot,
  fetchUsersByUsersName,
  getUserChats,
  fetchChatMemberByChatsIds,
  fetchGroupInfoByGroupId,
  removeMembersModel,
  fetchChatByIds,
  updateGroupProfile,
  readAllNotificatonByUserId,
  saveMessage,
  fetchMessagesById,
  fetchAllChatsMembers,
  saveSystemMessage,
  fetchUNreadNotificationByUsersId,
  createUnreadCount,
  toActivateUsers,
  isUserActive,
  modelFetchAllSweepstacks,
  usersPurchasePlan,
  modelOrderSummary,
  addUserShippingAddress,
  fetchOrderSummary,
  fetchUserShippingAddress,
  fetchOrderSummaryByOrderId,
  fetch_user_all_sweepstakes,
  editShippingAddressByIdModel,
  fetchUserShippingAddressByShippingId,
  modelFetchUserOrdersByUserId,
  fetchOrdersItem,
  changeStatusOfOrderSummarry,
  insertUsersStoriesModel,
  fetchStoriesViews,
  StoriesViewsModel,
  insertStoriesViewersModel,
  insertAudioModel,
  insertMentionedStoriesData,
  fetchAnotherUsersAllStories,
  fetchUsersOwnAllStories,
  fetchSellerByIdAndDetails,
  insertMentionedUserData,
  fetchAllMentionedPostAndStories,
  fetchStoriesByIds,
  isSellerAccountCreatedOrNot,
  saveSellerConnectedAccount,
  checkIsBoostProductAllreadyViewedOrNOt,
  insertBoostAnalyticsProduct,
  fetchBoostProductsById,
  fetchSweepstacksByUsersId,
  fetchFreeSweepstacks,
  changeStatusOfUsersFreeSweepstacks,
  markSellerOnboardingComplete,
  fetchAllUserEntriesForSweepstack,
  fetchAllPostPromotionPackagesModel,
  fetchBoostPostByPostId,
  getPostPromotionPackageById,
  insertLiveStream,
  fetchLiveStreamById,
  updateLiveStream,
  checkLiveStatus,
  fetchLiveStreamByUserId,
  insertLiveStreamViewers,
  fetchSweepPurchaseById,
  getUserStoryById,
  deleteUserStoryById,
  fetchWalletHistoryById,
  fetchWalletBalanceById,
  insertBoostPost,
  updatePostBoost,
  insertWalletHistory,
  createOrders,
  insertOrdersItem,
  fetchAllOtherUsers,
  modelFetchAllSweepstacksById,
  fetchAllPublicLives,
  fetchMyFollowingLives,
  fetchPostLikeCountBYPostId,
  fetchLiveCountByLiveID,
  fetchMyFollowingsPostModel,
  checkUserChatMember,
  insertIntoMessage,
  insertIntoChat,
  insertUserChatMember,
  fetchOtherUserChat,
  retriveALLUserChat,
  fetchPromotedPost,
  insertContactSupport,
  countSharedPost,
  fetchAllReportReason,
  addUsersReport,
  fetchAllReportReasonByIds,
  insertApplyToBecomeInvestor,
  insertApplyToBecomeInvestorMedia,
  applyAgainModel,
  fetchRanchesByIdUsersModel,
  deleteInvesterMediaById,
  fetchAllGovermentIdTypes,
  fetchInvesterFormModel,
  fetchInvesterMediaModel,
  fetchAllActiveRanchesModel,
  deleteInvesterByIds,
  insertDocument,
  addApplicationRanchesForm,
  deleteInvesterApplicationByIds,
  fetchInvesterApplicationFormModel,
  fetchInvesterApplicationMediaModel,
  fetchCountriesCodeWithCountriesModel,
  fetchInvestingAsModel,
  fetchPrefferedOwnershipModel,

  // --------------------------ranche related operations ---------------------------
  ranchesPurchasesByInvesters,
  updateTotalShares,
  modelFetchInvestedRanchesByInvesterId,
  modelFetchInvestedRanchesById,
  modelRanchesPurchaseHistory,

  modelFetchInvestedRanchesByRanchesId,
  fetchInvesterByThereIds,
  otherInvesterPurchasesRanchesFind,
  totalCalculationSharedPurchase,
  fetchInvestedRanchesByRanchesId,
  investerInsertContactSupport,
  fetchAllPendingRanchesModel,
  fetchInvesterApplicationFormModelByUserId,
  fetchRanchesBlackoutDaysModel,
  fetchRanchesBookedDatesModel,
  fetchMyRanchesBookedDatesModel,
  fetchMyApprovalRanchesBookedDatesModel,
  fetchBookingRanchesById,
  insertRanchBookingModel,
  insertRanchBookedDatesModel,
  isUsersExistsOrNotAndVerifiedOrNot,
  isUsersExistsOrNotAndVerifiedNot,
  deleteUnVarifiedUsers,
  updateNotActiveInvestorChats,
  fetchChatIdThroughRanchesIdAndInvestor,
  fetchUnreadRanchesChatCountById,

  // ---------------------------------new cart flow developer karan patel-----------------------------//
  getVariantDetailsById,
  getUserProductImagesByColorModal,
  updateCartQuantityModel,
  checkAvailableVariantInCartModel,
  getVariantById,
  updateVariantStockModel,

} from "../models/user.model.js";

import {

  fetchAdmin,
  fetchSellerInfoById,
  getProductCategoryByIDModel,
  getProductDataByIdModal,
  getProductDetailsById,
  getProductDetailsId,
  getSellerDetailsBySeller_d,
  getSellerDetailsByUserId,
  getUserProductImagesModal,
  updateProductViewed,

  // ------------------cart model ---------------------------
  addToCartWithVarient,
  checkAllredyInTheCartOrNot,
  fetchProductVariantModel,

} from "../models/seller.model.js";

import {
  sendNotification,
  authenticateUser,
  sendUserSupportEmail,
  hashPassword,
  createNotificationMessage,
  comparePassword,
  sendVerificationEmail,
  generateToken,
  updateOnlineStatus,
  generateConfirmationId,
  generateFiveDigitNumber,
  generateTransactionId,
  generateCleanUsername,
  sendTestNotification,
} from "../utils/user_helper.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { baseurl } from "../config/path.js";
import {
  getPublicUrl,
  deleteFileFromS3 as deleteFromS3,
  deleteFileFromS3,
} from "../middleware/upload.js";
import { getIO, getUserSockets } from "../utils/socketManager.js";
import {
  fetch_adsMedia_by_id,
  fetch_all_sweepstakes,
  fetch_sweepstakes_by_id,
  fetch_sweepstakesMedia_by_id,
  fetchAllAds,
  fetchOrderItemByID,
  fetchOrderItemByIDForSeller,
  fetchProductDetailedById,
  fetchProductsImagesByProductId,
  fetchRanchesByIdModel,
  fetchRanchesDocumentsModel,
  fetchRanchesMediaModel,
  fetchRanchesModel,
  get_product_data_by_id,
  modelFetchOrdersByOrderId,
  updateProductQuantityModel,
  updateRanchesModel,
} from "../models/admin.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import axios from "axios";
import crypto from "crypto";
import { fetchInvesterByIds } from "./admin_controller.js";
import { fetchAllPendingRanchesModelPending, fetchInvestorStats, getInvestedRanchesByInvesterId, getInvesterByUserIdModel } from "../models/investor.model.js";
dotenv.config();

const APP_ID = Number(process.env.ZEGO_APP_ID);
const SERVER_SECRET = process.env.ZEGO_SERVER_SECRET;

const generateNonce = () => crypto.randomBytes(8).toString("hex");



export const userSignUp = async (req, res) => {
  try {
    const { fullName, username, email, password, isSignUpMe } = req.body;

    const deleteNotVerifiedUsers = await isUsersExistsOrNotAndVerifiedNot(email);
    if (deleteNotVerifiedUsers.length !== 0) {
      let user_id = deleteNotVerifiedUsers[0].id
      await deleteUnVarifiedUsers(user_id)
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    const data = await isUsersExistsOrNotAndVerifiedOrNot(email);

    if (data.length !== 0) {
      return handleError(res, 400, Msg.allreadyHaveAccount, []);
    } else {
      const hash = await hashPassword(password);
      const user = {
        fullName,
        userName: username,
        email: email.toLowerCase(),
        code: code,
        password: hash,
        isSignUpMe,
      };
      let create_user = await userRegistration(user);
      if (create_user) {
        await sendVerificationEmail({ email, code, res });
      } else {
        return handleSuccess(res, 400, `${Msg.failedToUsersCreate}`);
      }
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email, isForgotPasswordPage } = req.body;
    let isUserExists = await isUsersExistsOrNot(email);
    const code = Math.floor(1000 + Math.random() * 9000);
    if (isUserExists.length > 0) {
      if (isForgotPasswordPage == 1) {
        await updateUserForgotPasswordOtp(code, email);
        await sendVerificationEmail({ email, code, res });
      } else {
        await updateUserOtp(code, email);
        await sendVerificationEmail({ email, code, res });
      }
    } else {
      return handleError(res, 400, Msg.USER_NOT_FOUND);
    }
  } catch (err) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const otpVerified = async (req, res) => {
  try {
    const { email, otp, isForgotPasswordPage } = req.body;
    let isUserExists = await isUsersExistsOrNot(email);
    if (isUserExists.length > 0) {
      if (isForgotPasswordPage == 1) {
        if (isUserExists[0].forgotPasswordOtp == otp) {
          return handleSuccess(res, 200, `${Msg.otpVerified}.`);
        } else {
          return handleError(res, 400, Msg.invalidOtp);
        }
      } else {
        if (isUserExists[0].code == otp) {
          await updateUsersByOtp(isUserExists[0]?.id);
          return handleSuccess(res, 200, `${Msg.otpVerified}.`);
        } else {
          return handleError(res, 400, Msg.invalidOtp);
        }
      }
    } else {
      return handleError(res, 400, Msg.USER_NOT_FOUND);
    }
  } catch (err) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const userSignIn = async (req, res) => {
  try {
    let moduleType = "userLogin";
    const { email, password, fcmToken } = req.body;
    const userData = await isUsersExistsOrNot(email);
    if (userData?.length == 0) {
      return handleError(res, 400, Msg.accountNotFound, []);
    }

    // if (userData[0].is_suspended == 1) {
    //     return handleError(res, 400, Msg.ACCOUNT_SUSPENDED);
    // }
    // ---------------------------------------------new line added-------------------------//
    const [user] = await fetchUsersById(userData[0].id);
    if (user.is_suspended == 1) {
      return handleError(res, 400, Msg.ACCOUNT_SUSPENDED);
    }
    const seller = await fetchSellerInfoById(userData[0].id);
    if (seller.length > 0) {
      if (seller[0].status == 0) {
        return handleError(res, 400, Msg.SELLER_ACCOUNT_SUSPENDED);
      }
    }
    // -----------------------------------------------end----------------------------------//
    return authenticateUser(
      res,
      email,
      password,
      userData,
      fcmToken,
      moduleType
    );
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await isUsersExistsOrNot(email);
    if (data.length > 0) {
      const code = Math.floor(1000 + Math.random() * 9000);
      await updateUserForgotPasswordOtp(code, email);
      const context = {
        OTP: code,
        msg: Msg.verifiedMessage,
      };
      const projectRoot = path.resolve(__dirname, "../");
      const emailTemplatePath = path.join(
        projectRoot,
        "views",
        "forget_template.handlebars"
      );
      const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
      const template = handlebars.compile(templateSource);
      const emailHtml = template(context);
      const emailOptions = {
        to: email,
        subject: Msg.forgotPassword,
        html: emailHtml,
      };
      await sendEmail(emailOptions);
      return handleSuccess(res, 200, `${Msg.forgotPasswordOtpSend}.`);
    } else {
      return handleError(res, 400, Msg.emailNotFound, []);
    }
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const changeForgotPassword = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;
    if (password == confirm_password) {
      const data = await isUsersExistsOrNot(email);
      if (data.length !== 0) {
        const hash = await bcrypt.hash(password, 12);
        const result2 = await updateUserPassword(hash, email);
        if (result2.affectedRows) {
          return handleSuccess(res, 200, `${Msg.passwordChanged}.`);
        }
      } else {
        return handleError(res, 400, Msg.emailNotFound, []);
      }
    } else {
      return handleError(res, 400, Msg.passwordAndConfirmPasswordNotMatch, []);
    }
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const resetPassword = async (req, res) => {
  try {
    let { old_password, new_password, confirm_password } = req.body;
    let { id } = req.user;
    const data = await fetchUsersById(id);
    if (data.length > 0) {
      const match = await comparePassword(old_password, data[0].password);
      if (match) {
        if (new_password == confirm_password) {
          const hash = await hashPassword(confirm_password);
          let result = await changePassword(hash, id);
          if (result.affectedRows) {
            return handleSuccess(res, 200, Msg.passwordChanged);
          } else {
            return handleError(res, 400, Msg.passwordNotChanged);
          }
        } else {
          return handleError(res, 400, Msg.passwordsDoNotMatch);
        }
      } else {
        return handleError(res, 400, Msg.currentPasswordIncorrect, []);
      }
    } else {
      return handleError(res, 400, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    let { id } = req.user;
    let { userId } = req.query;
    let usersId = userId ? userId : id;
    let checkUser = await fetchUsersById(usersId);
    checkUser.map((item) => {
      item.profileImage = item.profileImage != null ? item.profileImage : null;
      item.backgroundImage =
        item.backgroundImage != null ? item.backgroundImage : null;
      return item;
    });
    let isBlocked;
    if (userId) {
      let isBlockedUsers = await fetchBlockedByUsersIdAndCurrentUserLogin(
        id,
        userId
      );
      isBlocked = isBlockedUsers.length > 0 ? true : false;
    }
    let myFollowers = await retrieveMyFollowers(usersId);
    let myFollowings = await retrieveMyFollowing(usersId);
    let check = myFollowers.some((item) => item.followersId === id)
      ? myFollowers.filter((item) => item.followersId === id)
      : false;
    // -------------------------------------fetch blocked user list and varify -------------------------//
    if (id) {
      let result = await fetchBlockedListUsers(id);
      let blockedToIds =
        result.length > 0 ? result.map((user) => user.blocked_to) : [];
      myFollowers = myFollowers.filter((item) => {
        return item && !blockedToIds.includes(Number(item.followersId));
      });
      myFollowings = myFollowings.filter((item) => {
        return item && !blockedToIds.includes(Number(item.followingId));
      });
    }
    // -----------------------------------------end----------------------------------------------------//

    checkUser[0].myFollowers = myFollowers.length > 0 ? myFollowers.length : 0;
    checkUser[0].myFollowings = myFollowings.length > 0 ? myFollowings.length : 0;
    checkUser[0].isFollow = check.length > 0 ? true : false;
    checkUser[0].isBlocked = isBlocked ? isBlocked : null;
    return handleSuccess(
      res,
      200,
      Msg.userDetailedFoundSuccessfully,
      checkUser[0]
    );
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// --------------------------------------using s3 start code------------------------------------//

export const editProfile = async (req, res) => {
  try {
    let { id } = req.user;
    let [isUserExists] = await fetchUsersById(id);
    let profileImg = null;
    let backgroundImage = null;
    if (req.files) {
      if (req.files.profileImage && isUserExists.profileImage) {
        await deleteFromS3(isUserExists.profileImage);
      }
      if (req.files.backgroundImage && isUserExists.backgroundImage) {
        await deleteFromS3(isUserExists.backgroundImage);
      }
      profileImg = req.files.profileImage
        ? getPublicUrl(req.files.profileImage[0].key)
        : isUserExists.profileImage;
      backgroundImage = req.files.backgroundImage
        ? getPublicUrl(req.files.backgroundImage[0].key)
        : isUserExists.backgroundImage;
    }
    const userProfile = {
      userName: req.body?.userName ?? isUserExists.userName,
      fullName: req.body?.fullName ?? isUserExists.fullName,
      bio: req.body?.bio ?? isUserExists.bio,
      huntingTitle: req.body?.huntingTitle ?? isUserExists.huntingTitle,
      location: req.body?.location ?? isUserExists?.location,
      profileImage: profileImg == null ? isUserExists.profileImage : profileImg,
      backgroundImage:
        backgroundImage == null
          ? isUserExists.backgroundImage
          : backgroundImage,
      address: req.body?.address ?? isUserExists.address,
    };
    const result = await updateUsersProfile(userProfile, id);
    return handleSuccess(res, 200, Msg.profileUpdatedSuccessfully, result);
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// --------------------------------------------end s3 code ----------------------------------------//

// export const editProfile = async (req, res) => {
//     try {
//         let { id } = req.user
//         let profileImg = null;
//         let backgroundImage = null;
//         if (req.files) {
//             profileImg = req.files && req.files.profileImage ? `${baseurl}/profile/${req.files.profileImage[0].filename}` : null;
//             backgroundImage = req.files && req.files.backgroundImage ? `${baseurl}/profile/${req.files.backgroundImage[0].filename}` : null
//         }
//         let [isUserExists] = await fetchUsersById(id)
//         const userProfile = {
//             userName: req.body?.userName ?? isUserExists.userName,
//             fullName: req.body?.fullName ?? isUserExists.fullName,
//             bio: req.body?.bio ?? isUserExists.bio,
//             huntingTitle: req.body?.huntingTitle ?? isUserExists.huntingTitle,
//             location: req.body?.location ?? isUserExists?.location,
//             profileImage: profileImg == null ? isUserExists.profileImage : profileImg,
//             backgroundImage: backgroundImage == null ? isUserExists.backgroundImage : backgroundImage,
//             address: req.body?.address ?? isUserExists.address,
//         };
//         const result = await updateUsersProfile(userProfile, id);
//         return handleSuccess(res, 200, Msg.profileUpdatedSuccessfully, result);
//     } catch (err) {
//         console.error(err);
//         return handleError(res, 500, Msg.internalServerError);
//     }
// };

export const blockedToAnotherUsers = async (req, res) => {
  try {
    let { userId } = req.body;
    let { id } = req.user;
    let obj = {
      blocked_from: id,
      blocked_to: userId,
    };
    await create_blocked(obj);
    return handleSuccess(res, 200, Msg.userBlockedSuccessfully);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const unblockedToAnotherUsers = async (req, res) => {
  try {
    let { id } = req.user;
    let { userId } = req.body;
    await unblockedToUsers(id, userId);
    return handleSuccess(res, 200, Msg.userUnBlockedSuccessfully);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchBlockedList = async (req, res) => {
  try {
    let { id } = req.user;
    let result = await fetchBlockedListUsers(id);
    if (result.length > 0) {
      let blockedToIds = result.map((user) => user.blocked_to);
      let blocked_user_data_fetch = await fetchBlockedUsersDetailed(
        blockedToIds
      );

      return handleSuccess(
        res,
        200,
        Msg.dataFoundSuccessful,
        blocked_user_data_fetch
      );
    } else {
      return handleError(res, 400, Msg.USER_NOT_FOUND, []);
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: Msg.err,
    });
  }
};

export const socialLogin = async (req, res) => {
  try {
    const { email, socialId, userName, fcmToken, socialProvider } = req.body;
    const data = await isUsersExistsOrNot(email);
    let new_user_name = await generateCleanUsername(userName, "trophy talk");
    if (data.length !== 0) {
      let obj = {
        socialProvider,
        socialId,
        fcmToken,
      };
      await updateUsersProfile(obj, data[0].id);
      const token = generateToken(data[0]);
      return handleSuccess(res, 200, Msg.loginSuccess, token);
    } else {
      const user = {
        email,
        socialId,
        userName: new_user_name,
        fullName: userName,
        fcmToken,
        socialProvider,
        isVerified: 1,
      };
      const create_user = await userRegistration(user);
      const user_id = { id: create_user.insertId };
      let id = user_id.id;
      const token = generateToken(user_id);
      let responseData = {
        token,
        id,
      };
      return handleSuccess(res, 200, Msg.loginSuccess, token);
    }
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const follow = async (req, res) => {
  try {
    let { userId } = req.body;
    let { id, fullName, profileImage } = req.user;
    let fetchFcmToken = await fetchUsersById(userId);
    let data = {
      followersId: id,
      followingId: userId,
    };
    let savedFollowingUsers = await insertFollowersUsers(data);
    if (savedFollowingUsers.insertId == 0) {
      return handleError(res, 400, Msg.requestNotSent);
    }
    let usersfetchFcmToken = fetchFcmToken[0].fcmToken;
    let notificationType = NotificationTypes.FOLLOWER_NOTIFICATION;
    let followId = savedFollowingUsers.insertId;
    let notificationSend = "followToAnotherUsers";
    let postId = null;
    let message = await createNotificationMessage({
      notificationSend,
      fullName,
      id,
      userId,
      followId,
      usersfetchFcmToken,
      notificationType,
      postId,

      profileImage,
    });
    await sendNotification(message);
    return handleSuccess(res, 200, Msg.followSuccess);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const retrieveUserFollowersAndFollowing = async (req, res) => {
  try {
    let { id } = req.user;
    let { isFollower, userId } = req.query;
    let usersId = userId ? userId : id;
    let data;

    let result = await fetchBlockedListUsers(id);
    let blockedToIds =
      result.length > 0 ? result.map((user) => user.blocked_to) : [];

    if (isFollower == 1) {
      data = await retrieveMyFollowers(usersId);
      if (id) {
        data = data.filter((item) => {
          return item && !blockedToIds.includes(Number(item.followersId));
        });
      }
      data = data;
    } else {
      data = await retrieveMyFollowing(usersId);
      if (id) {
        data = data.filter((item) => {
          return item && !blockedToIds.includes(Number(item.followingId));
        });
      }
      data = data;
    }
    if (data.length > 0) {
      data = await Promise.all(
        data.map(async (item) => {
          let userId = item.followersId ? item.followersId : item.followingId;
          let isFollower = await isUsersFollowToAnotherUsers(id, userId);
          let userDeatils = await fetchUsersById(userId);
          let isSelf = false;
          if (id == userId) {
            isSelf = true;
          }
          item.isSelf = isSelf;
          item.userId = userId;
          item.isFollower = isFollower.length > 0 ? true : false;
          item.userName = userDeatils[0].fullName;
          item.realUserName = userDeatils[0].userName;
          item.huntingTitle = userDeatils[0].huntingTitle;
          item.profileImage =
            userDeatils[0].profileImage != null
              ? userDeatils[0].profileImage
              : null;
          return item;
        })
      );
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
    } else {
      return handleError(res, 400, Msg.USER_NOT_FOUND, []);
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const unfollow = async (req, res) => {
  try {
    let { id } = req.user;
    let { userId } = req.body;
    await unFollow(id, userId);
    return handleSuccess(res, 200, Msg.unFollowedToUsers);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchMyPostByUserId = async (req, res) => {
  try {
    let { id } = req.user;
    let { userId } = req.query;
    let usersId = userId ? userId : id;
    let fetchThereOwnPost = await fetchThereOwnPostModel(usersId);
    if (fetchThereOwnPost.length > 0) {
      let fetchFollowingId = await retrieveMyFollowing(id);
      const followingIds = fetchFollowingId.map((i) => i.followingId);
      // ------------------------------------------IF USER NOT FOLLOW TO ANOTHER USER SO POST IS NOT SHOW ONLY EVERYONE POST SHOW--//
      if (userId) {
        let normalizedUsersId = Number(usersId);
        let isFollowing = followingIds.map(Number).includes(normalizedUsersId);
        fetchThereOwnPost = fetchThereOwnPost.filter((post) => {
          if (isFollowing) {
            return true;
          }
          return post.audiance === "Everyone";
        });
        if (fetchThereOwnPost.length === 0) {
          return handleError(res, 400, Msg.postNotFound, []);
        }
      }
      // --------------------------------------------------------------END--------------------------------------------------//

      fetchThereOwnPost = await Promise.all(
        fetchThereOwnPost.map(async (item) => {
          let isFollower;
          if (!followingIds.includes(item.userId) && item.userId !== id) {
            isFollower = false;
          } else if (item.userId == id) {
            isFollower = true;
          } else {
            isFollower = true;
          }
          item.isFollower = isFollower;
          let tagPeople = [];
          let tagsPeople = item.tagPeople
            ? typeof item.tagPeople === "string"
              ? JSON.parse(item.tagPeople)
              : item.tagPeople
            : []; // Ensure it's an array

          if (Array.isArray(tagsPeople) && tagsPeople.length > 0) {
            tagPeople = await Promise.all(
              tagsPeople.map(async (i) => ({
                userId: i,
                userDetails: await fetchUsersById(i),
              }))
            );
          }
          let postId = item.id;
          let totalComments = 0;
          let fetchCommentsByPostId = await fetchCommentAccordingToPostId(
            postId
          );
          if (fetchCommentsByPostId.length > 0) {
            let fetchTotalPostComments = fetchCommentsByPostId.length;
            let totalNestedComments = 0;
            fetchCommentsByPostId = await Promise.all(
              fetchCommentsByPostId.map(async (comment) => {
                let nestedComments =
                  await fetchCommentAccordingToParentCommentId(comment.id);
                comment.fetchNestedComments = nestedComments.length;
                totalNestedComments += nestedComments.length;
                return comment;
              })
            );
            totalComments = fetchTotalPostComments + totalNestedComments;
          }
          let totalViewsOnPost = await fetchTotalViewsOnPost(postId);
          let isLike = await fetchUsersLikeToPostDataByUsersId(id, postId);
          let userData = await fetchUsersById(item.userId);
          let fetchAllLikePosts = await fetchLikeOnParticularPost(postId);
          item.totalLikes =
            fetchAllLikePosts.length > 0 ? fetchAllLikePosts.length : 0;
          item.imageUrl =
            item.imageUrl != null ? JSON.parse(item.imageUrl) : [];
          item.isLike = isLike.length > 0 ? true : false;
          item.totalComments = totalComments;
          item.totalViews =
            totalViewsOnPost.length > 0 ? totalViewsOnPost.length : 0;
          item.totalShare = 0;
          item.userId = item.userId;
          item.fullName = userData[0].fullName;
          item.profile = userData[0].profileImage
            ? userData[0].profileImage
            : null;
          item.tagPeople = tagPeople;
          return item;
        })
      );
      fetchThereOwnPost = fetchThereOwnPost;
      return handleSuccess(
        res,
        200,
        Msg.postFoundSuccessfull,
        fetchThereOwnPost
      );
    } else {
      return handleError(res, 400, Msg.postNotFound, []);
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

function positionBoostedPosts(posts, startPosition = 3) {
  // Separate boosted and non-boosted posts
  const boosted = posts.filter((post) => post.is_boost === 1);
  const nonBoosted = posts.filter((post) => post.is_boost !== 1);

  const result = [];
  let boostIndex = 0;
  let regularIndex = 0;

  // Determine the interval between boosted posts
  const interval = startPosition;

  for (let i = 0; i < posts.length; i++) {
    // Place boosted posts at the specified interval positions
    if ((i + 1) % interval === 0 && boostIndex < boosted.length) {
      result.push(boosted[boostIndex++]);
    } else if (regularIndex < nonBoosted.length) {
      result.push(nonBoosted[regularIndex++]);
    } else if (boostIndex < boosted.length) {
      // If we run out of regular posts, add remaining boosted
      result.push(boosted[boostIndex++]);
    }
  }

  return result;
}

// Example usage with your data array and starting at position 2

export const retriveOtherUsersPost = async (req, res) => {
  try {
    let { id, location } = req.user;
    let { visitType, limit = 10, offset = 0 } = req.query; // 'first', 'second', 'random'
    // visitType = visitType ? visitType : 5
    let fetchOthersPost = await fetchOtherPostModel(
      Number(limit),
      Number(offset)
    );
    if (fetchOthersPost.length > 0) {
      let isFollower = false;
      let fetchFollowingId = await retrieveMyFollowing(id);
      const followingIds = fetchFollowingId.map((i) => i.followingId);
      fetchOthersPost = await Promise.all(
        fetchOthersPost.map(async (item) => {
          // if (item.audiance === mediaTypes.EVERYONE || item.audiance === 'Followers' || followingIds.includes(item.userId)) {
          if (item.userId === id || item.audiance === mediaTypes.EVERYONE || (item.audiance === mediaTypes.FOLLOWERS && followingIds.includes(item.userId))) {
            if (item.audiance === mediaTypes.EVERYONE) {
              let listOfFollowers = await isUsersFollowToAnotherUsers(
                id,
                item.userId
              );
              isFollower =
                Array.isArray(listOfFollowers) && listOfFollowers.length > 0;
            } else {
              isFollower = true;
            }
            if (item.audiance === mediaTypes.EVERYONE && item.userId === id) {
              isFollower = true;
            }
            let isSelfPost = false;
            if (item.userId == id) {
              isSelfPost = true;
            }
            item.imageUrl =
              item.imageUrl != null ? JSON.parse(item.imageUrl) : [];
            item.isFollower = isFollower;
            item.isSelfPost = isSelfPost;
            let tagPeople = [];
            let tagsPeople = item.tagPeople
              ? typeof item.tagPeople === "string"
                ? JSON.parse(item.tagPeople)
                : item.tagPeople
              : []; // Ensure it's an array

            if (Array.isArray(tagsPeople) && tagsPeople.length > 0) {
              tagPeople = await Promise.all(
                tagsPeople.map(async (i) => ({
                  userId: i,
                  userDetails: await fetchUsersById(i),
                }))
              );
            }
            let postId = item.id;
            let totalComments = 0;
            let fetchCommentsByPostId = await fetchCommentAccordingToPostId(
              postId
            );
            if (fetchCommentsByPostId.length > 0) {
              let fetchTotalPostComments = fetchCommentsByPostId.length;
              let totalNestedComments = 0;
              fetchCommentsByPostId = await Promise.all(
                fetchCommentsByPostId.map(async (comment) => {
                  let nestedComments =
                    await fetchCommentAccordingToParentCommentId(comment.id);
                  comment.fetchNestedComments = nestedComments.length;
                  totalNestedComments += nestedComments.length;
                  return comment;
                })
              );
              totalComments = fetchTotalPostComments + totalNestedComments;
            }
            let totalViewsOnPost = await fetchTotalViewsOnPost(postId);
            let isLike = await fetchUsersLikeToPostDataByUsersId(id, postId);
            let userData = await fetchUsersById(item.userId);
            let fetchAllLikePosts = await fetchLikeOnParticularPost(postId);
            item.totalLikes =
              fetchAllLikePosts.length > 0 ? fetchAllLikePosts.length : 0;
            item.isLike = isLike.length > 0 ? true : false;
            item.totalComments = totalComments;
            item.totalViews =
              totalViewsOnPost.length > 0 ? totalViewsOnPost.length : 0;
            item.totalShare = item.totalShared;
            item.userId = item.userId;
            item.fullName = userData[0].fullName;
            item.profile = userData[0].profileImage
              ? userData[0].profileImage
              : null;
            item.tagPeople = tagPeople;
            item.isViewed = false;
            item.videoDuration = item.videoDuration;

            return item;
          }
          return null;
        })
      );
      let result = await fetchBlockedListUsers(id);
      let blockedToIds =
        result.length > 0 ? result.map((user) => user.blocked_to) : [];
      fetchOthersPost = fetchOthersPost.filter((item) => {
        return item && !blockedToIds.includes(Number(item.userId));
      });
      // fetchOthersPost = fetchOthersPost.filter(Boolean);

      //  ----------------------------------------update search algoritham---------------------------//
      if (visitType == 1) {
        fetchOthersPost.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      // else if (visitType === 2) {
      //     const userLocation = location;
      //     const userLat = userLocation[0];
      //     const userLong = userLocation[1];

      //     const haversineDistance = (lat1, lon1, lat2, lon2) => {
      //         const toRad = (value) => (value * Math.PI) / 180;
      //         const R = 6371;
      //         const dLat = toRad(lat2 - lat1);
      //         const dLon = toRad(lon2 - lon1);
      //         const a =
      //             Math.sin(dLat / 2) ** 2 +
      //             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      //             Math.sin(dLon / 2) ** 2;
      //         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      //         return R * c;
      //     };
      //     fetchOthersPost = fetchOthersPost.filter(p => Array.isArray(p.location) && p.location.length === 2);
      //     fetchOthersPost.sort((a, b) => {
      //         const distA = haversineDistance(userLat, userLong, a.location[0], a.location[1]);
      //         const distB = haversineDistance(userLat, userLong, b.location[0], b.location[1]);
      //         return distA - distB;
      //     });
      // }
      else {
        for (let i = fetchOthersPost.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [fetchOthersPost[i], fetchOthersPost[j]] = [
            fetchOthersPost[j],
            fetchOthersPost[i],
          ];
        }
      }
      fetchOthersPost = positionBoostedPosts(fetchOthersPost, 3);

      // ------------------------------------------end of code-------------------------------------//
    }
    return handleSuccess(
      res,
      200,
      fetchOthersPost.length > 0 ? Msg.postFoundSuccessfull : Msg.postNotFound,
      fetchOthersPost
    );
  } catch (error) {
    console.error(error.message);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const likePost = async (req, res) => {
  try {
    let { postId } = req.query;
    let { id, fullName, profileImage } = req.user;
    let fetchUsersLikeEntryData = await fetchUsersLikeToPostDataByUsersId(
      id,
      postId
    );
    if (fetchUsersLikeEntryData.length > 0) {
      await UsersUnLikeToPost(fetchUsersLikeEntryData[0].id);
      return handleSuccess(res, 200, Msg.unLikePost);
    }
    let data = {
      userId: id,
      postId,
    };
    let userLikeEntry = await addUserLikeToPost(data);
    if (userLikeEntry.insertId == 0) {
      return handleError(res, 400, Msg.insertError);
    }

    let fetchPostUserId = await fetchUsersByPostId(data.postId);
    if (fetchPostUserId[0].userId !== id) {
      let userData = await fetchUsersById(fetchPostUserId[0].userId);
      let usersfetchFcmToken = userData[0].fcmToken;
      let userId = userData[0].id;
      let followId = null;
      let notificationType = NotificationTypes.LIKES_NOTIFICATION;
      let notificationSend = "likedPost";
      let postId = data.postId;
      let message = await createNotificationMessage({
        notificationSend,
        fullName,
        id,
        userId,
        followId,
        usersfetchFcmToken,
        notificationType,
        postId,

        profileImage,
      });
      // let message = await createNotificationMessage({ notificationSend, fullName, id, userId, followId, fetchFcmToken: { fcmToken: usersfetchFcmToken }, notificationType });
      await sendNotification(message, postId);
    }
    return handleSuccess(res, 200, Msg.likePost);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const userViewsPost = async (req, res) => {
  try {
    let { postId } = req.body;
    let { id } = req.user;
    let data = {
      userId: id,
      postId,
    };
    let isExist = await isAllreadyUserViewThePost(id, postId);
    if (isExist.length > 0) {
      return handleSuccess(res, 200, Msg.dataAddedSuccessfull);
    } else {
      let userLikeEntry = await userViewOtherPost(data);
      if (userLikeEntry.insertId == 0) {
        return handleError(res, 400, Msg.insertError);
      }
    }
    return handleSuccess(res, 200, Msg.dataAddedSuccessfull);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

// --------------------------------start s3 code-----------------------------------------//

export const createPostByUsers = async (req, res) => {
  try {
    let { id, fullName } = req.user;
    let {
      captions,
      hasTags,
      location,
      audiance,
      mediaType,
      tagPeople,
      isStory,
      videoDuration,
    } = req.body;
    let tagsPeople = tagPeople ? JSON.parse(tagPeople) : null;
    let hasTag = hasTags ? JSON.parse(hasTags) : null;
    let videoUrl = null;
    let imageUrls = [];
    let videoThumbnails = null;
    if (!req.files || !req.files.media) {
      return res.status(400).json({ error: Msg.noFilesUploaded });
    }
    let mediaFiles = req.files.media;
    const videoFile = mediaFiles.find((file) =>
      file.contentType.startsWith("video/")
    );
    const imageFiles = mediaFiles.filter((file) =>
      file.contentType.startsWith("image/")
    );
    if (videoFile) {
      videoUrl = getPublicUrl(videoFile.key);
      let videoThumbnail = req.files.videoThumbnail;
      videoThumbnails = getPublicUrl(videoThumbnail[0]?.key);
    }
    if (imageFiles?.length > 0) {
      imageUrls = imageFiles.map((file) => getPublicUrl(file?.key));
    }
    let data = {
      userId: id,
      videoUrl,
      videoThumbnail: videoThumbnails,
      imageUrl:
        imageUrls.length > 0 ? JSON.stringify(imageUrls) : JSON.stringify([]),
      captions,
      hasTags: JSON.stringify(hasTag),
      location,
      tagPeople: JSON.stringify(tagsPeople),
      audiance,
      mediaType,
      videoDuration,
    };
    let userLikeEntry;
    if (isStory) {
      if (tagsPeople && tagsPeople.length > 0) {
        let storyId = await insertUsersStoriesModel(data);
        await Promise.all(
          tagsPeople.map(async (item) => {
            let userData = await fetchUsersById(item);
            let usersfetchFcmToken = userData[0].fcmToken;
            let userId = userData[0].id;
            let followId = storyId.insertId;
            let notificationType = NotificationTypes.STORY_MENTIONED;
            let notificationSend = "mentionedInStory";
            let postId = storyId.insertId;
            let obj = {
              story_id: storyId.insertId,
              mentioned_by_id: id,
              mentioned_user_id: userId,
            };
            await insertMentionedUserData(obj);
            await insertMentionedStoriesData(obj);
            let message = await createNotificationMessage({
              notificationSend,
              fullName,
              id,
              userId,
              followId,
              usersfetchFcmToken,
              notificationType,
              postId,
            });
            await sendNotification(message, postId);
          })
        );
        return handleSuccess(res, 200, Msg.STORY_ADDED_SUCCESSFULLY);
      } else {
        await insertUsersStoriesModel(data);
        return handleSuccess(res, 200, Msg.STORY_ADDED_SUCCESSFULLY);
      }
    } else {
      userLikeEntry = await createNewPosts(data);
      if (tagsPeople && tagsPeople.length > 0) {
        await Promise.all(
          tagsPeople.map(async (item) => {
            let userData = await fetchUsersById(item);
            let usersfetchFcmToken = userData[0].fcmToken;
            let userId = userData[0].id;
            let followId = userLikeEntry.insertId;
            let notificationType = NotificationTypes.STORY_TAGGED;
            let notificationSend = "taggedInPost";
            let postId = userLikeEntry.insertId;
            let obj = {
              postId: postId,
              mentioned_by_id: id,
              mentioned_user_id: userId,
            };
            await insertMentionedUserData(obj);
            let message = await createNotificationMessage({
              notificationSend,
              fullName,
              id,
              userId,
              followId,
              usersfetchFcmToken,
              notificationType,
              postId,
            });
            await sendNotification(message, postId);
          })
        );
      }
    }
    if (userLikeEntry.insertId == 0) {
      return handleError(res, 400, Msg.insertError);
    }
    return handleSuccess(res, 200, Msg.postCreate);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

// --------------------------------end s3 code------------------------------------------//

// export const createPostByUsers = async (req, res) => {
//     try {
//         let { id } = req.user
//         let { captions, hasTags, location, audiance, mediaType, tagPeople } = req.body
//         let tagsPeople = tagPeople ? JSON.parse(tagPeople) : null
//         let hasTag = hasTags ? JSON.parse(hasTags) : null
//         let videoUrl = null;
//         let imageUrls = [];
//         let videoThumbnail = null;
//         if (!req.files || !req.files.media) {
//             return res.status(400).json({ error: Msg.noFilesUploaded });
//         }

//         let mediaFiles = Array.isArray(req.files.media) ? req.files.media : [req.files.media];
//         const isImage = (file) => {
//             return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.originalname);
//         };
//         const isVideo = (file) => {
//             return /\.(mp4|mov|avi|mkv|flv|wmv|webm)$/i.test(file.originalname);
//         };

//         const videoFile = mediaFiles.find((file) => isVideo(file));
//         const imageFiles = mediaFiles.filter((file) => isImage(file));
//         if (videoFile) {
//             videoUrl = `${baseurl}/profile/${videoFile.filename}`;
//         }
//         if (imageFiles.length > 0) {
//             imageUrls = imageFiles.map((file) => `${baseurl}/profile/${file.filename}`);
//         }
//         let data = {
//             userId: id,
//             videoUrl,
//             videoThumbnail,
//             imageUrl: imageUrls.length > 0 ? JSON.stringify(imageUrls) : JSON.stringify([]),
//             captions,
//             hasTags: JSON.stringify(hasTag),
//             location,
//             tagPeople: JSON.stringify(tagsPeople),
//             audiance,
//             mediaType,
//         }
//         let userLikeEntry = await createNewPosts(data);
//         if (userLikeEntry.insertId == 0) {
//             return handleError(res, 400, Msg.insertError);
//         }
//         return handleSuccess(res, 200, Msg.postCreate);
//     } catch (error) {
//         return handleError(res, 500, Msg.internalServerError);
//     }
// };

// export const createPostByUsers = async (req, res) => {
//     try {
//         let { id } = req.user;
//         let { captions, hasTags, location, audiance, mediaType, tagPeople } = req.body;

//         let tagsPeople = tagPeople ? JSON.parse(tagPeople) : null;
//         let hasTag = hasTags ? JSON.parse(hasTags) : null;
//         let videoUrl = null;
//         let imageUrl = [];
//         if (req.files) {  // Handle multiple files
//             req.files.forEach(file => {
//                 let mediaUrl = `${baseurl}/profile/${file.filename}`;
//                 if (mediaType === mediaTypes.VIDEO) {
//                     videoUrl = mediaUrl;  // Only one video allowed
//                 } else {
//                     imageUrl.push(mediaUrl); // Store multiple images
//                 }
//             });
//         }
//         let data = {
//             userId: id,
//             videoUrl,
//             imageUrl: imageUrl.length > 0 ? JSON.stringify(imageUrl) : null, // Convert array to string
//             captions,
//             hasTags: JSON.stringify(hasTag),
//             location,
//             tagPeople: JSON.stringify(tagsPeople),
//             audiance,
//             mediaType,
//         };

//         let userLikeEntry = await createNewPosts(data);
//         if (userLikeEntry.insertId == 0) {
//             return handleError(res, 400, Msg.insertError);
//         }

//         return handleSuccess(res, 200, Msg.postCreate);
//     } catch (error) {
//         return handleError(res, 500, Msg.internalServerError);
//     }
// };

// export const createPostByUsers = async (req, res) => {
//     try {
//         let { id } = req.user
//         let { captions, hasTags, location, audiance, mediaType, tagPeople } = req.body
//         let tagsPeople = tagPeople ? JSON.parse(tagPeople) : null
//         let hasTag = hasTags ? JSON.parse(hasTags) : null
//         let media;
//         let videoUrl = null;
//         let imageUrl = null;
//         if (req.file) {
//             media = req.file && req.file.filename;
//         }
//         const mediaUrl = `${baseurl}/profile/${media}`;
//         if (mediaType === mediaTypes.VIDEO) {
//             videoUrl = mediaUrl;
//         } else {
//             imageUrl = mediaUrl;
//         }

//         let data = {
//             userId: id,
//             videoUrl,
//             imageUrl,
//             captions,
//             hasTags: JSON.stringify(hasTag),
//             location,
//             tagPeople: JSON.stringify(tagsPeople),
//             audiance,
//             mediaType,
//         }
//         let userLikeEntry = await createNewPosts(data);
//         if (userLikeEntry.insertId == 0) {
//             return handleError(res, 400, Msg.insertError);
//         }
//         return handleSuccess(res, 200, Msg.postCreate);
//     } catch (error) {
//         return handleError(res, 500, Msg.internalServerError);
//     }
// };

// --------------------------------------------end of normal public code--------------------------//

// export const fetchUsersNotifications = async (req, res) => {
//   try {
//     let { id } = req.user;
//     await readAllNotificatonByUserId(id);
//     let notificationList = await fetchUsersNotificationByUsersId(id);
//     if (notificationList.length > 0) {
//       notificationList = await Promise.all(
//         notificationList.map(async (item) => {
//           let userData= await fetchUsersById(item.sendFrom)
//           item.profileImage = userData[0].profileImage;
//           return item;
//         })
//       );
//       return handleSuccess(
//         res,
//         200,
//         Msg.notificationFetchSuccessfully,
//         notificationList
//       );
//     } else {
//       return handleError(res, 400, Msg.notificationFailedToFetch, []);
//     }
//   } catch (error) {
//     return handleError(res, 500, Msg.internalServerError);
//   }
// };

export const fetchUsersNotifications = async (req, res) => {
  try {
    let { id } = req.user
    await readAllNotificatonByUserId(id)
    let notificationList = await fetchUsersNotificationByUsersId(id)
    if (notificationList.length > 0) {
      notificationList = await Promise.all(
        notificationList.map(async (item) => {
          let profileImage = null;
          const userData = await fetchUsersById(item.sendFrom);
          if (userData && userData.length > 0) {
            profileImage = userData[0].profileImage ?? null;
          } else {
            const sellerData = await getSellerDetailsBySeller_d(item.sendFrom);
            if (sellerData && sellerData.length > 0) {
              profileImage = sellerData[0].businesslogo ?? null;
            }
          }
          return { ...item, profileImage };
        })
      );
      return handleSuccess(res, 200, Msg.notificationFetchSuccessfully, notificationList);
    } else {
      return handleError(res, 400, Msg.notificationFailedToFetch, []);
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    let { id } = req.user;
    let getAllUsers = await fetchAllUsersModel(id);
    if (getAllUsers.length > 0) {
      getAllUsers = await Promise.all(
        getAllUsers.map(async (item) => {
          let isBlockedUsers = await fetchBlockedByUsersIdAndCurrentUserLogin(
            id,
            item.id
          );
          let isFollower = await isUsersFollowToAnotherUsers(id, item.id);
          let fetchMyFolowers = await retrieveMyFollowers(item.id);
          item.profileImage =
            item.profileImage != null ? item.profileImage : null;
          item.fetchMyFolowers =
            fetchMyFolowers.length > 0 ? fetchMyFolowers.length : 0;
          item.isFollower = isFollower.length > 0 ? true : false;
          item.isBlocked = isBlockedUsers.length > 0 ? true : false;
          return item;
        })
      );
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, getAllUsers);
    } else {
      return handleError(res, 400, Msg.dataNotFound, []);
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const accountDelete = async (req, res) => {
  try {
    let { id } = req.user;
    let accountDeletedByUserId = await accountDeleteModel(id);
    if (accountDeletedByUserId.affectedRows == 0) {
      return handleError(res, 400, Msg.accountNotDelete);
    }
    return handleSuccess(res, 200, Msg.accountDeleteSuccessfull);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const commentOnPost = async (req, res) => {
  try {
    let { id, fullName, profileImage } = req.user;
    let { postId, comments, parentCommentId } = req.body;
    let postIds = null;
    let parentCommentIds = null;
    if (postId) {
      postIds = postId;
    } else {
      parentCommentIds = parentCommentId;
    }
    let data = {
      userId: id,
      postId: postIds,
      parentCommentId: parentCommentIds,
      comments,
    };
    let userLikeEntry = await addCommentsOnParticularPost(data);
    if (userLikeEntry.insertId == 0) {
      return handleError(res, 400, Msg.insertError);
    }
    let fetchPostUserId = await fetchUsersByPostId(data.postId);
    if (fetchPostUserId[0].userId !== id) {
      let userData = await fetchUsersById(fetchPostUserId[0].userId);
      let usersfetchFcmToken = userData[0]?.fcmToken || "";
      let userId = userData[0].id;
      let followId = null;
      let notificationType = NotificationTypes.COMMENTS_NOTIFICATION;
      let notificationSend = "commentsOnPost";
      let message = await createNotificationMessage({
        notificationSend,
        fullName,
        id,
        userId,
        followId,
        usersfetchFcmToken,
        notificationType,
        postId,

        profileImage,
      });
      await sendNotification(message, postId);
    }
    return handleSuccess(res, 200, Msg.commentsPostedSuccessfull);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchCommentAndNestedCommentsOnPost = async (req, res) => {
  try {
    let { id } = req.user;
    let { postId, parentCommentId } = req.query;
    let details;
    if (postId) {
      details = await fetchCommentAccordingToPostId(postId);
    } else {
      details = await fetchCommentAccordingToParentCommentId(parentCommentId);
    }
    if (details.length == 0) {
      return handleError(res, 200, Msg.dataNotFound, []);
    }
    details = await Promise.all(
      details.map(async (item) => {
        let fetchNestedComments;
        if (postId) {
          fetchNestedComments = await fetchCommentAccordingToParentCommentId(
            item.id
          );
        } else {
          fetchNestedComments = [];
        }
        let userData = await fetchUsersById(item.userId);
        item.profileImage =
          userData[0].profileImage != null ? userData[0].profileImage : null;
        item.fullName = userData[0].fullName;
        item.userName = userData[0].userName;
        item.itsHaveChildReplies =
          fetchNestedComments.length > 0 ? true : false;
        item.isOwnComment = item.userId == id ? true : false;
        return item;
      })
    );
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, details);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const likeOnPostComments = async (req, res) => {
  try {
    let { id } = req.user;
    let { commentId } = req.body;
    let ifAllreadyLikeOnComments = await fetchLikeOnPostCommentedByUsersId(
      commentId,
      id
    );
    if (ifAllreadyLikeOnComments.length > 0) {
      await UsersUnLikeToCommentedPost(ifAllreadyLikeOnComments[0].id);
      return handleSuccess(res, 200, Msg.removeLikeCommentsOnPost);
    }
    let data = {
      commentId: commentId,
      userId: id,
    };
    let userLikeEntry = await addLikesOnParticularCommentPost(data);
    if (userLikeEntry.insertId == 0) {
      return handleError(res, 400, Msg.insertError);
    }
    return handleSuccess(res, 200, Msg.likeOnComments);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const notificationAndAnnoucmetOnOffByUserId = async (req, res) => {
  try {
    let { id } = req.user;
    let { toggleType } = req.body;
    let isUsersExists = await fetchUsersById(id);
    let status = variableTypes.OFF;
    if (toggleType == variableTypes.NOTIFICATION) {
      let isNotificationOn;
      if (isUsersExists[0].pushNotifications == 1) {
        isNotificationOn = await pushNotificationOff(id);
        status = variableTypes.OFF;
      } else {
        isNotificationOn = await pushNotificationOn(id);
        status = variableTypes.ON;
      }
      return handleSuccess(res, 200, `${Msg.notification}${status}`);
    } else if (toggleType == variableTypes.GIVEAWAYANNOUCMENT) {
      let giveAwayAnnoucments;
      if (isUsersExists[0].giveAwayAnnoucment == 1) {
        status = variableTypes.OFF;
        giveAwayAnnoucments = await giveAwayAnnoucmentOff(id);
      } else {
        status = variableTypes.ON;
        giveAwayAnnoucments = await giveAwayAnnoucmentOn(id);
      }
      return handleSuccess(res, 200, `${Msg.giveawayAnnoucment}${status}`);
    } else {
      return handleError(res, 400, Msg.wrongToggleType);
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchNotificationAndAnnoucmetOnOffByUserId = async (req, res) => {
  try {
    let { id } = req.user;
    let userDeatils = await fetchUsersById(id);
    let data = {
      pushNotifications: userDeatils[0].pushNotifications,
      giveAwayAnnoucment: userDeatils[0].giveAwayAnnoucment,
    };
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const deletePostsComments = async (req, res) => {
  try {
    let { id } = req.user;
    let { commentId } = req.body;
    let isDeletePostsComments = await deletePostByCommentsId(commentId);
    if (isDeletePostsComments.affectedRows == 0) {
      return handleError(res, 400, Msg.failedToCommentsDelete);
    }
    return handleSuccess(res, 200, Msg.deleteCommentsSuccessfully);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchPostByPostId = async (req, res) => {
  try {
    let { id } = req.user;
    let { postId } = req.query;
    let fetchPostDetailsByPostId = await fetchUsersByPostId(postId);
    if (!fetchPostDetailsByPostId || fetchPostDetailsByPostId.length === 0) {
      return handleError(res, 400, Msg.postNotFound);
    }
    if (fetchPostDetailsByPostId.length > 0) {
      let isFollower = false;
      let fetchFollowingId = await retrieveMyFollowing(id);
      const followingIds = fetchFollowingId.map((i) => i.followingId);
      fetchPostDetailsByPostId = await Promise.all(
        fetchPostDetailsByPostId.map(async (item) => {
          // if (item.audiance === mediaTypes.EVERYONE || followingIds.includes(item.userId)) {
          if (item.audiance === mediaTypes.EVERYONE || item.audiance === mediaTypes.FOLLOWERS || followingIds.includes(item.userId)) {
            if (item.audiance === mediaTypes.EVERYONE) {
              let listOfFollowers = await isUsersFollowToAnotherUsers(id, item.userId);
              isFollower = Array.isArray(listOfFollowers) && listOfFollowers.length > 0;
            } else {
              isFollower = true;
            }
            if (item.userId === id) {
              isFollower = true;
            }
            let isSelfPost;
            if (item.userId == id) {
              isSelfPost = true;
            } else {
              isSelfPost = false;
            }
            item.isFollower = isFollower;
            item.isSelfPost = isSelfPost;
            let tagPeople = [];
            let tagsPeople = item.tagPeople
              ? typeof item.tagPeople === "string"
                ? JSON.parse(item.tagPeople)
                : item.tagPeople
              : []; // Ensure it's an array

            if (Array.isArray(tagsPeople) && tagsPeople.length > 0) {
              tagPeople = await Promise.all(
                tagsPeople.map(async (i) => ({
                  userId: i,
                  userDetails: await fetchUsersById(i),
                }))
              );
            }
            let postId = item.id;
            let totalComments = 0;
            let fetchCommentsByPostId = await fetchCommentAccordingToPostId(
              postId
            );
            if (fetchCommentsByPostId.length > 0) {
              let fetchTotalPostComments = fetchCommentsByPostId.length;
              let totalNestedComments = 0;
              fetchCommentsByPostId = await Promise.all(
                fetchCommentsByPostId.map(async (comment) => {
                  let nestedComments =
                    await fetchCommentAccordingToParentCommentId(comment.id);
                  comment.fetchNestedComments = nestedComments.length;
                  totalNestedComments += nestedComments.length;
                  return comment;
                })
              );
              totalComments = fetchTotalPostComments + totalNestedComments;
            }
            let totalViewsOnPost = await fetchTotalViewsOnPost(postId);
            let isLike = await fetchUsersLikeToPostDataByUsersId(id, postId);
            let userData = await fetchUsersById(item.userId);
            let fetchAllLikePosts = await fetchLikeOnParticularPost(postId);
            item.totalLikes =
              fetchAllLikePosts.length > 0 ? fetchAllLikePosts.length : 0;
            item.isLike = isLike.length > 0 ? true : false;
            item.totalComments = totalComments;
            item.totalViews =
              totalViewsOnPost.length > 0 ? totalViewsOnPost.length : 0;
            item.totalShare = 0;
            item.userId = item.userId;
            item.fullName = userData[0].fullName;
            item.profile = userData[0].profileImage
              ? userData[0].profileImage
              : null;
            item.tagPeople = tagPeople;
            item.imageUrl = JSON.parse(item.imageUrl);

            return item;
          }
          return null;
        })
      );
      fetchPostDetailsByPostId = fetchPostDetailsByPostId.filter(Boolean);
    }
    return handleSuccess(res, 200, fetchPostDetailsByPostId.length > 0 ? Msg.postFoundSuccessfull : Msg.postNotFound, fetchPostDetailsByPostId);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    let { id } = req.user;
    let isDeletePostsComments = await deleteAllNotificationOfGivenUsers(id);
    if (isDeletePostsComments.affectedRows == 0) {
      return handleError(res, 400, Msg.notificationsDeleteFailed);
    }
    return handleSuccess(res, 200, Msg.notificationDeleted);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const deleteNotificationsById = async (req, res) => {
  try {
    let { notificationId } = req.params;
    let isDeletePostsComments = await deleteNotificationByIds(notificationId);
    if (isDeletePostsComments.affectedRows == 0) {
      return handleError(res, 400, Msg.notificationsDeleteFailed);
    }
    return handleSuccess(res, 200, Msg.notificationDeleted);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

// --------------------s3 start code----------------------------------------//

export const deletePostsById = async (req, res) => {
  try {
    let { postId } = req.params;
    let post = await fetchUsersByPostId(postId);
    let { videoUrl, imageUrl } = post[0];
    if (videoUrl) await deleteFromS3(videoUrl);
    if (imageUrl) {
      let imageArray = JSON.parse(imageUrl);
      for (let img of imageArray) {
        await deleteFromS3(img);
      }
    }
    let isDeletePosts = await deletePostByIds(postId);
    if (isDeletePosts.affectedRows == 0) {
      return handleError(res, 400, Msg.postNotDeleted);
    }
    return handleSuccess(res, 200, Msg.postDeleted);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

// ----------------------------s3 end code ----------------------------------//

// export const deletePostsById = async (req, res) => {
//     try {
//         let { postId } = req.params;
//         let isDeletePosts = await deletePostByIds(postId)
//         if (isDeletePosts.affectedRows == 0) {
//             return handleError(res, 400, Msg.postNotDeleted);
//         }
//         return handleSuccess(res, 200, Msg.postDeleted);
//     } catch (error) {
//         return handleError(res, 500, Msg.internalServerError);
//     }
// };

export const editPostById = async (req, res) => {
  try {
    let { postId } = req.params;
    const result = await updateUsersPostsById(req.body, postId);
    if (result.affectedRows) {
      return handleSuccess(res, 200, Msg.postUpdateSucessfully, result);
    }
    return handleError(res, 400, Msg.postFailedToUpdate);
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const contactToSupports = async (req, res) => {
  try {
    let { fullName, id } = req.user;
    let { sendFrom, email, phoneNumber, message, categoryId } = req.body;
    let data;
    if (sendFrom == 1) {
      let userEmail = req.user.email;
      data = {
        email: userEmail,
        phoneNumber,
        message,
        businessName: null,
        categoryId: categoryId,
        user_id: id,
      };
    } else {
      let fetchsellerDetails = await fetchSellerInfoById(id);
      data = {
        email: email,
        message,
        phoneNumber,
        businessName: fetchsellerDetails[0].businessName,
        categoryId: null,
        user_id: id,
      };
    }
    let adminId = await fetchAdmin();
    let usersfetchFcmToken = adminId[0]?.fcmToken || "";
    let userId = adminId[0].id;
    let followId = null;
    let postId = null;
    let notificationType =
      NotificationTypes.SEND_CONTACT_TO_SUPPORT_NOTIFICATIONS;
    let notificationSend = "sendContactToSupportsNotification";
    let messag = await createNotificationMessage({
      notificationSend,
      fullName,
      id,
      userId,
      followId,
      usersfetchFcmToken,
      notificationType,
      postId,
    });
    await sendNotification(messag, postId);
    await insertUsersSupports(data);
    await sendUserSupportEmail({ fullName, data, res });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

// ------- Cart ------- // # Abhay
// export const addProductToCart = async (req, res) => {
//   try {
//     const { product_id } = req.body;
//     const user = req.user;
//     const product_data = await getProductDetailsId(product_id);
//     if (product_data?.length == 0) {
//       return handleError(res, StatusCode.status400, Msg.PRODUCT_NOT_AVAILABLE);
//     }
//     if (product_data[0]?.stock_quantity == 0) {
//       return handleError(res, StatusCode.status400, Msg.OUT_OF_STOCK);
//     }
//     const seller_details = await getSellerDetailsByUserId(user?.id);
//     if (product_data[0]?.seller_id == seller_details[0]?.id) {
//       return handleError(res, StatusCode.status400, Msg.USER_Cart_Error);
//     }
//     const already_in_cart = await checkAvailableProductModel(
//       product_id,
//       user?.id
//     );
//     if (already_in_cart?.length > 0) {
//       return handleError(
//         res,
//         StatusCode.status400,
//         Msg.Product_Already_In_Cart
//       );
//     }
//     const data = {
//       pId: product_id,
//       user_id: user?.id,
//       quantity: 1,
//     };
//     const add_to_cart = await addProductToCartModal(data);
//     if (add_to_cart.affectedRows > 0) {
//       return handleSuccess(res, StatusCode.status201, Msg.ADD_PRODUCT_To_Cart);
//     } else {
//       return handleError(res, StatusCode.status400, Msg.Cart_Added_Error);
//     }
//   } catch (err) {
//     return handleError(res, StatusCode.status500, Msg.internalServerError);
//   }
// };

// export const updateCartData = async (req, res) => {
//   try {
//     const { product_id, quantity } = req.body;
//     const user = req.user;
//     const product_data = await getProductDetailsId(product_id);
//     const already_in_cart = await checkAvailableProductModel(
//       product_id,
//       user?.id
//     );
//     if (product_data?.length == 0) {
//       return handleError(res, StatusCode.status400, Msg.PRODUCT_NOT_AVAILABLE);
//     }
//     if (already_in_cart?.length == 0) {
//       return handleError(res, StatusCode.status400, Msg.NO_PRODUCT_IN_CART);
//     }
//     if (quantity == "Inc") {
//       if (product_data[0]?.stock_quantity == 0) {
//         return handleError(res, StatusCode.status400, Msg.OUT_OF_STOCK);
//       }
//       const cart_data = {
//         quantity: already_in_cart[0]?.quantity + 1,
//       };
//       const update_cart = await updateCartDataModel(
//         cart_data,
//         already_in_cart[0]?.id,
//         product_id
//       );
//       if (update_cart.affectedRows > 0) {
//         return handleSuccess(res, StatusCode.status200, Msg.CART_UPDATED);
//       } else {
//         return handleError(res, StatusCode.status400, Msg.CART_UPDATED_ERROR);
//       }
//     } else {
//       if (already_in_cart[0]?.quantity == 1) {
//         const delete_cart_product = await deleteCartProductByIdModal(
//           already_in_cart[0]?.id
//         );
//         if (delete_cart_product.affectedRows > 0) {
//           return handleSuccess(res, StatusCode.status200, Msg.CART_UPDATED);
//         } else {
//           return handleError(res, StatusCode.status400, Msg.CART_UPDATED_ERROR);
//         }
//       } else {
//         const cart_data = {
//           quantity: already_in_cart[0]?.quantity - 1,
//         };
//         const update_cart = await updateCartDataModel(
//           cart_data,
//           already_in_cart[0]?.id,
//           product_id
//         );
//         return handleSuccess(res, StatusCode.status200, Msg.CART_UPDATED);
//       }
//     }
//   } catch (err) {
//     return handleError(res, StatusCode.status500, Msg.internalServerError);
//   }
// };

// export const getUserCartData = async (req, res) => {
//   try {
//     const user = req.user;
//     const cart_data = await getAllCartProductModel(user.id);
//     const data12 = [];
//     let total_payment = 0;
//     let shipping_charge = 0;
//     await Promise.all(
//       cart_data?.map(async (item, i) => {
//         const data = await getProductDetailsId(item?.pId);
//         if (data?.length != 0) {
//           const images = await getUserProductImagesModal(item?.pId);
//           total_payment = total_payment + data[0]?.final_price * item?.quantity;
//           shipping_charge = shipping_charge + data[0]?.shipping_charges;
//           data12.push({
//             id: item?.id,
//             product_id: data[0]?.pId,
//             availableStock: Number(data[0]?.stock_quantity),
//             product_name: data[0]?.product_name,
//             product_description: data[0]?.product_description,
//             product_category: data[0]?.product_category,
//             quantity: item?.quantity,
//             images: images,
//             final_price: data[0].final_price,
//           });
//           return item;
//         }
//       })
//     );
//     const result = {
//       total: total_payment,
//       shipping_charge: shipping_charge,
//       cart: data12,
//     };
//     return handleSuccess(
//       res,
//       StatusCode.status200,
//       Msg.dataFoundSuccessful,
//       result
//     );
//   } catch (err) {
//     return handleError(res, StatusCode.status500, Msg.internalServerError);
//   }
// };

// export const deleteUserCartData = async (req, res) => {
//   try {
//     const { cart_id } = req.body;
//     const cart_data = await getCartDataByCartIdModal(cart_id);
//     if (cart_data?.length == 0) {
//       return handleError(res, StatusCode.status400, Msg.PRODUCT_NOT_AVAILABLE);
//     }
//     const delete_cart_data = await deleteCartProductByIdModal(cart_id);
//     if (delete_cart_data.affectedRows > 0) {
//       return handleSuccess(res, StatusCode.status200, Msg.CART_DELETE);
//     } else {
//       return handleError(res, StatusCode.status400, Msg.CART_DELETE_ERROR);
//     }
//   } catch (err) {
//     return handleError(res, StatusCode.status500, Msg.internalServerError);
//   }
// };

// Favorites // # Abhay
export const addProductToFavorites = async (req, res) => {
  try {
    const { product_id, status } = req.body;
    const user = req.user;
    const product_data = await getProductDetailsById(product_id);
    if (product_data?.length == 0) {
      return handleError(res, StatusCode.status400, Msg.PRODUCT_NOT_AVAILABLE);
    }
    if (status == 0) {
      const check_product = await getFavorietsProductDetailsById(
        product_id,
        user?.id
      );
      if (check_product?.length) {
        return handleSuccess(res, StatusCode.status200, Msg.ALREADY_FAVORIETS);
      }
      const add_favorites = await addProductToFavoritesModal({
        pId: product_id,
        user_id: user?.id,
      });
      if (add_favorites.affectedRows > 0) {
        return handleSuccess(res, StatusCode.status200, Msg.ADD_FAVORIETS);
      } else {
        return handleError(res, StatusCode.status400, Msg.ADD_FAVORIETS_ERROR);
      }
    } else {
      const update_favorites = await removeProductToFavoritesModel(product_id);
      if (update_favorites.affectedRows > 0) {
        return handleSuccess(res, StatusCode.status200, Msg.REMOVE_FAVORITES);
      } else {
        return handleError(
          res,
          StatusCode.status400,
          Msg.REMOVE_FAVORITES_ERROR
        );
      }
    }
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const getFavoriatesProductList = async (req, res) => {
  try {
    const user = req.user;
    const get_favoriates_list = await getFavoritesProductListModel(user?.id);
    const data = await Promise.all(
      get_favoriates_list?.map(async (item) => {
        const product_check = await checkProductDataByIdModel(item?.pId);
        if (product_check?.length != 0) {
          const product_category = await getProductCategoryByIDModel(
            product_check[0].product_category
          );
          const images = await getUserProductImagesModal(item?.pId);
          item.products = product_check[0];
          product_check[0].images = images;
          product_check[0].product_category =
            product_category[0]?.category_name;
          product_check[0].category_id = product_category[0]?.id;
          return item;
        } else {
          return null;
        }
      })
    );
    const data12 = data?.filter((item) => item !== null);
    return handleSuccess(
      res,
      StatusCode.status200,
      Msg.dataFoundSuccessful,
      data12
    );
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const getFavoriatesProductByID = async (req, res) => {
  try {
    const { product_id } = req.query;
    const get_favoriates_list = await getFavoritesProductBYIDModel(product_id);
    const data = await Promise.all(
      get_favoriates_list?.map(async (item) => {
        const product_check = await getProductDataByIdModal(item?.pId);
        if (product_check?.length != 0) {
          const product_category = await getProductCategoryByIDModel(
            product_check[0].product_category
          );
          const images = await getUserProductImagesModal(item?.pId);
          item.products = product_check[0];
          product_check[0].product_category =
            product_category[0]?.category_name;
          product_check[0].category_id = product_category[0]?.id;
          product_check[0].images = images;
          return item;
        }
      })
    );
    return handleSuccess(
      res,
      StatusCode.status200,
      Msg.dataFoundSuccessful,
      data
    );
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const fetchSupportCategories = async (req, res) => {
  try {
    let fetchCategorySupport = await fetchSupportCategory();
    if (fetchCategorySupport.length == 0) {
      fetchCategorySupport = [];
      return handleError(
        res,
        StatusCode.status400,
        Msg.supportCategoryNotFound,
        fetchCategorySupport
      );
    }
    return handleSuccess(
      res,
      StatusCode.status200,
      Msg.supportCategoryFoundSuccess,
      fetchCategorySupport
    );
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

export const addDeliveryAddress = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      city,
      state,
      zipcode,
      phone_number,
      is_billing_address,
    } = req.body;
    const user = req.user;
    const data = {
      user_id: user?.id,
      name: name,
      email: email,
      address: address,
      city: city,
      state: state,
      zipcode: zipcode,
      phone_number: phone_number,
      is_billing_address: is_billing_address,
    };
    const user_address = await addAddressModel(data);
    if (user_address?.affectedRows > 0) {
      return handleSuccess(res, StatusCode.status201, Msg.ADD_DELIVERY_ADDRESS);
    } else {
      return handleError(
        res,
        StatusCode.status400,
        Msg.ADD_DELIVERY_ADDRESS_ERROR
      );
    }
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const getUserShipplingAdress = async (req, res) => {
  try {
    const user = req.user;
    const get_shipping_list = await getAddressModel(user?.id);
    console.log(get_shipping_list?.length);
    return handleSuccess(
      res,
      StatusCode.status200,
      Msg.supportCategoryFoundSuccess,
      get_shipping_list
    );
  } catch (err) {
    console.log(err);
    return handleError(res, StatusCode.status500, Msg.dataFoundSuccessful);
  }
};

export const isUserOnlineAndOffline = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await updateUsersProfile(req.body, id);

    if (result.affectedRows > 0) {
      return handleSuccess(res, 200, Msg.DATA_UPDATED, result);
    }
    return handleError(res, 400, Msg.DATA_UPDATED_TO_FAILED, []);
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const createChat = async (req, res) => {
  try {
    let { userIds, isGroup, groupName } = req.body;
    const createdBy = req.user.id;
    userIds = Array.isArray(userIds)
      ? userIds.filter((id) => id && Number.isInteger(id))
      : [];
    if (!userIds.includes(createdBy)) {
      userIds.push(createdBy);
    }
    let chat = null;
    let groupImage = null;
    if (!isGroup && userIds.length === 2) {
      const existing = await checkIsUserChatExistsOrNot(userIds[0], userIds[1]);
      if (existing && existing.length > 0) {
        chat = existing[0];
      }
    }
    if (!chat) {
      const result = await createSingleChat(
        isGroup,
        groupName,
        createdBy,
        groupImage
      );
      const chatId = result.insertId;
      console.log("userIds", userIds);

      for (const userId of userIds) {
        await createGroupChat(chatId, userId);
        await createUnreadCount(chatId, userId, 0);
      }
      chat = {
        id: chatId,
        is_group: isGroup,
        chat_name: groupName,
        created_by: createdBy,
        members: userIds,
      };
    }
    return handleSuccess(res, 200, Msg.CHAT_CREATED_SUCCESSFULLY, chat);
  } catch (error) {
    console.error("Create Chat Error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const groupCreateChat = async (req, res) => {
  try {
    let { userIds, isGroup, groupName } = req.body;
    const createdBy = req.user.id;
    let groupImage = req.files.groupImage
      ? getPublicUrl(req.files.groupImage[0].key)
      : null;
    if (typeof userIds === "string") {
      userIds = userIds
        .split(",")
        .map((id) => parseInt(id.trim(), 10))
        .filter(
          (id, index, arr) => Number.isInteger(id) && arr.indexOf(id) === index
        );
    } else if (!Array.isArray(userIds)) {
      userIds = [];
    }

    if (!userIds.includes(createdBy)) {
      userIds.push(createdBy);
    }
    let chat = null;
    if (!chat) {
      const result = await createSingleChat(
        isGroup,
        groupName,
        createdBy,
        groupImage
      );
      const chatId = result.insertId;
      for (const uid of userIds) {
        await createGroupChat(chatId, uid);
        await createUnreadCount(chatId, uid, 0);
      }
      chat = {
        id: chatId,
        is_group: isGroup,
        chat_name: groupName,
        created_by: createdBy,
        members: userIds,
      };
      const io = getIO();
      const userSockets = getUserSockets();
      for (const uid of userIds) {
        const sid = userSockets.get(uid);
        const chats = await getUserChats(uid);
        io.in(uid.toString()).emit("chat_list", chats);
      }
    }
    return handleSuccess(res, 200, "Group created sucessfully", chat);
  } catch (err) {
    console.error("Create Chat Error:", err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const searchUserByUserName = async (req, res) => {
  try {
    let { id } = req.user;
    let { userName } = req.query;
    let user_name = userName.replace(/^@/, "");
    let getUserByUserName = await fetchUsersByUsersName(user_name);
    if (getUserByUserName.length > 0) {
      return handleSuccess(
        res,
        200,
        Msg.dataFoundSuccessful,
        getUserByUserName[0]
      );
    } else {
      return handleError(res, 400, Msg.dataNotFound, []);
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchGroupInfo = async (req, res) => {
  try {
    let { id } = req.user;
    let { groupId } = req.query;
    let getUserByUserName = await fetchGroupInfoByGroupId(groupId);
    if (getUserByUserName.length > 0) {
      getUserByUserName.map((item) => {
        item.isSelf = item.id == id ? true : false;
      });
      let data = {
        groupName: getUserByUserName[0].chat_name,
        groupImage: getUserByUserName[0].groupProfile,
        totalMembers: getUserByUserName.length,
        isOwnGroup: getUserByUserName[0].created_by == id ? true : false,
        members: getUserByUserName,
      };
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
    } else {
      return handleError(res, 400, Msg.dataNotFound, []);
    }
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const removeMembersInGroup = async (req, res) => {
  try {
    let { groupId, id } = req.body;
    await removeMembersModel(groupId, id);
    return handleSuccess(res, 200, "member remove successfully");
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const updateGroupProfileData = async (req, res) => {
  try {
    let { groupName, groupId } = req.body;
    let [isChatExists] = await fetchChatByIds(groupId);
    let groupImg = null;
    if (req.files) {
      if (
        req.files.groupImage &&
        isChatExists.groupProfile &&
        isChatExists.groupProfile != null
      ) {
        await deleteFromS3(isChatExists.groupProfile);
      }
      groupImg = req.files.groupImage
        ? getPublicUrl(req.files.groupImage[0].key)
        : isChatExists.groupProfile;
    }
    let updatedField = { chat_name: groupName, groupProfile: groupImg };
    const result = await updateGroupProfile(updatedField, groupId);
    return handleSuccess(res, 200, Msg.groupUpdatedSuccessfully, result);
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const addMembersInGroup = async (req, res) => {
  try {
    const { groupId, id } = req.body;
    const addedBy = req.user.id;

    // Normalize user IDs input (string or array)
    let userIds = [];
    if (typeof id === "string") {
      userIds = id
        .split(",")
        .map((uid) => parseInt(uid.trim(), 10))
        .filter(
          (uid, index, arr) =>
            Number.isInteger(uid) && arr.indexOf(uid) === index
        );
    } else if (Array.isArray(id)) {
      userIds = id.map((uid) => parseInt(uid)).filter(Number.isInteger);
    }

    const io = getIO();
    const userSockets = getUserSockets();
    const addedByUser = await fetchUsersById(addedBy);
    const addedByName = addedByUser[0]?.fullName || "Someone";

    let latestSystemMessage = null;

    await Promise.all(
      userIds.map(async (userId) => {
        await createGroupChat(groupId, userId);

        const userData = await fetchUsersById(userId);
        const fullName = userData[0]?.fullName || "";
        const fcmToken = userData[0]?.fcmToken;
        const chatDetails = await fetchChatByIds(groupId);

        // Create and send FCM notification
        const notificationMessage = await createNotificationMessage({
          notificationSend: "addInGroup",
          fullName,
          id: userId,
          userId,
          followId: chatDetails[0]?.chat_name || "",
          usersfetchFcmToken: fcmToken,
          notificationType: NotificationTypes.ADD_IN_GROUP_NOTIFICATION,
          postId: groupId,
        });

        notificationMessage.followId = null;
        await sendNotification(notificationMessage, groupId);

        // Emit updated chat list to added user
        const socketId = userSockets.get(userId);
        if (socketId && io.sockets.sockets.get(socketId)) {
          const chats = await getUserChats(userId);
          io.to(socketId).emit("chat_list", chats);
        }
        let is_read = 1;
        // Create and store a system message for this user
        const systemMessageContent = `${addedByName} added ${fullName} to the group`;
        const saveResult = await saveSystemMessage(
          groupId,
          addedBy,
          systemMessageContent,
          "system",
          is_read
        );
        const messageId = saveResult.insertId;

        // Save the latest system message to be emitted to all group members later
        latestSystemMessage = await fetchMessagesById(messageId);
      })
    );

    // Emit the system message to all group members
    let chatMembers = await fetchAllChatsMembers(groupId, addedBy);
    let allMemberIds = [...chatMembers.map((m) => m.user_id), addedBy];

    for (const memberId of allMemberIds) {
      const socketId = userSockets.get(memberId);
      if (socketId && io.sockets.sockets.get(socketId)) {
        io.to(socketId).emit("getMessage", latestSystemMessage);
        // io.to(socketId).emit("chat_list", latestSystemMessage);
      }
    }

    return handleSuccess(res, 200, "Members added and notified successfully");
  } catch (error) {
    console.error("Error in addMembersInGroup:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const homePageWithTotalCount = async (req, res) => {
  try {
    let { id } = req.user;
    let userId = id;
    const notificationList = await fetchUNreadNotificationByUsersId(userId);
    let cartData = await getAllCartProductModel(userId);
    if (cartData.length > 0) {
      cartData = await Promise.all(
        cartData.map(async (item) => {
          const data = await getProductDetailsId(item?.pId);
          return data?.[0];
        })
      );
      cartData = cartData.filter(Boolean);
    }
    const io = getIO();
    const userSockets = getUserSockets();
    const recipientSocketID = userSockets.get(userId);
    const chats = await getUserChats(userId);
    const unreadChatsCount = chats.filter(
      (chat) => chat.unread_count !== 0
    ).length;
    io.to(recipientSocketID).emit("chat_unread_count", unreadChatsCount);
    // io.in(uid.toString()).emit("chat_unread_count", unreadChatsCount);

    const totalCounts = {
      totalNotifications: notificationList?.length || 0,
      totalCartCount: cartData?.length || 0,
    };
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, totalCounts);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const userLeaveTheChat = async (req, res) => {
  try {
    let { id } = req.user;
    let { chat_id } = req.body;
    let isActive = 0;
    await toActivateUsers(isActive, chat_id, id);
    const chats = await fetchChatMemberByChatsIds(chat_id);
    const otherUsers = chats.filter((chat) => chat.user_id !== id);
    let opponentUserId = otherUsers[0].user_id;
    let isActiveOrNot = 0;
    const io = getIO();
    const userSockets = getUserSockets();
    const recipientSocketID = userSockets.get(opponentUserId);
    io.to(recipientSocketID).emit("isUsersOnlineOrOffline", isActiveOrNot);
    return handleSuccess(res, 200, Msg.DATA_UPDATED);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchAllSweepstacks = async (req, res) => {
  try {
    let { id } = req.user;
    let data = await fetch_all_sweepstakes();
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
        let isAllredyPurchase = await fetchUsersById(id);
        let isPurchaseFreeSweepstacks =
          isAllredyPurchase[0].isPurchaseFreeSweepstacks;
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
          sweepstackStatus,
          isPurchaseFreeSweepstacks,
        };
      })
    );

    return handleSuccess(res, 200, "Sweepstakes fetched successfully", data);
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

// export const fetchSweepstacksById = async (req, res) => {
//     try {
//         let { id } = req.query
//         let data = await fetch_sweepstakes_by_id(id);
//         let attachment = await fetch_sweepstakesMedia_by_id(id)
//         if (data.length == 0) { return handleError(res, 400, error.message); }
//         const now = new Date();
//         const startDate = new Date(data[0].start_date);
//         const endDate = new Date(data[0].end_date);
//         let sweepstackStatus = '';
//         if (now < startDate) {
//             sweepstackStatus = 'coming soon';
//         } else if (now >= startDate && now <= endDate) {
//             sweepstackStatus = 'open';
//         } else {
//             sweepstackStatus = 'completed';
//         }
//         let sweepstacksName = data[0].sweepstakes_name
//         console.log('sweepstacksName', sweepstacksName);

//         let isAllredyFreeSweepstacks = await fetchFreeSweepstacks(sweepstacksName, req.user.id)
//         let isAllredyPurchase = await fetchUsersById(req.user.id)
//         data[0].sweepstackStatus = sweepstackStatus
//         data[0].attachment = attachment ? attachment : attachment
//         data[0].isPurchaseFreeSweepstacks = isAllredyFreeSweepstacks.length > 0 ? 1 : 0

//         data[0].entry_price = data[0].entry_price ? JSON.parse(typeof data[0].entry_price === 'string' ? JSON.parse(data[0].entry_price) : data[0].entry_price) : {};
//         return handleSuccess(res, 200, "Sweepstakes fetched successfully", data);
//     } catch (error) {
//         return handleError(res, 500, error.message);
//     }
// };

export const fetchSweepstacksById = async (req, res) => {
  try {
    let { id } = req.query;
    let data = await fetch_sweepstakes_by_id(id);
    let attachment = await fetch_sweepstakesMedia_by_id(id);

    if (data.length === 0) {
      return handleError(res, 400, "No sweepstake found");
    }

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

    let sweepstacksName = data[0].sweepstakes_name;

    let isAllredyFreeSweepstacks = await fetchFreeSweepstacks(
      sweepstacksName,
      req.user.id
    );
    let isAllredyPurchase = await fetchUsersById(req.user.id);

    data[0].sweepstackStatus = sweepstackStatus;
    data[0].attachment = attachment || [];
    data[0].isPurchaseFreeSweepstacks =
      isAllredyFreeSweepstacks.length > 0 ? 1 : 0;

    let entryPrice = data[0].entry_price;
    entryPrice =
      typeof entryPrice === "string"
        ? JSON.parse(JSON.parse(entryPrice))
        : entryPrice;

    // let allUserEntries = await fetchAllUserEntriesForSweepstack(sweepstacksName);
    // console.log("allUserEntries", allUserEntries)
    // let usedEntries = {
    //     "Free Entry": 0,
    //     "Trophy Talk Bundle": 0,
    //     "Ranger Bundle": 0,
    //     "Pathfinder Bundle": 0
    // };

    // allUserEntries.forEach(entry => {
    //     if (usedEntries[entry.entryPack] !== undefined) {
    //         usedEntries[entry.entryPack] = usedEntries[entry.entryPack] + parseInt(entry.totalEntry)
    //     }
    // });

    // // Replace *_entries fields with remaining entries
    // entryPrice.free_entry_pack_entries = String(parseInt(entryPrice.free_entry_pack_entries || 0) - usedEntries["Free Entry"]);
    // entryPrice.single_entry_pack_entries = String(parseInt(entryPrice.single_entry_pack_entries || 0) - usedEntries["Trophy Talk Bundle"]);
    // entryPrice.ranger_bundle_entries = String(parseInt(entryPrice.ranger_bundle_entries || 0) - usedEntries["Ranger Bundle"]);
    // entryPrice.pathfinder_entries = String(parseInt(entryPrice.pathfinder_entries || 0) - usedEntries["Pathfinder Bundle"]);
    // console.log('usedEntries', usedEntries);

    // console.log('entryPrice', entryPrice);

    data[0].entry_price = entryPrice;

    return handleSuccess(res, 200, "Sweepstakes fetched successfully", data);
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

export const fetchUsersPurchasedAllSweepstacks = async (req, res) => {
  try {
    let { id } = req.user;
    let data = await fetch_user_all_sweepstakes(id);
    const now = new Date();
    if (data.length > 0) {
      data = await Promise.all(
        data.map(async (item) => {
          let sweepstackDetailed = await fetch_sweepstakes_by_id(
            item.sweepStacksId
          );
          const startDate = new Date(sweepstackDetailed[0].start_date);
          const endDate = new Date(sweepstackDetailed[0].end_date);
          const expiryAt = sweepstackDetailed[0].end_date;
          let sweepstackStatus = "";
          if (now < startDate) {
            sweepstackStatus = "coming soon";
          } else if (now >= startDate && now <= endDate) {
            sweepstackStatus = "Active";
          } else {
            sweepstackStatus = "completed";
          }
          let isAllredyPurchase = await fetchUsersById(id);
          let isPurchaseFreeSweepstacks =
            isAllredyPurchase[0].isPurchaseFreeSweepstacks;
          return {
            ...item,
            expiryAt,
            sweepstackStatus,
            isPurchaseFreeSweepstacks,
          };
        })
      );
      return handleSuccess(res, 200, "Sweepstakes fetched successfully", data);
    } else {
      return handleError(
        res,
        StatusCode.status400,
        "This user has no sweepstack",
        []
      );
    }
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

// -------------------------------------------------Payment module--------------------------------------------//

export const purchaseSweepstacks = async (req, res) => {
  try {
    const { id } = req.user;
    let {
      sweepStacksId,
      entryPack,
      totalEntryFees,
      totalEntry,
      sweepstacksName,
      isFreeSweepstacks,
      status,
    } = req.body;
    let totalAmounts = Math.round(totalEntryFees * 100);
    let confirmationId = await generateConfirmationId();
    const [sweepData] = await modelFetchAllSweepstacksById(sweepStacksId);
    if (!sweepData) {
      return handleError(res, StatusCode.status400, "Sweepstake not found");
    }
    // let isAllredyFreeSweepstacks = await fetchFreeSweepstacks(sweepstacksName, id)
    // if (isAllredyFreeSweepstacks.length > 0) {
    //     return handleError(res, StatusCode.status400, 'You have already participated in this free sweepstake.');
    // }
    if (isFreeSweepstacks == 1) {
      const sweepData = {
        sweepStacksId: sweepStacksId,
        user_id: id,
        entryPack: entryPack,
        totalEntry: totalEntry,
        sweepstacksName: sweepstacksName,
        entryAmount: 0,
        confirmationId: "FREE",
        isPaid: 0,
      };
      await usersPurchasePlan(sweepData);
      await changeStatusOfUsersFreeSweepstacks(id);
      // return res.redirect(`${baseurl}/payment/success`);
      return handleSuccess(res, 200, "Sweepstack added succesfully");
    } else {
      if (!status) {
        return handleError(res, StatusCode.status400, "Please send Status");
      }

      if (status == 1) {
        const [walletBalance] = await fetchWalletBalanceById(id);
        if (!walletBalance) {
          return handleError(res, 400, "Wallet not found for this user");
        }
        console.log(walletBalance.balance, Math.round(totalEntryFees));
        if (walletBalance.balance < Math.round(totalEntryFees)) {
          return handleError(res, 400, " Insufficient TT Coins");
        }

        const sweepData = {
          sweepStacksId: sweepStacksId,
          user_id: id,
          entryPack: entryPack,
          totalEntry: totalEntry,
          sweepstacksName: sweepstacksName,
          entryAmount: totalEntryFees,
          confirmationId: confirmationId,
        };
        await usersPurchasePlan(sweepData);
        const rechargeData = {
          user_id: id,
          amount: totalEntryFees,
          description: "Sweepstake Purchase",
          status: 1,
          transaction_id: generateTransactionId(),
        };

        let rechargeResult = await insertWalletHistory(rechargeData);
        return handleSuccess(
          res,
          200,
          Msg.SweepStakesPurchaseSuccess,
          confirmationId
        );
      } else {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Sweepstacks Purchase Plan - ${sweepstacksName}`,
                },
                unit_amount: totalAmounts,
              },
              quantity: 1,
            },
          ],
          payment_intent_data: {
            transfer_group: "plan_purchase",
            metadata: {
              type: "sweepstake_purchase",
              sweepStacksId,
              user_id: id,
              entryPack,
              totalEntry,
              sweepstacksName,
              entryAmount: totalEntryFees,
              confirmationId,
            },
          },
          mode: "payment",
          success_url: `${baseurl}/payment/success`,
          cancel_url: `${baseurl}/payment/cancel`,
        });
        let data = confirmationId;
        // return handleSuccess(res, 200, Msg.SweepStakesPurchaseSuccess, confirmationId);
        return res.status(200).json({ success: true, url: session.url, data });
      }
    }
  } catch (err) {
    console.log(err);
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

// export const confirmAndPay = async (req, res) => {
//   try {
//     const { id } = req.user;
//     req.body.user_id = id;
//     req.body.orderItem = JSON.stringify(req.body.orderItem);
//     let userOrderSummaryAllreadyExists = await fetchOrderSummary(id);
//     if (userOrderSummaryAllreadyExists.length > 0) {
//       await changeStatusOfOrderSummarry(id);
//     }
//     let insertOrderSummary = await modelOrderSummary(req.body);
//     if (insertOrderSummary.affectedRows > 0) {
//       return handleSuccess(
//         res,
//         StatusCode.status200,
//         Msg.ORDER_SUMMARY_ADDED_SUCCESSFULLY
//       );
//     } else {
//       return handleError(
//         res,
//         StatusCode.status400,
//         Msg.ORDER_SUMMARY_ADDED_FAILED
//       );
//     }
//   } catch (err) {
//     console.error("Checkout error:", err);
//     return handleError(res, StatusCode.status500, Msg.internalServerError);
//   }
// };

export const addShippingAddress = async (req, res) => {
  try {
    const { id } = req.user;
    req.body.user_id = id;
    let insertShippingAddress = await addUserShippingAddress(req.body);
    if (insertShippingAddress.affectedRows > 0) {
      let id = insertShippingAddress.insertId;
      return handleSuccess(
        res,
        StatusCode.status200,
        Msg.SHIPPING_ADDRESS_ADDED,
        id
      );
    } else {
      return handleError(
        res,
        StatusCode.status400,
        Msg.FAILED_TO_ADD_SHIPPING_ADDRESS,
        0
      );
    }
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const fetchOrderAndShippingDetails = async (req, res) => {
  try {
    const { id } = req.user;
    let fetchUsersOrder = await fetchOrderSummary(id);
    fetchUsersOrder[0].orderItem = fetchUsersOrder.length > 0 ? JSON.parse(fetchUsersOrder[0].orderItem) : [];
    let userShippingAddress = await fetchUserShippingAddress(id);
    let orderDetailed = {
      orders: fetchUsersOrder[0],
      shippingAddress:
        userShippingAddress.length > 0 ? userShippingAddress : [],
    };
    return handleSuccess(
      res,
      StatusCode.status200,
      Msg.dataFoundSuccessful,
      orderDetailed
    );
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const fetchShippingAddress = async (req, res) => {
  try {
    const { id } = req.user;
    let userShippingAddress = await fetchUserShippingAddress(id);
    let shippingAddress =
      userShippingAddress.length > 0 ? userShippingAddress : [];
    return handleSuccess(
      res,
      StatusCode.status200,
      Msg.dataFoundSuccessful,
      shippingAddress
    );
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const editShippingAddressById = async (req, res) => {
  try {
    let { id } = req.params;
    const result = await editShippingAddressByIdModel(req.body, id);
    if (result.affectedRows) {
      return handleSuccess(
        res,
        200,
        Msg.SHIPPING_ADDRESS_UPDATE_SUCCESSFULLY,
        result
      );
    }
    return handleError(res, 400, Msg.FAILED_TO_UPDATE_SHIPPING_ADDRESS);
  } catch (err) {
    console.error(err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// export const payNow = async (req, res) => {
//   try {
//     const { id } = req.user;
//     const {
//       orderSummaryId,
//       shippingAddressId,
//       name,
//       email,
//       address,
//       city,
//       state,
//       zip_code,
//       phone_number,
//       status,
//     } = req.body;
//     let shippingId;
//     if (!status) {
//       return handleError(res, StatusCode.status400, "Please send Status");
//     }
//     if (shippingAddressId) {
//       shippingId = shippingAddressId;
//     } else {
//       let shippingDetailed = {
//         user_id: id,
//         name,
//         email,
//         address,
//         city,
//         state,
//         zip_code,
//         phone_number,
//       };
//       let result = await addUserShippingAddress(shippingDetailed);
//       shippingId = result.insertId ? result.insertId : 0;
//     }
//     let fetchShippingDetailed = await fetchUserShippingAddressByShippingId(
//       shippingId
//     );
//     let parseShippingDetailed = JSON.stringify(fetchShippingDetailed);
//     let fetchUsersOrder = await fetchOrderSummaryByOrderId(orderSummaryId);
//     if (!fetchUsersOrder) {
//       return handleError(res, StatusCode.status200, "orderSummaryId Not Found");
//     }
//     let totalAmount = fetchUsersOrder[0].total_prices;
//     let items = JSON.parse(fetchUsersOrder[0].orderItem);
//     const totalAmountInCents = Math.round(totalAmount * 100);
//     let order_Id = await generateFiveDigitNumber();

//     if (status == 1) {
//       const [walletBalance] = await fetchWalletBalanceById(id);
//       if (!walletBalance) {
//         return handleError(
//           res,
//           StatusCode.status200,
//           "Wallet not found for this user"
//         );
//       }
//       console.log(walletBalance.balance, Math.round(totalAmount));
//       if (walletBalance.balance < Math.round(totalAmount)) {
//         return handleError(
//           res,
//           StatusCode.status200,
//           "Not enough balance. Please recharge your wallet."
//         );
//       }

//       const orderData = {
//         id: order_Id,
//         userId: id,
//         totalAmount: totalAmount,
//         shippingDetailed: parseShippingDetailed,
//         order_summaryId: orderSummaryId,
//       };

//       let result = await createOrders(orderData);
//       if (result.insertId) {
//         await checkoutProductModel(id);
//         await changeStatusOfOrderSummarry(id);
//         let items = JSON.parse(fetchUsersOrder[0].orderItem);
//         let productSellerId = [];
//         let productIds = [];

//         // await Promise.all(
//         //   items.map(async (item) => {
//         //     let productDetailed = await get_product_data_by_id(item.product_id);
//         //     let orderDetails = {
//         //       order_id: orderData.id,
//         //       product_id: item.product_id,
//         //       quantity: item.quantity,
//         //       price_at_order: item.price_at_orders,
//         //       delivery_charge: productDetailed[0].shipping_charges,
//         //     };
//         //     await insertOrdersItem(orderDetails);
//         //     let quanti = productDetailed[0].stock_quantity - item.quantity;
//         //     await updateProductQuantityModel(item.product_id, quanti);
//         //     productSellerId.push(productDetailed[0].seller_id);
//         //     productIds.push(productDetailed[0].id);
//         //   })
//         // );

//         // -------------------------new code---------------------------------//
//         await Promise.all(
//           items.map(async (item) => {
//             const [variant] = await getVariantById(item.variant_id);
//             if (!variant) {
//               throw new Error("Variant not found");
//             }
//             if (variant.stock_quantity < item.quantity) {
//               throw new Error("Variant out of stock");
//             }
//             const orderDetails = {
//               order_id: orderData.id,
//               product_id: item.product_id,
//               variant_id: item.variant_id,
//               quantity: item.quantity,
//               price_at_order: item.price_at_orders,
//               delivery_charge: item.delivery_charge || 0
//             };
//             await insertOrdersItem(orderDetails);
//             const updated = await updateVariantStockModel(item.variant_id, item.quantity);
//             if (updated.affectedRows === 0) {
//               throw new Error("Stock update failed");
//             }
//           })
//         );
//         // -------------------------new code end---------------------------------//
//         let obj = { productSellerId, orderId: orderData.id, id: id };
//         await sendNotificationToAppSeller(obj);
//         const rechargeData = {
//           user_id: id,
//           amount: totalAmount,
//           description: "Product Purchase",
//           status: 1,
//           transaction_id: generateTransactionId(),
//         };

//         let rechargeResult = await insertWalletHistory(rechargeData);

//         // return handleSuccess(res, StatusCode.status200, Msg.ORDER_PLACED_SUCCESSFULLY, order_Id);
//         return res.json({
//           Status: 200,
//           Message: "ok",
//           order_Id: orderData.id,
//           success: true,
//         });
//       } else {
//         return handleError(res, StatusCode.status200, Msg.ORDER_PLACED_FAILED);
//       }
//     } else {
//       const session = await stripe.checkout.sessions.create({
//         line_items: [
//           {
//             price_data: {
//               currency: "usd",
//               product_data: {
//                 name: `Your Order`,
//               },
//               unit_amount: totalAmountInCents,
//             },
//             quantity: 1,
//           },
//         ],
//         payment_intent_data: {
//           transfer_group: "orders",
//           metadata: {
//             type: "product_order",
//             user_id: id,
//             totalAmount: totalAmount.toString(),
//             items: fetchUsersOrder[0].orderItem,
//             parseShippingDetailed,
//             order_Id,
//             orderSummaryId,
//           },
//         },
//         mode: "payment",
//         success_url: `${baseurl}/payment/success`,
//         cancel_url: `${baseurl}/payment/cancel`,
//       });
//       return res.status(200).json({ url: session.url, order_Id });
//     }
//   } catch (err) {
//     console.error("Checkout error:", err);
//     return handleError(res, StatusCode.status500, Msg.internalServerError);
//   }
// };

// export const fetchUserOrdersByUserId = async (req, res) => {
//   try {
//     let { id } = req.user;
//     let data = await modelFetchUserOrdersByUserId(id);
//     if (data.length > 0) {
//       data = await Promise.all(
//         data.map(async (item) => {
//           let allOrderItem = await fetchOrdersItem(item.id);
//           item.totalItem = allOrderItem.length > 0 ? allOrderItem.length : 0;
//           return item;
//         })
//       );
//       return handleSuccess(res, 200, "Order found successfully", data);
//     } else {
//       return handleError(res, 404, "No Orders list");
//     }
//   } catch (error) {
//     console.error("Error in get_all_sweepstakes:", error);
//     return handleError(res, 500, error.message);
//   }
// };

export const fetchUsessrOrderByOrderId = async (req, res) => {
  try {
    let { id } = req.user;
    const { orderId } = req.query;
    let sellerId = await fetchSellerInfoById(id);
    let seller_ids;
    if (sellerId.length > 0) {
      seller_ids = sellerId[0].id;
    } else {
      seller_ids = 0;
    }

    let data = await modelFetchOrdersByOrderId(orderId);
    if (data.length === 0) {
      return handleError(res, 404, "No Orders found");
    }
    data = await Promise.all(
      data.map(async (item) => {
        item.shippingDetailed = item.shippingDetailed
          ? JSON.parse(item.shippingDetailed)
          : {};

        let fetchOrdersItem = await fetchOrderItemByID(item.id);
        console.log("fetchOrdersItem", fetchOrdersItem);
        fetchOrdersItem[0].price_at_order =
          fetchOrdersItem[0].price_at_order.toString();
        const usersDetailed = await fetchUsersById(item.userId);
        const orderSummaryId = await fetchOrderSummaryByOrderId(
          item.order_summaryId
        );
        const enrichedItems = await Promise.all(
          fetchOrdersItem.map(async (i) => {
            let isSelfProduct = i.seller_id == seller_ids ? true : false;
            const productImages = await fetchProductsImagesByProductId(
              i.product_id
            );
            return {
              ...i,
              productImages: productImages.length > 0 ? productImages : [],
              totalAmount: i.totalAmount,
              isSelfProduct: isSelfProduct,
            };
          })
        );
        item.orderBookedBy = usersDetailed[0];
        item.shippingCharge =
          orderSummaryId.length > 0 ? orderSummaryId[0].shipping_price : 0;
        item.ordersItem = enrichedItems;
        item.totalAmount = enrichedItems[0].totalAmount;
        return item;
      })
    );
    return handleSuccess(res, 200, "Order found successfully", data[0]);
  } catch (error) {
    console.error("Error in fetchUserOrderByOrderId:", error);
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

// --------------------------------Add users stories------------------------------------------//

export const story_added = async (req, res) => {
  try {
    const { id } = req.user;
    let adsImages = [];
    let mediaFiles = req.files.file;
    if (mediaFiles.length > 0) {
      adsImages = mediaFiles.map((file) => {
        const safeKey = encodeURIComponent(file.key).replace(/%2F/g, "/");
        return getPublicUrl(safeKey);
      });
    }
    adsImages.map(async (item) => {
      let videoThumbnails;
      let type;
      const extension = item.split(".").pop().toLowerCase();
      if (
        ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(extension)
      ) {
        type = "image";
      } else {
        type = "video";
        let videoThumbnail = req.files.videoThumbnail;
        videoThumbnails = getPublicUrl(videoThumbnail[0].key);
      }
      let obj = {
        user_id: id,
        media: type,
        videoThumbnail: videoThumbnails ? videoThumbnails : null,
        file: item,
      };
      // await insertUsersStoriesModel(obj)
      return handleSuccess(res, 201, "Story added successfully");
    });
  } catch (error) {
    console.error("Error in add_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const story_deleted = async (req, res) => {
  try {
    const user = req.user;
    const { storyId } = req.body;
    console.log(user);

    const [story] = await getUserStoryById(storyId, user.id);
    if (!story) {
      return handleError(res, 404, "Story not found");
    }

    if (story.mediaType == "image") {
      const parsedImages = JSON.parse(story.imageUrl);

      const data = await Promise.all(
        parsedImages.map(async (imageUrl) => {
          const deleteImage = await deleteFromS3(imageUrl);
        })
      );
      const deleteImage = await deleteUserStoryById(storyId);
      // const data = await deleteFileFromS3(story)
      if (deleteImage.affectedRows > 0) {
        return handleSuccess(res, 200, "Story deleted successfully", story);
      } else {
        return handleError(res, 500, "Failed to delete story");
      }
    } else {
      const deleteVideo = await deleteFromS3(story.videoUrl);
      const deleteThumbnail = await deleteFromS3(story.videoThumbnail);
      const deleteImage = await deleteUserStoryById(storyId);
      // const data = await deleteFileFromS3(story)
      if (deleteImage.affectedRows > 0) {
        return handleSuccess(res, 200, "Story deleted successfully", story);
      } else {
        return handleError(res, 500, "Failed to delete story");
      }
    }
  } catch (error) {
    console.error("Error in add_sweepstake:", error);
    return handleError(res, 500, error.message);
  }
};

export const storyViews = async (req, res) => {
  try {
    let { id } = req.user;
    let { story_id } = req.body;
    let isUserViewOrNotStory = await StoriesViewsModel(story_id, id);
    if (isUserViewOrNotStory.length == 0) {
      let obj = {
        story_id: story_id,
        userId: id,
      };
      await insertStoriesViewersModel(obj);
    }
    return handleSuccess(res, 200, "user viewed the story");
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchOwnAllStories = async (req, res) => {
  try {
    let { id } = req.user;
    let msg;
    let data = await fetchUsersOwnAllStories(id);
    if (data.length > 0) {
      let isFollower = false;
      data = await Promise.all(
        data.map(async (item) => {
          if (item.audiance === mediaTypes.EVERYONE) {
            let listOfFollowers = await isUsersFollowToAnotherUsers(
              id,
              item.userId
            );
            isFollower =
              Array.isArray(listOfFollowers) && listOfFollowers.length > 0;
          } else {
            isFollower = true;
          }
          if (item.audiance === mediaTypes.EVERYONE && item.userId === id) {
            isFollower = true;
          }
          let isSelfPost = false;
          if (item.userId == id) {
            isSelfPost = true;
          }
          item.imageUrl = JSON.parse(item.imageUrl).map((url) =>
            url.trim().replace(/ /g, "%20")
          );
          item.isFollower = isFollower;
          item.isSelfPost = isSelfPost;
          let tagPeople = [];
          let tagsPeople = item.tagPeople
            ? typeof item.tagPeople === "string"
              ? JSON.parse(item.tagPeople)
              : item.tagPeople
            : []; // Ensure it's an array

          if (Array.isArray(tagsPeople) && tagsPeople.length > 0) {
            tagPeople = await Promise.all(
              tagsPeople.map(async (i) => ({
                userId: i,
                userDetails: await fetchUsersById(i),
              }))
            );
          }
          let postId = item.id;
          let totalComments = 0;
          // let fetchCommentsByPostId = await fetchCommentAccordingToPostId(postId);
          // if (fetchCommentsByPostId.length > 0) {
          //     let fetchTotalPostComments = fetchCommentsByPostId.length;
          //     let totalNestedComments = 0;
          //     fetchCommentsByPostId = await Promise.all(
          //         fetchCommentsByPostId.map(async (comment) => {
          //             let nestedComments = await fetchCommentAccordingToParentCommentId(comment.id);
          //             comment.fetchNestedComments = nestedComments.length;
          //             totalNestedComments += nestedComments.length;
          //             return comment;
          //         })
          //     );
          //     totalComments = fetchTotalPostComments + totalNestedComments;
          // }
          let viewersList = await fetchStoriesViews(item.id);
          let isViewed = await StoriesViewsModel(item.id, id);
          let isLike = await fetchUsersLikeToPostDataByUsersId(id, postId);
          let userData = await fetchUsersById(item.userId);
          let fetchAllLikePosts = await fetchLikeOnParticularPost(postId);
          item.isViewed = isViewed.length > 0 ? true : false;
          item.totalLikes =
            fetchAllLikePosts.length > 0 ? fetchAllLikePosts.length : 0;
          item.isLike = isLike.length > 0 ? true : false;
          item.totalComments = totalComments;
          item.totalViews = viewersList.length > 0 ? viewersList.length : 0;
          item.totalShare = 0;
          item.userId = item.userId;
          item.fullName = userData[0].fullName;
          item.profile = userData[0].profileImage
            ? userData[0].profileImage
            : null;
          item.tagPeople = tagPeople;
          item.videoDuration = item.videoDuration;
          return item;
        })
      );
      let result = await fetchBlockedListUsers(id);
      let blockedToIds =
        result.length > 0 ? result.map((user) => user.blocked_to) : [];
      data = data.filter((item) => {
        return item && !blockedToIds.includes(Number(item.userId));
      });
      data = data;
    }
    const groupedStories = [];
    data.forEach((story) => {
      const existingUser = groupedStories.find(
        (u) => u.userId === story.userId
      );
      const storyItem = {
        id: story.id,
        mediaType: story.mediaType,
        videoUrl: story.videoUrl || null,
        videoThumbnail: story.videoThumbnail || null,
        imageUrl: story.imageUrl?.length ? story.imageUrl : [],
        captions: story.captions || "",
        hasTags: story.hasTags || "[]",
        location: story.location || null,
        tagPeople: story.tagPeople || [],
        audiance: story.audiance || "Everyone",
        status: story.status || 0,
        isExpire: story.isExpire || 0,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt || null,
        isFollower: story.isFollower || false,
        isSelfPost: story.isSelfPost || false,
        totalLikes: story.totalLikes || 0,
        totalViews: story.totalViews || 0,
        totalComments: story.totalComments || 0,
        totalShare: story.totalShare || 0,
        isViewed: story.isViewed || false,
        isLike: story.isLike || false,
        videoDuration: story.videoDuration,
      };

      if (existingUser) {
        existingUser.stories.push(storyItem);
      } else {
        groupedStories.push({
          userId: story.userId,
          fullName: story.fullName || "",
          profile: story.profile || null,
          stories: [storyItem],
        });
      }
    });
    msg =
      data.length > 0
        ? "Your stories are ready to view!"
        : "You haven’t added any stories yet.";
    return handleSuccess(res, 200, msg, groupedStories);
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchAllUsersStories = async (req, res) => {
  try {
    let { id } = req.user;
    let msg;
    let fetchOthersPost = await fetchAnotherUsersAllStories(id);
    if (fetchOthersPost.length > 0) {
      let isFollower = false;
      let fetchFollowingId = await retrieveMyFollowing(id);
      const followingIds = fetchFollowingId.map((i) => i.followingId);
      fetchOthersPost = await Promise.all(
        fetchOthersPost.map(async (item) => {
          // if (followingIds.includes(item.userId)) {
          if (
            item.userId === id ||
            item.audiance === mediaTypes.EVERYONE ||
            (item.audiance === mediaTypes.FOLLOWERS &&
              followingIds.includes(item.userId))
          ) {
            if (item.audiance === mediaTypes.EVERYONE) {
              let listOfFollowers = await isUsersFollowToAnotherUsers(
                id,
                item.userId
              );
              isFollower =
                Array.isArray(listOfFollowers) && listOfFollowers.length > 0;
            } else {
              isFollower = true;
            }
            if (item.audiance === mediaTypes.EVERYONE && item.userId === id) {
              isFollower = true;
            }
            let isSelfPost = false;
            if (item.userId == id) {
              isSelfPost = true;
            }
            item.imageUrl = JSON.parse(item.imageUrl).map((url) =>
              url.trim().replace(/ /g, "%20")
            );
            item.isFollower = isFollower;
            item.isSelfPost = isSelfPost;
            let tagPeople = [];
            let tagsPeople = item.tagPeople
              ? typeof item.tagPeople === "string"
                ? JSON.parse(item.tagPeople)
                : item.tagPeople
              : []; // Ensure it's an array

            if (Array.isArray(tagsPeople) && tagsPeople.length > 0) {
              tagPeople = await Promise.all(
                tagsPeople.map(async (i) => ({
                  userId: i,
                  userDetails: await fetchUsersById(i),
                }))
              );
            }
            let postId = item.id;
            let totalComments = 0;
            // let fetchCommentsByPostId = await fetchCommentAccordingToPostId(postId);
            // if (fetchCommentsByPostId.length > 0) {
            //     let fetchTotalPostComments = fetchCommentsByPostId.length;
            //     let totalNestedComments = 0;
            //     fetchCommentsByPostId = await Promise.all(
            //         fetchCommentsByPostId.map(async (comment) => {
            //             let nestedComments = await fetchCommentAccordingToParentCommentId(comment.id);
            //             comment.fetchNestedComments = nestedComments.length;
            //             totalNestedComments += nestedComments.length;
            //             return comment;
            //         })
            //     );
            //     totalComments = fetchTotalPostComments + totalNestedComments;
            // }
            let viewersList = await fetchStoriesViews(item.id);
            let isViewed = await StoriesViewsModel(item.id, id);
            let isLike = await fetchUsersLikeToPostDataByUsersId(id, postId);
            let userData = await fetchUsersById(item.userId);
            let fetchAllLikePosts = await fetchLikeOnParticularPost(postId);
            item.isViewed = isViewed.length > 0 ? true : false;
            item.totalLikes =
              fetchAllLikePosts.length > 0 ? fetchAllLikePosts.length : 0;
            item.isLike = isLike.length > 0 ? true : false;
            item.totalComments = totalComments;
            item.totalViews = viewersList.length > 0 ? viewersList.length : 0;
            item.totalShare = 0;
            item.userId = item.userId;
            item.fullName = userData[0].fullName;
            item.profile = userData[0].profileImage
              ? userData[0].profileImage
              : null;
            item.tagPeople = tagPeople;
            item.videoDuration = item.videoDuration;

            return item;
          }
          return null;
        })
      );
      let result = await fetchBlockedListUsers(id);
      let blockedToIds =
        result.length > 0 ? result.map((user) => user.blocked_to) : [];
      fetchOthersPost = fetchOthersPost.filter((item) => {
        return item && !blockedToIds.includes(Number(item.userId));
      });
      fetchOthersPost = fetchOthersPost.filter(Boolean);
    }
    const groupedOtherStories = [];
    fetchOthersPost.forEach((story) => {
      const existingUser = groupedOtherStories.find(
        (u) => u.userId === story.userId
      );
      const storyItem = {
        id: story.id,
        mediaType: story.mediaType,
        videoUrl: story.videoUrl || null,
        videoThumbnail: story.videoThumbnail || null,
        imageUrl: story.imageUrl?.length ? story.imageUrl : [],
        captions: story.captions || "",
        hasTags: story.hasTags || "[]",
        location: story.location || null,
        tagPeople: story.tagPeople || [],
        audiance: story.audiance || "Everyone",
        status: story.status || 0,
        isExpire: story.isExpire || 0,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt || null,
        isFollower: story.isFollower || false,
        isSelfPost: story.isSelfPost || false,
        totalLikes: story.totalLikes || 0,
        totalViews: story.totalViews || 0,
        totalComments: story.totalComments || 0,
        totalShare: story.totalShare || 0,
        isViewed: story.isViewed || false,
        isLike: story.isLike || false,
        videoDuration: story.videoDuration,
      };

      if (existingUser) {
        existingUser.stories.push(storyItem);
      } else {
        groupedOtherStories.push({
          userId: story.userId,
          fullName: story.fullName || "",
          profile: story.profile || null,
          stories: [storyItem],
        });
      }
    });

    const myFollowings = await retrieveMyFollowing(id);

    if (myFollowings.length > 0) {
      for (let i = myFollowings.length - 1; i >= 0; i--) {
        const item = myFollowings[i];
        const checkLive = await checkLiveStatus(item.followingId);
        if (checkLive.length > 0) {
          for (let j = checkLive.length - 1; j >= 0; j--) {
            checkLive[j].isLive = true;
            const userDetails = await fetchUsersById(checkLive[j].user_id);
            checkLive[j].fullName = userDetails[0].fullName;
            checkLive[j].profile = userDetails[0].profileImage;
            groupedOtherStories.unshift(checkLive[j]);
          }
        }
      }
    }

    msg =
      groupedOtherStories.length > 0
        ? "Stories found successfully."
        : "This user has no stories available.";
    return handleSuccess(res, 200, msg, groupedOtherStories);
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const sendNotificationToAppSeller = async (details) => {
  let productUserSellerId = details.productSellerId;
  if (productUserSellerId.length > 0) {
    let uniqueSellerId = [...new Set(productUserSellerId)];
    await Promise.all(
      uniqueSellerId.map(async (item) => {
        console.log("item", item);
        let userData = await fetchSellerByIdAndDetails(item);
        let sellerData = await getSellerDetailsBySeller_d(item);
        console.log("sellerData", sellerData);
        let sellerfetchFcmToken = sellerData[0].fcmToken;
        let usersfetchFcmToken = userData[0].fcmToken;
        let userId = userData[0].id;
        let sellerId = sellerData[0].id;
        let followId = details.orderId;
        let notificationType = NotificationTypes.NOTIFICATION_SEND_SELLER_APP;
        let notificationSend = "sendNotificationAppSeller";
        let id = 0;
        let fullName = "";
        let postId = null;
        const message = await createNotificationMessage({
          notificationSend,
          fullName,
          id,
          userId,
          followId,
          usersfetchFcmToken,
          notificationType,
          postId,
        });
        await sendNotification(message);
        usersfetchFcmToken = sellerfetchFcmToken;
        userId = sellerId;
        const sellerMessage = await createNotificationMessage({
          notificationSend,
          fullName,
          id,
          userId,
          followId,
          usersfetchFcmToken,
          notificationType,
          postId,
        });
        await sendNotification(sellerMessage);
      })
    );
  }
};

export const fetchMentionedPostAndStory = async (req, res) => {
  try {
    let { id } = req.user;
    let data = await fetchAllMentionedPostAndStories(id);
    if (data.length === 0) {
      return handleError(res, 400, "No tagged posts found.", []);
    }
    data = await Promise.all(
      data.map(async (item) => {
        if (item.postId != null) {
          let fetchPost = await fetchUsersByPostId(item.postId);

          item.mediaName = fetchPost[0].postName;

          if (fetchPost[0].mediaType === "video") {
            item.mediaImage = [encodeURI(fetchPost[0].videoThumbnail)];
          } else {
            let images = JSON.parse(fetchPost[0].imageUrl);
            item.mediaImage = images.map((url) => encodeURI(url.trim()));
          }
          item.mediaCaptions = fetchPost[0].captions;
        }
        if (item.story_id != null) {
          let fetchStory = await fetchStoriesByIds(item.story_id);
          item.mediaName = fetchStory[0].postName;
          if (fetchStory[0].mediaType === "video") {
            item.mediaImage = [encodeURI(fetchStory[0].videoThumbnail)];
          } else {
            let images = JSON.parse(fetchStory[0].imageUrl);
            item.mediaImage = images.map((url) => encodeURI(url.trim()));
          }
          item.mediaCaptions = fetchStory[0].captions;
        }

        let userData = await fetchUsersById(item.mentioned_by_id);
        item.mentionedByUsersUserName = userData[0].userName;
        item.mentionedByUsersFullName = userData[0].fullName;
        item.mentionedByUsersProfile = userData[0].profileImage;
        item.story_id = item.story_id ? item.story_id : 0;
        item.postId = item.postId ? item.postId : 0;

        return item;
      })
    );
    return handleSuccess(res, 200, "Tagged posts fetched successfully.", data);
  } catch (error) {
    console.error("Error in fetchTaggedPosts:", error);
    return handleError(res, 500, error.message);
  }
};

export const sellerConnectedAccountCreate = async (req, res) => {
  try {
    let { id } = req.user;
    const { country, return_url } = req.body;
    let sellerDetail = await fetchSellerInfoById(id);
    let seller_id = sellerDetail[0].id;
    let seller = await isSellerAccountCreatedOrNot(seller_id);
    let accountId;
    if (seller.length > 0 && seller[0].account_id) {
      accountId = seller[0].account_id;
    } else {
      const account = await stripe.accounts.create({
        type: "express",
        country: country,
        email: sellerDetail[0].email,
      });
      console.log("account", account);
      accountId = account.id;
      let obj = {
        seller_id: seller_id,
        account_id: accountId,
        is_onboarding_complete: 0,
      };
      await saveSellerConnectedAccount(obj);
      await markSellerOnboardingComplete(accountId);
    }
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "https://18.219.62.132/login",
      return_url: return_url,
      type: "account_onboarding",
    });
    const account = await stripe.accounts.retrieve(accountId);

    if (account.charges_enabled && account.payouts_enabled) {
      await markSellerOnboardingComplete(account.id);
    }

    let data = { onboardingUrl: accountLink.url };
    return handleSuccess(res, 200, "Stripe account ready for onboarding", data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const fetchUserListByStoryId = async (req, res) => {
  try {
    let { id: currentUserId } = req.user;
    let { storyId } = req.query;

    let data = await fetchStoriesViews(storyId);

    if (data.length === 0) {
      return handleError(res, 400, "No one has viewed this story yet.", []);
    }

    // Remove current user's view from the list
    data = data.filter((item) => item.userId !== currentUserId);

    data = await Promise.all(
      data.map(async (item) => {
        let userData = await fetchUsersById(item.userId);
        item.userId = userData[0].id;
        item.userName = userData[0].userName;
        item.fullName = userData[0].fullName;
        item.profileImage = userData[0].profileImage;
        return item;
      })
    );

    return handleSuccess(res, 200, "Users who viewed this story.", data);
  } catch (error) {
    console.error("Error in fetchUserListByStoryId:", error);
    return handleError(res, 500, error.message);
  }
};

export const getSecretKeys = async (req, res) => {
  try {
    const imglyKey = '5QtpI7xX5GTYgkx88omFHOfQIsmYrE2qprf2dxIt15P_jcztG9s_-0hFrOGRvnig';
    const googleAPIKey = "AIzaSyCFv1JZ8BGppw-ZyncurrbMpResLu5J2_c";
    let data = { imglyKey, googleAPIKey };
    return handleSuccess(res, 200, "Secret keys fetched successfully.", data);
  } catch (error) {
    console.error("Error in getSecretKeys:", error);
    return handleError(res, 500, error.message);
  }
};

export const boostedProductsViews = async (req, res) => {
  try {
    let { id } = req.user;
    let { boosted_product_id } = req.body;
    console.log("boosted_product_id", boosted_product_id);

    let isUserViewOrNotStory = await checkIsBoostProductAllreadyViewedOrNOt(
      boosted_product_id,
      id
    );
    if (isUserViewOrNotStory.length == 0) {
      let obj = {
        boosted_product_id: boosted_product_id,
        user_id: id,
      };
      let boostedProductDeatiled = await fetchBoostProductsById(
        boosted_product_id
      );
      let productId = boostedProductDeatiled[0].product_id;
      let productDetails = await getProductDataByIdModal(productId);
      let currentViews = productDetails[0].viewed;
      let updatedViews = currentViews + 1;
      await insertBoostAnalyticsProduct(obj);
      await updateProductViewed(productId, updatedViews);

      return handleSuccess(res, 200, "user viewed the product");
    } else {
      return handleSuccess(res, 200, "user viewed the product");
    }
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchAllPostPromotionPackages = async (req, res) => {
  try {
    let fetchPostPromotionPackages = await fetchAllPostPromotionPackagesModel();
    if (fetchPostPromotionPackages.length > 0) {
      return handleSuccess(
        res,
        200,
        Msg.dataFoundSuccessful,
        fetchPostPromotionPackages
      );
    } else {
      return handleError(res, 400, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const boostPost = async (req, res) => {
  try {
    let { id } = req.user;
    const { post_id, packages_id, status } = req.body;
    if (!post_id || !packages_id || !status) {
      return handleError(
        res,
        400,
        "Post ID, Package ID and status are required"
      );
    }
    const fetchBoostProduct = await fetchBoostPostByPostId(post_id);
    if (fetchBoostProduct.length) {
      return handleError(res, 400, "This Post Is Already Promoted");
    }
    const postDetails = await fetchUsersByPostId(post_id);
    if (postDetails.length === 0) {
      return handleError(res, 404, "Post not found");
    }
    const postName = postDetails[0]?.postName;
    const promotionPackageId = await getPostPromotionPackageById(packages_id);
    if (promotionPackageId.length === 0) {
      return handleError(res, 404, "Promotion package not found");
    }
    const durationDays = promotionPackageId[0]?.duration_days;
    const reachCount = promotionPackageId[0]?.reach;
    const promotionPriceInCents = Math.round(
      Number(promotionPackageId[0]?.price) * 100
    );
    const userId = postDetails[0]?.userId;
    const postId = post_id;
    if (status == 1) {
      const [walletBalance] = await fetchWalletBalanceById(userId);
      if (
        Number(walletBalance.balance) < Number(promotionPackageId[0]?.price)
      ) {
        console.log(walletBalance.balance, promotionPackageId[0]?.price);
        return handleError(res, 400, "Insufficient TT Coins");
      }
      const current_Date = new Date();
      const duration_Days = parseInt(durationDays);
      const end_Date = new Date(current_Date);
      end_Date.setDate(end_Date.getDate() + duration_Days);
      const post_promotion = {
        user_id: userId,
        post_id: post_id,
        plan_id: packages_id,
        start_date: current_Date,
        end_date: end_Date,
        payment_status: "paid",
      };

      let insertPostPromotionResult = await insertBoostPost(post_promotion);
      if (insertPostPromotionResult.insertId) {
        await updatePostBoost(post_id);
        const rechargeData = {
          user_id: userId,
          amount: promotionPackageId[0]?.price,
          description: "Post Promotion",
          status: 1,
          transaction_id: generateTransactionId(),
        };

        let rechargeResult = await insertWalletHistory(rechargeData);
        return handleSuccess(res, 200, Msg.PostBoostSuccessfully);
      } else {
        return handleError(res, 500, Msg.PostBoostFailed);
      }
    } else {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Promote Post: ${postName}`,
              },
              unit_amount: promotionPriceInCents,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          transfer_group: "promotions",
          metadata: {
            type: "post_promotion",
            user_id: userId.toString(),
            post_id: postId.toString(),
            package_id: packages_id.toString(),
            duration: durationDays.toString(),
            reach: reachCount.toString(),
          },
        },
        mode: "payment",
        success_url: "https://18.224.187.144:4000/success",
        cancel_url: `${baseurl}/promotion/cancel`,
      });

      return handleSuccess(res, 200, Msg.linkToPay, { url: session.url });
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const liveStartEnd = async (req, res) => {
  try {
    let { id, fullName } = req.user;
    let { live_id, status, type } = req.body;

    if (!live_id || !status || !type) {
      return handleError(res, 400, "Live ID or status and type are required");
    }

    if (status == 1) {
      const data = {
        live_id: live_id,
        user_id: id,
        start_date: new Date(),
        end_date: null,
        type,
      };
      const liveDetails = await insertLiveStream(data);
      if (liveDetails) {
        let users = [];
        if (type == 1) {
          // users = await retrieveMyFollowing(id);
          users = await retrieveMyFollowers(id);
          const followerIds = users.map((user) => user.followersId);
          users = await db.query(`SELECT * FROM tbl_users WHERE id IN (?)`, [
            followerIds,
          ]);
        } else {
          users = await fetchAllOtherUsers(id);
        }
        console.log("users", users);

        if (users.length > 0) {
          const data = await Promise.all(
            users.map(async (item) => {
              const notificationMessage = await createNotificationMessage({
                notificationSend: "liveStarted",
                fullName,
                id,
                userId: item.id,
                followId: null,
                usersfetchFcmToken: item.fcmToken,
                notificationType: NotificationTypes.SEND_LIVE_NOTIFICATION,
                postId: live_id,
              });
              await sendNotification(notificationMessage, live_id);
            })
          );
        }
        return handleSuccess(
          res,
          200,
          "Live started successfully",
          liveDetails
        );
      } else {
        return handleError(res, 500, "Failed to start live");
      }
    } else {
      const liveEndDetails = await fetchLiveStreamById(live_id);
      if (liveEndDetails.length == 0) {
        return handleError(res, 404, "Live not found");
      }
      const liveDetails = await updateLiveStream(live_id);
      if (liveDetails) {
        return handleSuccess(res, 200, "Live ended successfully", liveDetails);
      } else {
        return handleError(res, 500, "Failed to end live");
      }
    }
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const addLiveView = async (req, res) => {
  try {
    // let { id } = req.user;
    let { live_id, id } = req.body;

    if (!live_id || !id) {
      return handleError(res, 400, "Live ID or id are required");
    }

    const [user] = await fetchUsersById(id);
    if (!user) {
      return handleError(res, 404, Msg.USER_NOT_FOUND);
    }

    const checkLive = await fetchLiveStreamById(live_id);
    if (checkLive.length == 0) {
      return handleError(res, 404, "Live not found");
    } else if (id == checkLive[0].user_id) {
      return handleError(res, 400, "You cannot view your own live stream");
    }

    const isUserViewOrNotLive = await fetchLiveStreamByUserId(id, live_id);
    if (isUserViewOrNotLive.length == 0) {
      let obj = {
        live_id: live_id,
        user_id: id,
      };
      await insertLiveStreamViewers(obj);
      return handleSuccess(res, 200, "User viewed the live stream");
    } else {
      return handleSuccess(res, 200, "User view the live stream");
    }
  } catch (error) {
    console.error("Error in get_all_sweepstakes:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchSweepstackPurchase = async (req, res) => {
  try {
    let { id } = req.user;
    let sweepstackPurchase = await fetchSweepPurchaseById(id);
    if (sweepstackPurchase.length > 0) {
      return handleSuccess(
        res,
        200,
        Msg.dataFoundSuccessful,
        sweepstackPurchase
      );
    } else {
      return handleError(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchWalletHistory = async (req, res) => {
  try {
    let { id } = req.user;
    let walletHistory = await fetchWalletHistoryById(id);
    if (walletHistory.length > 0) {
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, walletHistory);
    } else {
      return handleError(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchWalletBalance = async (req, res) => {
  try {
    let { id } = req.user;
    let walletBalance = await fetchWalletBalanceById(id);
    if (walletBalance.length > 0) {
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, walletBalance[0]);
    } else {
      return handleError(res, 200, Msg.dataNotFound, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const walletRecharge = async (req, res) => {
  try {
    let { id } = req.user;
    const { amount, transactionIdentifier, productIdentifier, purchaseDate } =
      req.body;
    if (!amount || amount <= 0) {
      return handleError(
        res,
        400,
        "Amount is required and must be greater than zero"
      );
    }

    // const session = await stripe.checkout.sessions.create({
    //     line_items: [
    //         {
    //             price_data: {
    //                 currency: 'usd',
    //                 product_data: {
    //                     name: `Wallet Recharge`,
    //                 },
    //                 unit_amount: amount * 100,
    //             },
    //             quantity: 1,
    //         }
    //     ],
    //     payment_intent_data: {
    //         transfer_group: 'Recharge',
    //         metadata: {
    //             type: 'wallet_recharge',
    //             user_id: id.toString(),
    //             description: 'Recharge',
    //             status: 0,
    //             transaction_id: generateTransactionId(),
    //             amount: amount
    //         }

    //     },
    //     mode: 'payment',
    //     success_url: 'https://18.224.187.144:4000/success',
    //     cancel_url: `${baseurl}/promotion/cancel`,
    // });

    const newData = {
      user_id: id,
      amount: amount,
      status: 0,
      transaction_id: transactionIdentifier,
      productIdentifier: productIdentifier,
      purchaseDate: purchaseDate,
      description: "TT Coins Added",
    };
    const data = await insertWalletHistory(newData);

    if (data.affectedRows > 0) {
      return handleSuccess(res, 200, "TT Coins added sucessfully", data);
    } else {
      return handleError(res, 200, Msg.rechargeFailed, []);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchTrendingHotnow = async (req, res) => {
  try {
    let { id } = req.user;
    const { type = 1, limit = 200, offset = 0 } = req.query;

    let myFollowing = await retrieveMyFollowing(id);
    let allLives = await fetchAllPublicLives();
    let fetchFollowingId = await retrieveMyFollowing(id);
    let fetchOthersPost = await fetchOtherPostModel(
      Number(limit),
      Number(offset)
    );
    const followingIds = fetchFollowingId.map((i) => i.followingId);

    fetchOthersPost = await Promise.all(
      fetchOthersPost.map(async (item) => {
        if (
          item.userId === id ||
          item.audiance === mediaTypes.EVERYONE ||
          (item.audiance === mediaTypes.FOLLOWERS &&
            followingIds.includes(item.userId))
        ) {
          let isFollower = null;
          if (item.audiance === mediaTypes.EVERYONE) {
            let listOfFollowers = await isUsersFollowToAnotherUsers(
              id,
              item.userId
            );
            isFollower =
              Array.isArray(listOfFollowers) && listOfFollowers.length > 0;
          } else {
            isFollower = true;
          }
          if (item.audiance === mediaTypes.EVERYONE && item.userId === id) {
            isFollower = true;
          }
          let isSelfPost = false;
          if (item.userId == id) {
            isSelfPost = true;
          }
          item.imageUrl =
            item.imageUrl != null ? JSON.parse(item.imageUrl) : [];
          item.isFollower = isFollower;
          item.isSelfPost = isSelfPost;
          let tagPeople = [];
          let tagsPeople = item.tagPeople
            ? typeof item.tagPeople === "string"
              ? JSON.parse(item.tagPeople)
              : item.tagPeople
            : []; // Ensure it's an array

          if (Array.isArray(tagsPeople) && tagsPeople.length > 0) {
            tagPeople = await Promise.all(
              tagsPeople.map(async (i) => ({
                userId: i,
                userDetails: await fetchUsersById(i),
              }))
            );
          }
          let postId = item.id;
          let totalComments = 0;
          let fetchCommentsByPostId = await fetchCommentAccordingToPostId(
            postId
          );
          if (fetchCommentsByPostId.length > 0) {
            let fetchTotalPostComments = fetchCommentsByPostId.length;
            let totalNestedComments = 0;
            fetchCommentsByPostId = await Promise.all(
              fetchCommentsByPostId.map(async (comment) => {
                let nestedComments =
                  await fetchCommentAccordingToParentCommentId(comment.id);
                comment.fetchNestedComments = nestedComments.length;
                totalNestedComments += nestedComments.length;
                return comment;
              })
            );
            totalComments = fetchTotalPostComments + totalNestedComments;
          }
          let totalViewsOnPost = await fetchTotalViewsOnPost(postId);
          let isLike = await fetchUsersLikeToPostDataByUsersId(id, postId);
          let userData = await fetchUsersById(item.userId);
          let fetchAllLikePosts = await fetchLikeOnParticularPost(postId);
          item.totalLikes =
            fetchAllLikePosts.length > 0 ? fetchAllLikePosts.length : 0;
          item.isLike = isLike.length > 0 ? true : false;
          item.totalComments = totalComments;
          item.totalViews =
            totalViewsOnPost.length > 0 ? totalViewsOnPost.length : 0;
          item.totalShare = 0;
          item.userId = item.userId;
          item.fullName = userData[0].fullName;
          item.profile = userData[0].profileImage
            ? userData[0].profileImage
            : null;
          item.tagPeople = tagPeople;
          item.isViewed = false;
          item.videoDuration = item.videoDuration;

          return item;
        }
        return null;
      })
    );

    if (myFollowing.length > 0) {
      allLives = [...allLives, ...(await fetchMyFollowingLives(followingIds))];
    }

    if (allLives.length > 0) {
      allLives = await Promise.all(
        allLives.map(async (item) => {
          let [liveUserCount] = await fetchLiveCountByLiveID(item.live_id);
          item.liveUserCount = liveUserCount.count ? liveUserCount.count : 0;
          item.Post_type = 1;
          return item;
        })
      );
    }

    if (fetchOthersPost.length > 0) {
      let data = await Promise.all(
        fetchOthersPost.map(async (item) => {
          let [likeUserCount] = await fetchPostLikeCountBYPostId(item.id);
          item.likeUserCount = likeUserCount.count ? likeUserCount.count : 0;
          item.Post_type = 2;
          return item;
        })
      );
    }

    allLives = allLives.sort((a, b) => b.liveUserCount - a.liveUserCount);

    if (type == 1) {
      fetchOthersPost = fetchOthersPost.slice(0, 20);
      let data = allLives.concat(fetchOthersPost);
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
    } else {
      fetchOthersPost = await fetchPromotedPost();

      console.log("fetchOthersPost (raw)", fetchOthersPost);

      // Parse imageUrl field
      fetchOthersPost = fetchOthersPost.map((post) => {
        if (post.imageUrl) {
          try {
            post.imageUrl = JSON.parse(post.imageUrl); // converts to array
          } catch (e) {
            console.error("Invalid imageUrl JSON:", post.imageUrl);
            post.imageUrl = []; // fallback to empty array
          }
        } else {
          post.imageUrl = [];
        }

        return post;
      });

      // If you want just the first image
      // post.imageUrl = post.imageUrl[0] || null;

      return handleSuccess(res, 200, Msg.dataFoundSuccessful, fetchOthersPost);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchJustForYou = async (req, res) => {
  try {
    let { id } = req.user;
    const { limit = 200, offset = 0 } = req.query;
    let fetchFollowingId = await retrieveMyFollowing(id);
    const followingIds = fetchFollowingId.map((i) => i.followingId);
    let fetchOthersPost = await fetchMyFollowingsPostModel(
      followingIds,
      Number(limit),
      Number(offset)
    );
    if (fetchOthersPost.length == 0) {
      fetchOthersPost = await fetchOtherPostModel(
        Number(limit),
        Number(offset)
      );
    }
    fetchOthersPost = await Promise.all(
      fetchOthersPost.map(async (item) => {
        if (
          item.userId === id ||
          item.audiance === mediaTypes.EVERYONE ||
          (item.audiance === mediaTypes.FOLLOWERS &&
            followingIds.includes(item.userId))
        ) {
          let isFollower = null;
          if (item.audiance === mediaTypes.EVERYONE) {
            let listOfFollowers = await isUsersFollowToAnotherUsers(
              id,
              item.userId
            );
            isFollower =
              Array.isArray(listOfFollowers) && listOfFollowers.length > 0;
          } else {
            isFollower = true;
          }
          if (item.audiance === mediaTypes.EVERYONE && item.userId === id) {
            isFollower = true;
          }
          let isSelfPost = false;
          if (item.userId == id) {
            isSelfPost = true;
          }
          item.imageUrl =
            item.imageUrl != null ? JSON.parse(item.imageUrl) : [];
          item.isFollower = isFollower;
          item.isSelfPost = isSelfPost;
          let tagPeople = [];
          let tagsPeople = item.tagPeople
            ? typeof item.tagPeople === "string"
              ? JSON.parse(item.tagPeople)
              : item.tagPeople
            : []; // Ensure it's an array

          if (Array.isArray(tagsPeople) && tagsPeople.length > 0) {
            tagPeople = await Promise.all(
              tagsPeople.map(async (i) => ({
                userId: i,
                userDetails: await fetchUsersById(i),
              }))
            );
          }
          let postId = item.id;
          let totalComments = 0;
          let fetchCommentsByPostId = await fetchCommentAccordingToPostId(
            postId
          );
          if (fetchCommentsByPostId.length > 0) {
            let fetchTotalPostComments = fetchCommentsByPostId.length;
            let totalNestedComments = 0;
            fetchCommentsByPostId = await Promise.all(
              fetchCommentsByPostId.map(async (comment) => {
                let nestedComments =
                  await fetchCommentAccordingToParentCommentId(comment.id);
                comment.fetchNestedComments = nestedComments.length;
                totalNestedComments += nestedComments.length;
                return comment;
              })
            );
            totalComments = fetchTotalPostComments + totalNestedComments;
          }
          let totalViewsOnPost = await fetchTotalViewsOnPost(postId);
          let isLike = await fetchUsersLikeToPostDataByUsersId(id, postId);
          let userData = await fetchUsersById(item.userId);
          let fetchAllLikePosts = await fetchLikeOnParticularPost(postId);
          item.totalLikes =
            fetchAllLikePosts.length > 0 ? fetchAllLikePosts.length : 0;
          item.isLike = isLike.length > 0 ? true : false;
          item.totalComments = totalComments;
          item.totalViews =
            totalViewsOnPost.length > 0 ? totalViewsOnPost.length : 0;
          item.totalShare = 0;
          item.userId = item.userId;
          item.fullName = userData[0].fullName;
          item.profile = userData[0].profileImage
            ? userData[0].profileImage
            : null;
          item.tagPeople = tagPeople;
          item.isViewed = false;
          item.videoDuration = item.videoDuration;

          return item;
        }
        return null;
      })
    );
    fetchOthersPost = fetchOthersPost.sort(
      (a, b) => b.totalLikes - a.totalLikes
    );
    fetchOthersPost = fetchOthersPost.slice(0, 20);
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, fetchOthersPost);
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// export const sharePost = async (req, res) => {
//     try {
//         let { id } = req.user;
//         const { otherUserIds, url, postId } = req.body;
//         console.log('otherUserIds', otherUserIds);

//         // if (!Array.isArray(otherUserIds) || !url) {
//         //     return handleError(res, 400, "Please send otherUserIds (array) and url.");
//         // }

//         const checkMember = await checkUserChatMember(id);

//         // for (const otherUserId of otherUserIds) {
//         let otherUserId = otherUserIds
//         const checkOtherMember = await checkUserChatMember(otherUserId);

//         const commonChats = checkMember.filter(member =>
//             checkOtherMember.some(other => other.chat_id === member.chat_id)
//         );

//         let chatId;

//         if (commonChats.length > 0) {
//             // Chat already exists
//             chatId = commonChats[0].chat_id;
//         } else {
//             // Create new chat
//             const insertChat = await insertIntoChat({ created_by: id });
//             chatId = insertChat.insertId;

//             await insertUserChatMember({ chat_id: chatId, user_id: id });
//             await insertUserChatMember({ chat_id: chatId, user_id: otherUserId });
//         }

//         // Insert shared message
//         const newMessage = {
//             chat_id: chatId,
//             sender_id: id,
//             message: url,
//             message_type: "SHARE",
//         };

//         await insertIntoMessage(newMessage);
//         // }
//         await countSharedPost(postId)
//         return handleSuccess(res, 200, Msg.postSharedSuccessfully);

//     } catch (error) {
//         console.log(error);
//         return handleError(res, 500, Msg.internalServerError);
//     }
// };

export const sharePost = async (req, res) => {
  try {
    let { id } = req.user;
    const { postId } = req.body;

    await countSharedPost(postId);
    return handleSuccess(res, 200, Msg.postSharedSuccessfully);
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchUserAllChats = async (req, res) => {
  try {
    let { id } = req.user;

    const myChats = await retriveALLUserChat(id);

    if (myChats.length > 0) {
      let data = await Promise.all(
        myChats.map(async (item) => {
          if (item.is_group == 0) {
            let [userChat] = await fetchOtherUserChat(id, item.chat_id);
            item.user_id = userChat.user_id;
            item.user_name = userChat.userName;
            item.profileImage = userChat.profileImage;
            item.user = userChat;
          } else {
            item.user_id = 0;
            item.user_name = "";
            item.profileImage = "";
            item.users = {};
          }
        })
      );
      return handleSuccess(res, 200, Msg.dataFoundSuccessful, myChats);
    } else {
      return handleSuccess(res, 200, Msg.dataNotFound, myChats);
    }
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const shareReel = async (req, res) => {
  try {
    let { id } = req.user;
    const { chatIds, url } = req.body;

    if (!Array.isArray(chatIds) || !url) {
      return handleError(res, 400, "Please send chatIds (array) and url.");
    }

    for (const chatId of chatIds) {
      const newMessage = {
        chat_id: chatId,
        sender_id: id,
        message: url,
        message_type: "SHARE",
      };

      await insertIntoMessage(newMessage);
    }

    return handleSuccess(res, 200, Msg.postSharedSuccessfully);
  } catch (error) {
    console.log(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// --------------------------------contact support api------------------------//

export const create_contact_support = async (req, res) => {
  try {
    await insertContactSupport(req.body);
    return handleSuccess(res, 200, "Support request sent successfully.");
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const report_reasons = async (req, res) => {
  try {
    const rows = await fetchAllReportReason();
    return handleSuccess(res, 200, "Report reasons fetched successfully", rows);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const report_post = async (req, res) => {
  try {
    let { id } = req.user;
    let { postId, reportReasonId, customReportMessage } = req.body;
    let reportReason = null;
    if (reportReasonId) {
      reportReason = await fetchAllReportReasonByIds(reportReasonId);
      reportReason = reportReason[0].reason;
    }
    let obj = {
      postId,
      reportReasonId: reportReason ? reportReason : customReportMessage,
      userId: id,
      customReportMessage: null,
    };
    await addUsersReport(obj);
    return handleSuccess(res, 200, "Post reported successfully");
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

// -------------------------user apply to become a investor-------------------------------------//

export const govermentIdType = async (req, res) => {
  try {
    const rows = await fetchAllGovermentIdTypes();
    return handleSuccess(
      res,
      200,
      "Goverments documents fetched successfully",
      rows
    );
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchInvesterForm = async (req, res) => {
  try {
    let { id } = req.user;

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

export const fetchAllRanches = async (req, res) => {
  try {
    let ranch = await fetchAllActiveRanchesModel();
    const data = await Promise.all(
      ranch.map(async (item) => {
        if (item.amenities) {
          item.amenities = item.amenities
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((v) => v.trim());
        }
        item.left_shares = item.total_shares - item.shares_sold;
        item.images = await fetchRanchesMediaModel(item.id);
        item.ranchesDocuments = await fetchRanchesDocumentsModel(item.id);
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
        if (item.amenities) {
          item.amenities = item.amenities
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((v) => v.trim());
        }
        item.left_shares = item.total_shares - item.shares_sold;
        item.images = await fetchRanchesMediaModel(item.id);
        item.ranchesDocuments = await fetchRanchesDocumentsModel(item.id);
        return item;
      })
    );
    return handleSuccess(res, 200, Msg.RANCH_MEDIA_RETRIVED, data[0]);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

function generateSignature(appId, signatureNonce, serverSecret, timestamp) {
  const hash = crypto.createHash("md5"); // Use the MD5 hashing algorithm
  const str = appId + signatureNonce + serverSecret + timestamp; // Concatenate inputs as string
  hash.update(str); // Feed string into hash
  return hash.digest("hex"); // Return hex digest
}

function appendUserIdAndMain(streamId) {
  if (!streamId || typeof streamId !== "string") {
    throw new Error("Invalid streamId");
  }

  const parts = streamId.split("_");
  if (parts.length < 3) {
    throw new Error(
      "streamId must be in the format: live_<userId>_<timestamp>"
    );
  }

  const userId = parts[1];
  return `${streamId}_${userId}_main`;
}

export const checkStreamStatus = async (streamId) => {
  try {
    const fullStreamId = appendUserIdAndMain(streamId); // ✅ Fixed
    if (
      !fullStreamId ||
      typeof fullStreamId !== "string" ||
      fullStreamId.trim().length === 0
    ) {
      throw new Error("Valid streamId is required");
    }

    const cleanStreamId = fullStreamId.trim();
    const nonce = generateNonce();
    const timestamp = Math.floor(Date.now() / 1000);

    const action = "DescribeRTCStreamState";

    const signature = generateSignature(
      APP_ID,
      nonce,
      SERVER_SECRET,
      timestamp
    );

    const params = {
      Action: action,
      AppId: APP_ID,
      SignatureNonce: nonce,
      Timestamp: timestamp,
      StreamId: cleanStreamId,
      SignatureVersion: "2.0",
      SignatureMethod: "MD5",
      Signature: signature,
    };

    const queryString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");

    const apiUrl = `https://rtc-api.zego.im/?${queryString}`;

    const response = await axios.get(apiUrl, {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "ZEGO-Stream-Checker/1.0",
      },
    });

    if (response.data.Code !== 0) {
      return {
        success: false,
        error: response.data.Message || "ZEGO API returned error",
        code: response.data.Code,
        streamId: cleanStreamId,
        details: response.data,
      };
    }

    const data = response.data.Data;

    return {
      success: true,
      data: {
        streamId: data.StreamId,
        state: data.State,
        audioState: data.AudioState,
        videoState: data.VideoState,
        isLive: data.State === 1,
        timestamp: new Date().toISOString(),
        rawData: data,
        IsTest: false,
      },
    };
  } catch (error) {
    if (error.response?.data) {
      return {
        success: false,
        error: error.response.data.Message || "ZEGO API error",
        code: error.response.data.Code,
        streamId,
        details: error.response.data,
      };
    } else if (error.code === "ECONNABORTED") {
      return {
        success: false,
        error: "Request timeout - ZEGO API not responding",
        code: "TIMEOUT",
      };
    } else if (error.request) {
      return {
        success: false,
        error: "No response from ZEGO API - network issue",
        code: "NETWORK_ERROR",
      };
    } else {
      return {
        success: false,
        error: error.message,
        code: "INTERNAL_ERROR",
      };
    }
  }
};

// ----------------------------BEFORE BUY A RANCHES FILL FORMS----------------------------------//

export const applyToBecomeInvestor = async (req, res) => {
  try {
    let { id } = req.user;
    console.log('req.user', req.user);

    const {
      entityTrustFile,
      supportingFiles,
      proofOfFundsFiles,
      signature_file,
    } = req.files;
    let isInvesterExists = await fetchInvesterApplicationFormModelByUserId(id);
    if (isInvesterExists.length > 0) {
      await deleteInvesterApplicationByIds(id);
    }
    req.body.user_id = id;
    req.body.disclosures = null;
    let result = await addApplicationRanchesForm(req.body);
    if (result.insertId) {
      let investorRanchId = result.insertId;
      if (entityTrustFile && entityTrustFile.length > 0) {
        for (const file of entityTrustFile) {
          await insertDocument(
            investorRanchId,
            "entity_Trust_file",
            file.location
          );
        }
      }
      if (supportingFiles && supportingFiles.length > 0) {
        for (const file of supportingFiles) {
          await insertDocument(
            investorRanchId,
            "supporting_files",
            file.location
          );
        }
      }
      if (proofOfFundsFiles && proofOfFundsFiles.length > 0) {
        for (const file of proofOfFundsFiles) {
          await insertDocument(
            investorRanchId,
            "proof_of_funds_files",
            file.location
          );
        }
      }
      if (signature_file && signature_file.length > 0) {
        for (const file of signature_file) {
          await insertDocument(
            investorRanchId,
            "signature_file",
            file.location
          );
        }
      }
      return handleSuccess(res, 200, Msg.APPLY_TO_BECOME_INVESTOR_SUCCESSFULLY);
    } else {
      return handleError(res, 400, Msg.APPLY_TO_BECOME_INVESTOR_FAILED);
    }
  } catch (error) {
    console.error("Error applying to ranches:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchInvesterApplicationByUserId = async (req, res) => {
  try {
    let { id } = req.user;
    let rows = await fetchInvesterApplicationFormModelByUserId(id);
    if (!rows || rows.length === 0) {
      let data = null;
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No investor Application found",
        data,
      });
    }
    let media = await fetchInvesterApplicationMediaModel(rows[0].id);
    let raw = rows[0].disclosures;
    if (raw) {
      // const once = JSON.parse(raw);
      // rows[0].disclosures = typeof once === "string" ? JSON.parse(once) : once;
      rows[0].disclosures = null;
    } else {
      rows[0].disclosures = null;
    }
    rows[0].documents = media.length > 0 ? media : [];
    return handleSuccess(res, 200, Msg.INVESTER_APPLICATION_UPDATED, rows[0]);
  } catch (error) {
    console.error("fetchInvesterForm error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchCountriesCodeWithCountries = async (req, res) => {
  try {
    let rows = await fetchCountriesCodeWithCountriesModel();
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Data not found",
        data: [],
      });
    }
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, rows);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchInvestingAs = async (req, res) => {
  try {
    let rows = await fetchInvestingAsModel();
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Data not found",
        data: [],
      });
    }
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, rows);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchPrefferedOwnership = async (req, res) => {
  try {
    let rows = await fetchPrefferedOwnershipModel();
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Data not found",
        data: [],
      });
    }
    return handleSuccess(res, 200, Msg.dataFoundSuccessful, rows);
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};


// ---------------------------purchases ranches---------------------------------------------------//

export const myInvestment = async (req, res) => {
  try {
    let { id } = req.user
    let fetchInvesterIds = await fetchInvesterApplicationFormModelByUserId(id);
    if (!fetchInvesterIds || fetchInvesterIds.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Investor not found",
        data: [],
      });
    }
    let investerId = fetchInvesterIds[0].id;
    let rows = await totalCalculationSharedPurchase(investerId);
    rows = await Promise.all(
      rows.map(async (item) => {
        item.images = await fetchRanchesMediaModel(item.ranch_id);
        item.total_investments = Number(item.total_investments)
        item.shared_owned = Number(item.ownership_percentage)
        item.ownership_percentage = Number(item.ownership_percentage)
        item.ranch_name = item.name
        item.shares_purchased = Number(item.total_shares_purchased)
        item.total_amount = Number(item.total_investments)
        item.investment_date = item.created_at
        return item;
      })
    );

    return handleSuccess(res, 200, "Invested ranches retrieved successfully", rows);

  } catch (error) {
    console.error("myInvestment error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const viewMyInvestementById = async (req, res) => {
  try {
    let { id } = req.query;
    let fetchInvesterIds = await fetchInvesterApplicationFormModelByUserId(req.user.id)
    let investerId = fetchInvesterIds[0].id
    let rows = await modelFetchInvestedRanchesById(id);
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Ranches data not found",
        data: {},
      });
    }
    let data = await Promise.all(
      rows.map(async (item) => {
        let fetchRanches = await fetchRanchesByIdUsersModel(item.ranch_id);
        item.images = await fetchRanchesMediaModel(item.ranch_id);
        item.location = fetchRanches[0].location;
        item.ranch_name = fetchRanches[0].name;
        item.current_value = fetchRanches[0].price_per_share;
        item.total_shares = fetchRanches[0].total_shares;
        item.remainingShares = fetchRanches[0].remainingShares;
        item.investment_date = item.created_at;
        item.id = item.id;
        if (fetchRanches[0].amenities) {
          item.amenities = fetchRanches[0].amenities
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((v) => v.trim());
        }
        item.acres = fetchRanches[0].acres;
        return item;
      })
    );
    let fetchChatDetails = await fetchChatIdThroughRanchesIdAndInvestor(rows[0].ranch_id, investerId)
    console.log('fetchChatDetails', fetchChatDetails);
    let unredChats;
    if (fetchChatDetails.length === 0) {
      console.log('>>>>>>>>>>>>>>');

      unredChats = 0
    } else {
      unredChats = await fetchUnreadRanchesChatCountById(fetchChatDetails[0].id, investerId)
    }
    let rowss = await fetchInvestedRanchesByRanchesId(rows[0].ranch_id, investerId);
    let fetchAllRanchesOfGivenRanches = await modelFetchInvestedRanchesByRanchesId(rows[0].ranch_id, investerId)
    fetchAllRanchesOfGivenRanches = fetchAllRanchesOfGivenRanches.map((item) => ({ ...item, total_amount: item.total_amount ? parseFloat(item.total_amount) : 0 }));
    data[0].purchaseInvesterDetails = fetchAllRanchesOfGivenRanches;
    data[0].total_shares = Number(rowss[0].total_shares);
    data[0].investor_shares_purchased = Number(rowss[0].investor_shares_purchased);
    data[0].total_investments = Number(rowss[0].investor_total_investment);
    data[0].other_investors_share_percentage = Number(rowss[0].other_investors_shares);
    data[0].ownership_percentage = Number(rowss[0].ownership_percentage);
    data[0].shared_owned = Number(rowss[0].ownership_percentage);
    data[0].your_shares = Number(rowss[0].ownership_percentage);
    data[0].available_share_percentage = Number(rowss[0].available_shares);
    data[0].shares_purchased = Number(rowss[0].shares_purchased);
    data[0].total_amount = Number(rowss[0].total_amount);
    data[0].invester_ranches_status = rowss[0].payment_status;
    data[0].escrow_details = {
      total_amount: rowss[0].total_amount,
      reference_id: rowss[0].escrow_reference_id,
      status: "AWAITING_WIRE_TRANSFER",
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      wire_instructions: {
        beneficiary_name: "Trophy Talk Escrow Account",
        beneficiary_account: "4104428",
        beneficiary_routing: "102110136",
        bank_name: "Points West Community Bank",
        bank_address: "[Get bank address from your bank]",
        reference: rowss[0].escrow_reference_id,
        special_instructions: `Include reference ID: ${rowss[0].escrow_reference_id} in transfer notes`
      },
      contact_info: {
        bank_contact: "Points West Community Bank Support",
        phone: "[Bank phone number]",
        email: "[Bank email]"
      }
    };
    data[0].ranchesOwnershipPdf = rowss[0].ranchesOwnershipPdf;
    data[0].unReadMessagesCount = unredChats.length > 0 ? unredChats.length : 0
    return handleSuccess(res, 200, "Ranches data found successfully", data[0]);
  } catch (error) {
    return handleError(res, 500, error);
  }
};

// ------------------------new flow of ranches reserve------------------------------------------//

export const ranches_purchases = async (req, res) => {
  try {
    const { id } = req.user;
    const { ranchId, shares, amountPerShare, amount } = req.body;

    const fetchInvestor = await fetchInvesterApplicationFormModelByUserId(id);
    if (!fetchInvestor?.length) {
      return res.status(400).json({ message: "Investor not found" });
    }
    let fetchRanchesById = await fetchRanchesByIdUsersModel(ranchId);
    const referenceId = `ESC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    let remaining = fetchRanchesById[0].remainingShares - shares;

    const obj = {
      ranch_id: ranchId,
      investor_id: fetchInvestor[0].id,
      shares_purchased: shares,
      price_per_share: amountPerShare,
      total_amount: amount,
      payment_status: "PENDING_ESCROW_DEPOSIT",
      reservation_status: "PENDING",
      escrow_transaction_id: null,
      escrow_reference_id: referenceId
    };

    let insertRanchesPurchase = await ranchesPurchasesByInvesters(obj);
    // await updateTotalShares(remaining, ranchId);
    return res.status(200).json({
      success: true,
      message: "Please complete payment via wire transfer to escrow",
      purchase_id: insertRanchesPurchase.insertId,
      invester_id: fetchInvestor[0].id,
      escrow_payment: {
        total_amount: amount,
        reference_id: referenceId,
        status: "AWAITING_WIRE_TRANSFER",
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        wire_instructions: {
          beneficiary_name: "Trophy Talk Escrow Account",
          beneficiary_account: "4104428",
          beneficiary_routing: "102110136",
          bank_name: "Points West Community Bank",
          bank_address: "[Get bank address from your bank]",
          reference: referenceId,
          special_instructions: `Include reference ID: ${referenceId} in transfer notes`
        },
        contact_info: {
          bank_contact: "Points West Community Bank Support",
          phone: "[Bank phone number]",
          email: "[Bank email]"
        }
      },
      next_steps: [
        "Complete wire transfer within 3 business days",
        "Keep your reference ID for tracking",
        "You will receive email confirmation when funds are received",
        "Investment will be verified after funds clear"
      ]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const investorDashboardData = async (req, res) => {
  try {
    let { type } = req.query;
    let id = 0
    if (type == 'app') {
      let user_id = req.user.id;
      let fetchInvseterById = await getInvesterByUserIdModel(user_id);
      id = fetchInvseterById[0].id;
    } else {
      id = req.user.id;
    }
    let investorStats = await fetchInvestorStats(id);
    let investorRanches = await getInvestedRanchesByInvesterId(id);
    if (investorRanches.length > 0) {
      investorRanches = await Promise.all(investorRanches.map(async (item) => {
        let fetchRanchesImages = await fetchRanchesMediaModel(item.ranch_id);
        item.images = fetchRanchesImages.length > 0 ? fetchRanchesImages : [];
        return item;
      }));
    } else {
      investorRanches = [];
    }
    investorStats[0].investorRanches = investorRanches
    return handleSuccess(res, 200, Msg.INVESTOR_DASHBOARD_DATA_FETCHED, investorStats[0]);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const invester_create_contact_support = async (req, res) => {
  try {
    let { id } = req.user
    let fullName = 'Justin';
    let fetchInvseterById = await getInvesterByUserIdModel(id);
    req.body.user_id = fetchInvseterById[0].id;
    await investerInsertContactSupport(req.body);
    let data = {
      email: req.body.email,
      message: req.body.message,
      phoneNumber: req.body.phoneNumber,
      businessName: null,
      categoryId: null,
      user_id: id,
    };
    await sendUserSupportEmail({ fullName, data, res });
    return handleSuccess(res, 200, "Support request send successfully.");
  } catch (error) {
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const fetchAllPendingRanches = async (req, res) => {
  try {
    let { id } = req.user
    let fetchInvesterIds = await fetchInvesterApplicationFormModelByUserId(id);
    if (!fetchInvesterIds || fetchInvesterIds.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Investor not found",
        data: [],
      });
    }
    let investerId = fetchInvesterIds[0].id;
    let rows = await fetchAllPendingRanchesModel(investerId);
    rows = await Promise.all(
      rows.map(async (item) => {
        item.images = await fetchRanchesMediaModel(item.ranch_id);
        item.total_investments = Number(item.total_amount)
        item.shared_owned = Number(item.ownership_percentage)
        item.ownership_percentage = Number(item.ownership_percentage)
        item.ranch_name = item.name
        item.shares_purchased = Number(item.shares_purchased)
        item.total_amount = Number(item.total_investments)
        item.investment_date = item.created_at
        return item;
      })
    );

    return handleSuccess(res, 200, "Invested ranches retrieved successfully", rows);

  } catch (error) {
    console.error("myInvestment error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};


export const escrowPaymentDetails = async (req, res) => {
  try {
    let { id } = req.query;
    let rowss = await fetchAllPendingRanchesModelPending(id)
    rowss[0].ranch_name = rowss[0].name;
    rowss[0].total_shares = Number(rowss[0].total_shares);
    rowss[0].shares_purchased = Number(rowss[0].shares_purchased);
    rowss[0].total_amount = Number(rowss[0].total_amount);
    rowss[0].per_price_share = Number(rowss[0].price_per_share);
    rowss[0].invester_ranches_status = rowss[0].payment_status;
    rowss[0].escrow_details = {
      total_amount: rowss[0].total_amount,
      reference_id: rowss[0].escrow_reference_id,
      status: "AWAITING_WIRE_TRANSFER",
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      wire_instructions: {
        beneficiary_name: "Trophy Talk Escrow Account",
        beneficiary_account: "4104428",
        beneficiary_routing: "102110136",
        bank_name: "Points West Community Bank",
        bank_address: "[Get bank address from your bank]",
        reference: rowss[0].escrow_reference_id,
        special_instructions: `Include reference ID: ${rowss[0].escrow_reference_id} in transfer notes`
      },
      contact_info: {
        bank_contact: "Points West Community Bank Support",
        phone: "[Bank phone number]",
        email: "[Bank email]"
      }
    };
    return handleSuccess(res, 200, "Ranches data found successfully", rowss[0]);
  } catch (error) {
    return handleError(res, 500, error);
  }
};


// ------------------------here is escrow webhook secret key generate---------------------------------//

// export const createEscrowWebhookWithAPI = async () => {
//   try {
//     const ESCROW_API_KEY = '18271_gpeRXnb3aWQZEojJXrOeepE0iZyLaNAEcriycTd0CSoq9GFIXoOQwOu7AxjZgbKH';
//     const ESCROW_API_URL = 'https://api.escrow.com';

//     const webhookData = {
//       url: 'https://18.219.62.132:4000/webhook-escrow',
//       events: [
//         'transaction.created',
//         'payment.received', 
//         'transaction.completed',
//         'transaction.cancelled'
//       ]
//     };

//     const response = await axios.post(
//       `${ESCROW_API_URL}/webhook`,
//       webhookData,
//       {
//         auth: {
//           username: ESCROW_API_KEY,
//           password: '' 
//         },
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     console.log('✅ Webhook created successfully:');
//     console.log('Webhook ID:', response.data.id);
//     console.log('🔐 WEBHOOK SECRET:', response.data.secret); // ← YAHAN SECRET KEY MIL JAYEGA
//     console.log('Webhook URL:', response.data.url);

//     return response.data;

//   } catch (error) {
//     console.error('❌ Error creating webhook via API:');
//     if (error.response) {
//       console.error('Status:', error.response.status);
//       console.error('Data:', error.response.data);
//     } else {
//       console.error('Message:', error.message);
//     }
//     throw error;
//   }
// };

export const createEscrowWebhookWithAPI = async () => {
  try {
    const ESCROW_API_KEY = '18271_gpeRXnb3aWQZEojJXrOeepE0iZyLaNAEcriycTd0CSoq9GFIXoOQwOu7AxjZgbKH';
    const ESCROW_API_URL = 'https://api.escrow.com';

    const response = await axios.get(
      `${ESCROW_API_URL}/webhook`,
      {
        auth: {
          username: ESCROW_API_KEY,
          password: ''
        }
      }
    );

    console.log('📋 Existing Webhooks:');
    response.data.forEach(webhook => {
      console.log('---');
      console.log('ID:', webhook.id);
      console.log('URL:', webhook.url);
      console.log('Secret:', webhook.secret); // ← YAHAN EXISTING SECRET KEY MIL JAYEGA
      console.log('Events:', webhook.events);
    });

    // return response.data;
  } catch (error) {
    console.error('❌ Error creating webhook:', error.message);
    throw error;
  }
};

// ------------------------ranches booking dates availability---------------------------------------------------//

export const fetchRanchesBookingDatesAvailability = async (req, res) => {
  try {
    let { id } = req.user;
    let fetchInvesterIds = await fetchInvesterApplicationFormModelByUserId(id);
    let investor_id = fetchInvesterIds[0].id;
    let { ranch_id } = req.query;

    let fetchBlackoutDates = await fetchRanchesBlackoutDaysModel(ranch_id);
    let fetchBookedDates = await fetchRanchesBookedDatesModel(ranch_id, investor_id);
    let fetchMyBookedDates = await fetchMyRanchesBookedDatesModel(ranch_id, investor_id);
    let fetchApprovalBookedDates = await fetchMyApprovalRanchesBookedDatesModel(ranch_id, investor_id);

    let maximumDays = 14;
    let daysTake = fetchApprovalBookedDates.length;
    let leftDays = maximumDays - daysTake;

    let data = {
      ranch_id,
      fetchBlackoutDates,
      fetchBookedDates,
      fetchMyBookedDates,
      daysTake,
      leftDays
    };
    return handleSuccess(res, 200, "Ranches booking dates availability retrieved successfully", data);
  } catch (error) {
    console.error("Error in fetchRanchesBookingDatesAvailability:", error);
    return handleError(res, 500, error.message);
  }
};

export const bookingRanchesBooking = async (req, res) => {
  try {
    let { id } = req.user;
    let fetchInvesterIds = await fetchInvesterApplicationFormModelByUserId(id);
    let investor_id = fetchInvesterIds[0].id;
    let { ranch_id, booked_dates } = req.body;
    if (!booked_dates || booked_dates.length === 0) {
      return handleError(res, 400, "Dates are required");
    }
    const bookingData = { ranch_id, investor_id, status: "pending", reason_for_rejection: null };
    const bookingResult = await insertRanchBookingModel(bookingData);
    const booking_id = bookingResult.insertId;
    const insertPromises = booked_dates.map((date) =>
      insertRanchBookedDatesModel({
        booking_id,
        booked_dates: date,
      })
    );

    await Promise.all(insertPromises);
    return handleSuccess(res, 200, "Ranch booking successful. Awaiting approval.");
  } catch (error) {
    console.error("Error in bookingRanchesBooking:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchRanchesBooking = async (req, res) => {
  try {
    let { id } = req.user;
    let { ranch_id, status } = req.query;
    let fetchInvesterIds = await fetchInvesterApplicationFormModelByUserId(id);
    let investor_id = fetchInvesterIds[0].id;
    let fetchBookedDates = await fetchBookingRanchesById(ranch_id, investor_id, status);
    let grouped = {};
    for (let b of fetchBookedDates) {
      if (!grouped[b.id]) {
        grouped[b.id] = {
          id: b.id,
          ranch_id: b.ranch_id,
          investor_id: b.investor_id,
          booked_dates: [],
          status: b.status,
          reason_for_rejection: b.reason_for_rejection,
          created_at: b.created_at,
          approved_at: b.approved_at,
        };
      }
      grouped[b.id].booked_dates.push(b.booked_dates);
    }

    let finalResult = Object.values(grouped);
    finalResult.sort((a, b) => {
      let dateA = new Date(status === 'approved' ? a.approved_at || 0 : a.created_at || 0);
      let dateB = new Date(status === 'approved' ? b.approved_at || 0 : b.created_at || 0);
      return dateB - dateA;
    });
    let data = { ranch_id, fetchBookedDates: finalResult };
    return handleSuccess(res, 200, "Ranches booking dates availability retrieved successfully", data);
  } catch (error) {
    console.error("Error in fetchRanchesBooking:", error);
    return handleError(res, 500, error.message);
  }
};


// -------------------------------tetsing--------------------------------------------------------------------//

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generate_presigned_url = async (req, res) => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName and fileType are required" });
    }

    const uniqueFileName = `${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.json({
      uploadUrl: signedUrl,
      fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`,
      expiresIn: "3600 seconds (1 hour)"
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ error: "Failed to generate pre-signed URL" });
  }
};

export const fetchInvestorAllDocs = async (req, res) => {
  try {
    function formatFileType(str) {
      if (!str) return str;
      str = str.replace(/_/g, " ");
      str = str.replace(/([a-z])([A-Z])/g, "$1 $2");
      str = str.replace(/\b\w/g, (c) => c.toUpperCase());
      return str;
    }
    let { id } = req.user;
    let { ranch_id } = req.query;
    let rows = await fetchInvesterApplicationFormModelByUserId(id);
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No investor Application found",
        data: null,
      });
    }
    let media = await fetchInvesterApplicationMediaModel(rows[0].id);
    let ranchData = await modelFetchInvestedRanchesByRanchesId(ranch_id, rows[0].id);
    ranchData.map(item => {
      media.push({
        id: item.id,
        investor_id: rows[0].id,
        fileType: "ranchesOwnershipPdf",
        files: item.ranchesOwnershipPdf,
        created_at: item.created_at,
        updated_at: item.updated_at
      });
    });
    media = media.map(item => ({
      ...item,
      fileType: formatFileType(item.fileType)
    }));
    return handleSuccess(res, 200, Msg.INVESTER_APPLICATION_UPDATED, media);
  } catch (error) {
    console.error("fetchInvesterForm error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const notActiveInvestor = async (req, res) => {
  try {
    let { id } = req.user;
    let { chatId } = req.body
    let rows = await updateNotActiveInvestorChats(chatId);
    return handleSuccess(res, 200, 'investor inactive successfully');
  } catch (error) {
    console.error("fetchInvesterForm error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};


export const sendNotificationToGivenDeviceToken = async (req, res) => {
  try {
    const { fcmToken, title, body, image } = req.body;

    if (!fcmToken) {
      return handleError(res, 400, "FCM token is required");
    }

    const response = await sendTestNotification({
      token: fcmToken,
      title,
      body,
      image,
      data: {
        profileImage: image,
        customKey: "CustomValue"
      }
    });

    return handleSuccess(res, 200, response.message);

  } catch (error) {
    console.error("API dynamic notification error:", error);
    return handleError(res, 500, Msg.internalServerError);
  }
};

// -----------------------------NEW FLOW OF ADD TO CART------DEVELOPER-KARAN PATEL---------------//

export const addProductToCart = async (req, res) => {
  try {
    const { product_id, color_id, size_id, quantity } = req.body;
    const user = req.user;
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    const product = await getProductDetailsId(product_id);
    if (!product.length) {
      return handleError(res, 400, Msg.PRODUCT_NOT_AVAILABLE);
    }

    const seller_details = await getSellerDetailsByUserId(user.id);
    if (product[0].seller_id === seller_details[0]?.id) {
      return handleError(res, 400, Msg.USER_Cart_Error);
    }
    let variant_id = null;
    const variant = await fetchProductVariantModel(product_id, color_id, size_id ? size_id : null);
    if (!variant.length) {
      return handleError(res, 400, "Variant not available");
    }

    if (variant[0].stock_quantity < qty) {
      return handleError(res, 400, `Only ${variant[0].stock_quantity} items available`);
    }
    variant_id = variant[0].id;
    const alreadyInCart = await checkAllredyInTheCartOrNot(user.id, product_id, variant_id ? variant_id : null)
    if (alreadyInCart.length) {
      await updateCartQuantityModel(alreadyInCart[0].id, alreadyInCart[0].quantity + qty);
    } else {
      await addToCartWithVarient(user.id, product_id, variant_id, qty);
    }
    return handleSuccess(res, 201, Msg.ADD_PRODUCT_To_Cart);
  } catch (err) {
    console.error("addProductToCart error:", err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const getUserCartData = async (req, res) => {
  try {
    const user = req.user;
    const cartItems = await getAllCartProductModel(user.id);
    const cartMap = new Map();
    let subtotal = 0;
    let shipping_charge = 0;

    for (const item of cartItems) {
      const product = await getProductDetailsId(item.pId);
      if (!product?.length) continue;
      const variant = await getVariantDetailsById(item.variant_id);
      if (!variant?.length) continue;
      const v = variant[0];
      const key = item.variant_id;
      if (!cartMap.has(key)) {
        const images = await getUserProductImagesByColorModal(item.pId, v.color_id);
        cartMap.set(key, {
          cart_id: item.id,
          product_id: product[0].pId,
          product_name: product[0].product_name,
          price: product[0].final_price,
          quantity: item.quantity,
          availableStock: v.stock_quantity,
          color: v.color_name,
          size: v.size_value,
          size_system: v.size_system,
          fit_type: v.fit_type,
          image: images?.[0]?.pImage || null,
          item_total: product[0].final_price * item.quantity,
          variant_id: item.variant_id
        });
        shipping_charge += product[0].shipping_charges;
        subtotal += product[0].final_price * item.quantity;
      }
      else {
        const existing = cartMap.get(key);
        existing.quantity += item.quantity;
        existing.item_total = existing.quantity * existing.price;
        subtotal += product[0].final_price * item.quantity;
      }
    }
    return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, {
      subtotal,
      shipping_charge,
      total: subtotal + shipping_charge,
      cart: Array.from(cartMap.values())
    });

  } catch (err) {
    console.error("getUserCartData error:", err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const updateCartData = async (req, res) => {
  try {
    const { action, cart_id } = req.body;
    const user = req.user;
    const cartItem = await checkAvailableVariantInCartModel(cart_id);
    const variant = await getVariantDetailsById(cartItem[0].variant_id);
    const availableStock = variant[0].stock_quantity;
    if (!cartItem?.length) {
      return handleError(res, 400, Msg.NO_PRODUCT_IN_CART);
    }
    const cartRow = cartItem[0];
    if (action === "Inc") {
      if (cartRow.quantity + 1 > availableStock) {
        return handleError(res, 400, Msg.OUT_OF_STOCK);
      }
      await updateCartQuantityModel(cartRow.id, cartRow.quantity + 1);
      return handleSuccess(res, 200, Msg.CART_UPDATED);
    }
    if (action === "Dec") {
      if (cartRow.quantity === 1) {
        await deleteCartProductByIdModal(cartRow.id);
        return handleSuccess(res, 200, Msg.CART_UPDATED);
      }
      await updateCartQuantityModel(cartRow.id, cartRow.quantity - 1);
      return handleSuccess(res, 200, Msg.CART_UPDATED);
    }
    return handleError(res, 400, "Invalid action");
  } catch (err) {
    console.error("updateCartData error:", err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const deleteUserCartData = async (req, res) => {
  try {
    const { cart_id } = req.body;
    const cart_data = await getCartDataByCartIdModal(cart_id);
    if (cart_data?.length == 0) {
      return handleError(res, StatusCode.status400, Msg.PRODUCT_NOT_AVAILABLE);
    }
    const delete_cart_data = await deleteCartProductByIdModal(cart_id);
    if (delete_cart_data.affectedRows > 0) {
      return handleSuccess(res, StatusCode.status200, Msg.CART_DELETE);
    } else {
      return handleError(res, StatusCode.status400, Msg.CART_DELETE_ERROR);
    }
  } catch (err) {
    return handleError(res, StatusCode.status500, Msg.internalServerError);
  }
};

export const confirmAndPay = async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { orderItem, shipping_price, total_prices } = req.body;
    if (!Array.isArray(orderItem) || orderItem.length === 0) {
      return handleError(res, 400, "Order items required");
    }
    for (const item of orderItem) {
      if (!item.product_id || !item.variant_id || !item.quantity) {
        return handleError(res, 400, "Invalid order item format");
      }
      const [variant] = await getVariantById(item.variant_id);
      if (!variant) {
        return handleError(res, 400, "Variant not found");
      }
      if (variant.stock_quantity < item.quantity) {
        return handleError(res, 400, `Out of stock: ${variant.color_name} ${variant.size_value}`);
      }
    }
    const existing = await fetchOrderSummary(userId);
    if (existing.length > 0) {
      await changeStatusOfOrderSummarry(userId);
    }
    orderItem = await Promise.all(orderItem.map(async (item) => {
      let product = await getProductDetailsId(item.product_id)
      item.delivery_charge = product[0].shipping_charges;
      return item;
    }))
    const summaryData = {
      user_id: userId,
      shipping_price,
      total_prices,
      orderItem: JSON.stringify(orderItem),
      status: 1
    };
    const result = await modelOrderSummary(summaryData);
    if (result.affectedRows > 0) {
      return handleSuccess(res, StatusCode.status200, Msg.ORDER_SUMMARY_ADDED_SUCCESSFULLY);
    }
    return handleError(res, StatusCode.status400, Msg.ORDER_SUMMARY_ADDED_FAILED);
  } catch (err) {
    console.error("confirmAndPay error:", err);
    return handleError(res, 500, Msg.internalServerError);
  }
};

export const payNow = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const {
      orderSummaryId,
      shippingAddressId,
      name,
      email,
      address,
      city,
      state,
      zip_code,
      phone_number,
      status,
    } = req.body;

    if (!status) {
      return handleError(res, 400, "Please send Status");
    }

    // ---------------- SHIPPING ----------------
    let shippingId = shippingAddressId;
    if (!shippingId) {
      const shippingDetailed = {
        user_id: userId,
        name,
        email,
        address,
        city,
        state,
        zip_code,
        phone_number,
      };
      const result = await addUserShippingAddress(shippingDetailed);
      shippingId = result.insertId;
    }

    const shippingData = await fetchUserShippingAddressByShippingId(shippingId);
    const parseShippingDetailed = JSON.stringify(shippingData);
    const [summary] = await fetchOrderSummaryByOrderId(orderSummaryId);
    if (!summary) {
      return handleError(res, 404, "orderSummaryId Not Found");
    }
    const items = JSON.parse(summary.orderItem);
    const totalAmount = summary.total_prices;
    // const totalAmountInCents = Math.round(totalAmount * 100);
    let totalAmountInCents = Math.round(totalAmount * 100);

    const order_Id = await generateFiveDigitNumber();
    if (status == 1) {
      let [wallet] = await fetchWalletBalanceById(userId);
      wallet.balance = parseFloat(wallet.balance);
      if (!wallet || wallet.balance < totalAmount) {
        return handleError(res, 400, "Insufficient wallet balance");
      }
      const orderData = {
        id: order_Id, userId, totalAmount, shippingDetailed: parseShippingDetailed, order_summaryId: orderSummaryId,
      };

      const result = await createOrders(orderData);
      if (!result.insertId) {
        return handleError(res, 400, Msg.ORDER_PLACED_FAILED);
      }

      let productSellerId = [];
      await Promise.all(
        items.map(async (item) => {
          const [variant] = await getVariantById(item.variant_id);
          if (!variant) throw new Error("Variant not found");

          if (variant.stock_quantity < item.quantity) {
            throw new Error(`Out of stock: ${variant.color_name} ${variant.size_value}`);
          }

          await insertOrdersItem({
            order_id: order_Id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price_at_order: item.price_at_orders,
            delivery_charge: item.delivery_charge || 0,
          });

          const updated = await updateVariantStockModel(item.variant_id, item.quantity);
          if (updated.affectedRows === 0) {
            throw new Error("Stock update failed");
          }
          productSellerId.push(variant.seller_id);
        })
      );
      await checkoutProductModel(userId);
      await changeStatusOfOrderSummarry(userId);
      await insertWalletHistory({ user_id: userId, amount: totalAmount, description: "Product Purchase", status: 1, transaction_id: generateTransactionId(), });
      // await sendNotificationToAppSeller({ productSellerId, orderId: order_Id, id: userId });
      return res.json({ success: true, Status: 200, Message: "Order placed successfully", order_Id });
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Your Order" },
            unit_amount: totalAmountInCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          type: "product_order",
          user_id: userId.toString(),
          order_Id: order_Id.toString(),
          orderSummaryId: orderSummaryId.toString(),
          items: summary.orderItem,
          parseShippingDetailed,
          totalAmount: totalAmount.toString(),
        },
      },
      mode: "payment",
      success_url: `${baseurl}/payment/success`,
      cancel_url: `${baseurl}/payment/cancel`,
    });
    return res.status(200).json({ url: session.url, order_Id });
  } catch (err) {
    console.error("Checkout error:", err);
    return handleError(res, 500, err.message || Msg.internalServerError);
  }
};

export const fetchUserOrdersByUserId = async (req, res) => {
  try {
    const { id: userId } = req.user;
    let orders = await modelFetchUserOrdersByUserId(userId);
    if (!orders.length) {
      return handleError(res, 404, "No Orders list");
    }
    orders = await Promise.all(
      orders.map(async (order) => {
        const items = await fetchOrdersItem(order.id);
        const totalQuantity = items.reduce((sum, i) => sum + Number(i.quantity), 0);
        return { ...order, totalItem: totalQuantity, totalAmount: order.total_prices };
      })
    );
    return handleSuccess(res, 200, "Order found successfully", orders);
  } catch (error) {
    console.error("fetchUserOrdersByUserId:", error);
    return handleError(res, 500, error.message);
  }
};

export const fetchUserOrderByOrderId = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { orderId } = req.query;
    const sellerInfo = await fetchSellerInfoById(userId);
    const seller_id = sellerInfo?.length ? sellerInfo[0].id : 0;
    const orders = await modelFetchOrdersByOrderId(orderId);
    if (!orders.length) {
      return handleError(res, 404, "No Orders found");
    }
    const order = orders[0];
    order.shippingDetailed = order.shippingDetailed ? JSON.parse(order.shippingDetailed) : {};
    const [orderBookedBy] = await fetchUsersById(order.userId);
    const orderItems = await fetchOrderItemByID(order.id);
    const enrichedItems = await Promise.all(
      orderItems.map(async (i) => {
        const isSelfProduct = i.seller_id === seller_id;
        const images = await getUserProductImagesByColorModal(i.product_id, i.color_id);
        return {
          product_id: i.product_id,
          variant_id: i.variant_id,
          product_name: i.product_name,
          quantity: i.quantity,
          price_at_order: i.price_at_order,
          size: i.size_value,
          size_system: i.size_system,
          fit_type: i.fit_type,
          color: i.color_name,
          productImages: images || [],
          isSelfProduct,
          deliveryStatus: order.delivery_status,
          shippingCharges: order.shipping_price || 0,
        };
      })
    );
    const subtotal = enrichedItems.reduce(
      (sum, i) => sum + i.price_at_order * i.quantity,
      0
    );
    const shippingCharge = order.shipping_price || 0;
    let totalCalculateShippingAndAmount = (Number(subtotal) + Number(shippingCharge)).toFixed(2);
    return handleSuccess(res, 200, "Order found successfully", {
      order_id: order.id,
      order_date: order.order_date,
      paymentStatus: order.paymentStatus,
      orderBookedBy,
      shippingDetailed: order.shippingDetailed,
      orderStatus: order.orderStatus,
      paymentSummary: {
        subtotal: Number(subtotal).toFixed(2),
        shipping: Number(shippingCharge).toFixed(2),
        total: totalCalculateShippingAndAmount,
      },
      products: enrichedItems,
    });
  } catch (error) {
    console.error("fetchUserOrderByOrderId:", error);
    return handleError(res, 500, error.message);
  }
};

// export const fetchUserOrderByOrderId = async (req, res) => {
//   try {
//     const { id: userId } = req.user;
//     const { orderId } = req.query;
//     const sellerInfo = await fetchSellerInfoById(userId);
//     if (!sellerInfo.length) {
//       return handleError(res, 403, "Seller not found");
//     }
//     const seller_id = sellerInfo[0].id;
//     const orders = await modelFetchOrdersByOrderId(orderId);
//     if (!orders.length) {
//       return handleError(res, 404, "Order not found");
//     }
//     const order = orders[0];
//     order.shippingDetailed = order.shippingDetailed
//       ? JSON.parse(order.shippingDetailed)
//       : {};
//     const [orderBookedBy] = await fetchUsersById(order.userId);
//     const orderItems = await fetchOrderItemByIDForSeller(order.id, seller_id);
//     if (!orderItems.length) {
//       return handleSuccess(res, 200, "Order found successfully", {
//         order_id: order.id,
//         products: [],
//         paymentSummary: {
//           subtotal: "0.00",
//           shipping: "0.00",
//           total: "0.00",
//         }
//       });
//     }
//     const products = await Promise.all(
//       orderItems.map(async (i) => {
//         const images = await getUserProductImagesByColorModal(
//           i.product_id,
//           i.color_id
//         );

//         return {
//           product_id: i.product_id,
//           variant_id: i.variant_id,
//           product_name: i.product_name,
//           quantity: i.quantity,
//           price_at_order: i.price_at_order,
//           size: i.size_value,
//           size_system: i.size_system,
//           fit_type: i.fit_type,
//           color: i.color_name,
//           productImages: images || [],
//           isSelfProduct: true,
//           deliveryStatus: i.delivery_status,
//           shippingCharges: i.delivery_charge
//         };
//       })
//     );
//     const subtotal = products.reduce(
//       (sum, p) => sum + (p.price_at_order * p.quantity),
//       0
//     );
//     const shippingCharge = Number(order.shipping_price || 0);
//     const total = subtotal + shippingCharge;
//     return handleSuccess(res, 200, "Order found successfully", {
//       order_id: order.id,
//       order_date: order.order_date,
//       paymentStatus: order.paymentStatus,
//       orderBookedBy,
//       shippingDetailed: order.shippingDetailed,
//       orderStatus: order.orderStatus,
//       paymentSummary: {
//         subtotal: subtotal.toFixed(2),
//         shipping: shippingCharge.toFixed(2),
//         total: total.toFixed(2),
//       },
//       products
//     });

//   } catch (error) {
//     console.error("fetchUserOrderByOrderId:", error);
//     return handleError(res, 500, error.message);
//   }
// };