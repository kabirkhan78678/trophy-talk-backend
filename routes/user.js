import express from 'express';
import controller from '../controllers/index.js';
import {
  userSignUp, userSignIn, emailVallidation, passwordVallidate, passwordChange,
  socialLoginValidation, createPostValidation, supportVallidation,
  handleValidationErrors,
  ranchApplicationValidation
} from '../vallidation/userVallidation.js';
import { authenticateUser } from '../middleware/userAuth.js';
import { upload } from '../middleware/upload.js'
import { addDeliveryAddress, addProductToCart, addProductToFavorites, deleteUserCartData, getFavoriatesProductByID, getFavoriatesProductList, getUserCartData, getUserShipplingAdress, searchUserByUserName, updateCartData, create_contact_support } from '../controllers/user_controller.js';
import { DeleteCartProduct, DeleteProduct, GetProductId, UpdateCart, AddProductToFavoriets, ShippingAddressValidation } from '../vallidation/sellerVallidation.js';
// import { uploadProfile } from '../middleware/upload.js'

const fieldsConfig = [
  { name: 'profileImage', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 20 },
  { name: 'media', maxCount: 20 },
  { name: 'videoThumbnail', maxCount: 1 },
  { name: 'groupImage', maxCount: 1 },
  { name: 'file', maxCount: 30 },
  { name: 'audio', maxCount: 30 },

  { name: 'entityTrustFile', maxCount: 30 },
  { name: 'supportingFiles', maxCount: 30 },
  { name: 'proofOfFundsFiles', maxCount: 30 },
  { name: 'signature_file', maxCount: 30 },


];

import bodyParser from 'body-parser';
import { uploadAudio } from '../middleware/audioUpload.js';
const app = express();

app.post('/signUp', userSignUp, handleValidationErrors, controller.userController.userSignUp);
app.post('/resendOtp', emailVallidation, handleValidationErrors, controller.userController.resendOtp);
app.post('/otpVerified', emailVallidation, handleValidationErrors, controller.userController.otpVerified);
app.post('/signIn', userSignIn, handleValidationErrors, controller.userController.userSignIn);
app.post('/forgotPassword', emailVallidation, handleValidationErrors, controller.userController.forgotPassword);
app.post('/changeForgotPassword', passwordVallidate, handleValidationErrors, controller.userController.changeForgotPassword);
app.post('/resetPassword', authenticateUser, passwordChange, handleValidationErrors, controller.userController.resetPassword);
app.get('/getUserProfile', authenticateUser, controller.userController.getUserProfile);
app.post("/editProfile", authenticateUser, upload.fields(fieldsConfig), controller.userController.editProfile);
// app.post("/editProfile", authenticateUser, uploadProfile.fields(fieldsConfig), controller.userController.editProfile);


app.post('/blockedToAnotherUsers', authenticateUser, controller.userController.blockedToAnotherUsers);
app.post('/unblockedToAnotherUsers', authenticateUser, controller.userController.unblockedToAnotherUsers);
app.post('/socialLogin', socialLoginValidation, handleValidationErrors, controller.userController.socialLogin);
app.get('/fetchBlockedList', authenticateUser, controller.userController.fetchBlockedList);

app.post('/follow', authenticateUser, controller.userController.follow);
app.get('/retrieveUserFollowersAndFollowing', authenticateUser, controller.userController.retrieveUserFollowersAndFollowing);
app.post('/unfollow', authenticateUser, controller.userController.unfollow);
app.get('/fetchMyPostByUserId', authenticateUser, controller.userController.fetchMyPostByUserId);
app.get('/retriveOtherUsersPost', authenticateUser, controller.userController.retriveOtherUsersPost);
app.post('/likePost', authenticateUser, controller.userController.likePost);
app.post('/userViewsPost', authenticateUser, controller.userController.userViewsPost);
app.post('/createPostByUsers', authenticateUser, upload.fields(fieldsConfig), createPostValidation, handleValidationErrors, controller.userController.createPostByUsers);

app.get('/fetchUsersNotifications', authenticateUser, controller.userController.fetchUsersNotifications);
app.get('/fetchAllUsers', authenticateUser, controller.userController.fetchAllUsers);
app.delete('/accountDelete', authenticateUser, controller.userController.accountDelete);
app.post('/commentOnPost', authenticateUser, controller.userController.commentOnPost);
app.get('/fetchCommentAndNestedCommentsOnPost', authenticateUser, controller.userController.fetchCommentAndNestedCommentsOnPost);
app.post('/likeOnPostComments', authenticateUser, controller.userController.likeOnPostComments);
app.post('/notificationAndAnnoucmetOnOffByUserId', authenticateUser, controller.userController.notificationAndAnnoucmetOnOffByUserId);
app.get('/fetchNotificationAndAnnoucmetOnOffByUserId', authenticateUser, controller.userController.fetchNotificationAndAnnoucmetOnOffByUserId);

app.delete('/commentsPostDelete', authenticateUser, controller.userController.deletePostsComments);
app.get('/fetchPostByPostId', authenticateUser, controller.userController.fetchPostByPostId);
app.delete('/deleteAllNotifications', authenticateUser, controller.userController.deleteAllNotifications);
app.delete('/deleteNotificationsById/:notificationId', authenticateUser, controller.userController.deleteNotificationsById);
app.delete('/deletePostById/:postId', authenticateUser, controller.userController.deletePostsById);
app.post("/editPostById/:postId", authenticateUser, controller.userController.editPostById);
app.post('/contactToSupports', supportVallidation, handleValidationErrors, authenticateUser, controller.userController.contactToSupports);
app.get('/getSupportsCategories', authenticateUser, controller.userController.fetchSupportCategories);


// Cart // # Abhay
// app.get('/get_cart_data', authenticateUser, getUserCartData);
// app.post('/add_to_cart', authenticateUser, DeleteProduct, handleValidationErrors, addProductToCart);
// app.put('/update_cart', authenticateUser, UpdateCart, handleValidationErrors, updateCartData);
// app.delete('/delete_cart_product', authenticateUser, DeleteCartProduct, handleValidationErrors, deleteUserCartData);
app.post('/add_to_favorites', authenticateUser, AddProductToFavoriets, handleValidationErrors, addProductToFavorites);
app.get('/get_fevorites_list', authenticateUser, getFavoriatesProductList);
app.get('/get_favorites_by_id', authenticateUser, GetProductId, handleValidationErrors, getFavoriatesProductByID);
app.post('/shipping_address', authenticateUser, ShippingAddressValidation, handleValidationErrors, addDeliveryAddress);
app.get('/get_shipping_address', authenticateUser, getUserShipplingAdress);


// DEVELOPER KARAN PATEL

app.post("/isUserOnlineAndOffline", authenticateUser, controller.userController.isUserOnlineAndOffline);
app.post("/chatCreate", authenticateUser, controller.userController.createChat);
app.post("/groupChatCreate", authenticateUser, upload.fields(fieldsConfig), controller.userController.groupCreateChat);
app.get('/searchUserByUserName', authenticateUser, controller.userController.searchUserByUserName);
app.get('/fetchGroupInfo', authenticateUser, controller.userController.fetchGroupInfo);
app.post('/removeMember', authenticateUser, controller.userController.removeMembersInGroup);
app.post('/addMembers', authenticateUser, controller.userController.addMembersInGroup);
app.post("/updateGroupProfileData", authenticateUser, upload.fields(fieldsConfig), controller.userController.updateGroupProfileData);
app.get('/homePageWithTotalCount', authenticateUser, controller.userController.homePageWithTotalCount);
app.post('/userLeaveTheChat', authenticateUser, controller.userController.userLeaveTheChat);

app.get('/fetchAllSweepstacks', authenticateUser, controller.userController.fetchAllSweepstacks);
app.get('/fetchSweepstacksById', authenticateUser, controller.userController.fetchSweepstacksById);
app.get('/fetchUsersPurchasedAllSweepstacks', authenticateUser, controller.userController.fetchUsersPurchasedAllSweepstacks);
app.post("/purchaseSweepstacks", authenticateUser, controller.userController.purchaseSweepstacks);

// ------------------------------------------Product and Order Managment-------------------------------------//

// app.post("/confirmAndPay", authenticateUser, controller.userController.confirmAndPay);
app.post("/addShippingAddress", authenticateUser, controller.userController.addShippingAddress);
app.get("/fetchOrderAndShippingDetails", authenticateUser, controller.userController.fetchOrderAndShippingDetails);
app.get("/fetchShippingAddress", authenticateUser, controller.userController.fetchShippingAddress);
app.post("/editShippingAddress/:id", authenticateUser, controller.userController.editShippingAddressById);
// app.post('/payNow', authenticateUser, controller.userController.payNow);
// app.get('/fetchUserOrdersByUserId', authenticateUser, controller.userController.fetchUserOrdersByUserId);
// app.get('/fetchUserOrderByOrderId', authenticateUser, controller.userController.fetchUserOrderByOrderId);
app.get('/get_all_ads', authenticateUser, controller.userController.get_all_ads);

// -----------------------------------------Add Users stories------------------------------------------------//

app.post('/story_added', authenticateUser, upload.fields(fieldsConfig), controller.userController.story_added);
app.post('/story_delete', authenticateUser, controller.userController.story_deleted);
app.get('/fetchOwnAllStories', authenticateUser, controller.userController.fetchOwnAllStories);
app.post('/storyViews', authenticateUser, controller.userController.storyViews);
app.get('/fetchAllUsersStories', authenticateUser, controller.userController.fetchAllUsersStories);

app.get('/fetchMentionedPostAndStory', authenticateUser, controller.userController.fetchMentionedPostAndStory);
app.post('/create-or-resume-seller-stripe-account', authenticateUser, controller.userController.sellerConnectedAccountCreate);
app.get('/fetchUserListByStoryId', authenticateUser, controller.userController.fetchUserListByStoryId);
app.get('/get-content', controller.adminController.get_contents);
app.get("/fetchContentMangmentByType", controller.adminController.fetchContentMangmentByType);

app.get('/getSecretKeys', controller.userController.getSecretKeys);

// -------------------------------------fetch all boosted products--------------------------------------------------//
app.get('/showBoostedProductInMarketPlace', authenticateUser, controller.sellerController.showBoostedProductInMarketPlace);
app.post('/boostedProductsViews', authenticateUser, controller.userController.boostedProductsViews);



app.get("/getPostPackagePlan", authenticateUser, controller.userController.fetchAllPostPromotionPackages);
app.post('/boost-post', authenticateUser, controller.userController.boostPost);

app.post('/live-stream', authenticateUser, controller.userController.liveStartEnd);
app.post('/add-live-view', controller.userController.addLiveView);

app.get("/fetchSweepstackPurchase", authenticateUser, controller.userController.fetchSweepstackPurchase);

app.get("/get-wallet-history", authenticateUser, controller.userController.fetchWalletHistory);
app.get("/get-wallet-balance", authenticateUser, controller.userController.fetchWalletBalance);
app.post("/recharge-wallet", authenticateUser, controller.userController.walletRecharge);

app.get("/fetch-trending-hotnow", authenticateUser, controller.userController.fetchTrendingHotnow);
app.get("/fetch-just-for-you", authenticateUser, controller.userController.fetchJustForYou);

app.post("/share-post", authenticateUser, controller.userController.sharePost);

app.get("/fetch-user-chats", authenticateUser, controller.userController.fetchUserAllChats);
app.post("/send-chat-message", authenticateUser, controller.userController.shareReel);

// -----------------------contact supports api-----------------------------//
app.post("/contact-supports", controller.userController.create_contact_support);
app.get("/report-reasons", controller.userController.report_reasons);
app.post("/report-post", authenticateUser, controller.userController.report_post);

// -------------------------user apply to become a investor-------------------------------------//
app.get("/goverment-id-type", controller.userController.govermentIdType);
app.get("/fetch-invester-form", authenticateUser, controller.userController.fetchInvesterForm);
app.get("/fetch-all-ranches", authenticateUser, controller.userController.fetchAllRanches);
app.get('/fetch-ranch-by-id', authenticateUser, controller.userController.fetchRanchByIds);


// ----------------------------BEFORE BUY A RANCHES FILL FORMS----------------------------------//

app.post("/apply-to-become-investor", authenticateUser, upload.fields(fieldsConfig), ranchApplicationValidation, handleValidationErrors, controller.userController.applyToBecomeInvestor);
app.get("/fetch-invester-application-by-UserId", authenticateUser, controller.userController.fetchInvesterApplicationByUserId);
app.get("/fetchCountriesCodeWithCountries", authenticateUser, controller.userController.fetchCountriesCodeWithCountries);
app.get("/fetchInvestingAs", controller.userController.fetchInvestingAs);
app.get("/fetchPrefferedOwnership", controller.userController.fetchPrefferedOwnership);

// -------------------------------ranches purchases---------------------------------------------------//

app.post('/ranches-purchases', authenticateUser, controller.userController.ranches_purchases);
app.get("/myInvestment", authenticateUser, controller.userController.myInvestment);
app.get("/viewMyInvestementById", authenticateUser, controller.userController.viewMyInvestementById);
app.get('/investor_dashboard', authenticateUser, controller.userController.investorDashboardData);
app.post("/invester-contact-supports", authenticateUser, controller.userController.invester_create_contact_support);
app.get('/fetchAllPendingRanches', authenticateUser, controller.userController.fetchAllPendingRanches);
app.get("/escrowPaymentDetails", authenticateUser, controller.userController.escrowPaymentDetails);

// ----------------------------here is create escrow webhook secrete key -----------------------------------//

app.get("/generateEscrowWebhookKeys", controller.userController.createEscrowWebhookWithAPI);

// -------------------------------ranches booking dates availability---------------------------------------------------//

app.get('/fetchRanchesBookingDatesAvailability', authenticateUser, controller.userController.fetchRanchesBookingDatesAvailability);
app.post('/bookingRanchesBooking', authenticateUser, controller.userController.bookingRanchesBooking);
app.get('/fetchRanchesBooking', authenticateUser, controller.userController.fetchRanchesBooking);

// ------------------------------------return false ---------------------------------------------//

app.get('/generate-presigned-url', controller.userController.generate_presigned_url);
app.get('/fetchInvestorAllDocs', authenticateUser, controller.userController.fetchInvestorAllDocs);
app.post('/notActiveInvestor', authenticateUser, controller.userController.notActiveInvestor);

app.post('/sendNotificationToGivenDeviceToken', controller.userController.sendNotificationToGivenDeviceToken);

// ----------------------------------NEW CART FLOW WITH VARIANTS-------------------------------//
app.post('/add_to_cart', authenticateUser, DeleteProduct, handleValidationErrors, addProductToCart);
app.get('/get_cart_data', authenticateUser, getUserCartData);
app.put('/update_cart', authenticateUser, updateCartData);
app.delete('/delete_cart_product', authenticateUser, DeleteCartProduct, handleValidationErrors, deleteUserCartData);
app.post("/confirmAndPay", authenticateUser, controller.userController.confirmAndPay);
app.post('/payNow', authenticateUser, controller.userController.payNow);
app.get('/fetchUserOrdersByUserId', authenticateUser, controller.userController.fetchUserOrdersByUserId);
app.get('/fetchUserOrderByOrderId', authenticateUser, controller.userController.fetchUserOrderByOrderId);


export default app;
