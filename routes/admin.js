import express from 'express';
import controller from '../controllers/index.js';
import { upload } from '../middleware/upload.js'
import { authenticateAdmin, authenticateUser } from '../middleware/userAuth.js';
import { uploadFile } from '../services/uploadImage.js';
import { AddCategoryNameSchema, adminCommissionValidation, getCategorySchema, handleValidationErrors, UpdateCategoryNameSchema } from '../vallidation/sellerVallidation.js';
import { getAllSellerPayoutList, getAllSellerToPayList, payPaymentToSeller, updateAdminCommission, privacy_policy, termsAndConditions, fetchAllUsersContactSupport } from '../controllers/admin_controller.js';
import { uploadAudio } from '../middleware/audioUpload.js';
const fieldsConfig = [
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 20 },
    { name: 'media', maxCount: 20 },
    { name: 'videoThumbnail', maxCount: 1 },
    { name: 'groupImage', maxCount: 1 },
    { name: 'file', maxCount: 30 },
    { name: 'audio', maxCount: 30 },

    { name: 'ranchesDocuments', maxCount: 10 },

];
import Stripe from 'stripe';
import { adminHandleValidationErrors, createRanchValidations } from '../vallidation/adminVallidation.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

//=================================== Auth ==================================
app.post('/login', controller.adminController.loginAdmin);
app.get('/profile', authenticateAdmin, controller.adminController.getProfile);
app.post('/forgot-password', controller.adminController.forgot_password);
app.get('/reset-password', controller.adminController.render_forgot_password_page);
app.get('/success-reset', controller.adminController.render_success_reset);
app.post('/reset-password', controller.adminController.reset_password);
app.post('/change-password', authenticateAdmin, controller.adminController.changePassword);
app.post('/profile/update', authenticateAdmin, uploadFile, controller.adminController.updateProfile);


//=================================== Users ==================================
app.get('/get-users', authenticateAdmin, controller.adminController.get_users_data);
app.post('/suspend-unsuspend-user', authenticateAdmin, controller.adminController.suspend_unsuspend_user);


//=================================== Seller ==================================
app.get('/get-sellers', controller.adminController.get_seller_data);
app.post('/active-inactive-seller', controller.adminController.active_inactive_seller);
app.post('/approve-reject-seller-request', authenticateAdmin, controller.adminController.approved_reject_seller_request);

app.get('/getSellerDetailedById', authenticateAdmin, controller.adminController.getSellerDetailedById);


//=================================== Posts ==================================
app.get('/get-posts', authenticateAdmin, controller.adminController.get_posts_data);
app.post('/delete-post', authenticateAdmin, controller.adminController.delete_post);

//=================================== Product ==================================
// app.get('/get-products', controller.adminController.get_product_data);
app.delete('/delete-product', controller.adminController.delete_product);
app.get('/dashboard', authenticateAdmin, controller.adminController.dashboard);


//=================================== support ==================================
app.get('/get-supports', controller.adminController.get_supports_data);
app.post('/mark-as-resolved', controller.adminController.mark_as_resolved);
app.post('/support-reply', controller.adminController.reply_to_support);


//=================================== Category ==================================
app.post('/add_product_category', AddCategoryNameSchema, handleValidationErrors, controller.adminController.addProductCategory);
app.put('/update_product_category', UpdateCategoryNameSchema, handleValidationErrors, controller.adminController.updateProductCategory);
app.get('/get_all_product_category', controller.adminController.getAllCategoryData);
app.delete('/delete_product_category', getCategorySchema, handleValidationErrors, controller.adminController.deleteProductCategory);


//=================================== Notification ==================================
app.get('/fetchAllAdminNotifications', authenticateAdmin, controller.adminController.fetchAllAdminNotifications);

app.post('/send-broadcast-notification', authenticateAdmin, controller.adminController.send_broadcast_notification);


//=================================== Notification ==================================
app.get('/get-groups', authenticateAdmin, controller.adminController.get_group_data);


//=================================== Content Management ==================================
app.get('/get-content', authenticateAdmin, controller.adminController.get_contents);
app.post('/update-content', authenticateAdmin, controller.adminController.updateContent);


//=================================== SweepStakes ==================================
app.post('/add-sweepstake', authenticateAdmin, upload.fields(fieldsConfig), controller.adminController.add_sweepstake);
app.get('/get-all-sweepstakes', authenticateAdmin, controller.adminController.get_all_sweepstakes);
app.get('/fetchSweepstakesById', authenticateAdmin, controller.adminController.fetchSweepstacksById);
app.post('/update-sweepstake', authenticateAdmin, upload.fields(fieldsConfig), controller.adminController.update_sweepstake);
app.delete('/delete-sweepstake', authenticateAdmin, controller.adminController.delete_sweepstake);
app.get('/fetchSweepstackResponse', authenticateAdmin, controller.adminController.fetchSweepstackResponse);


// =================================Orders list =========================================

app.get('/fetchAllUserOrders', authenticateAdmin, controller.adminController.fetchAllUserOrders);
app.get('/fetchUserOrderByOrderId', authenticateAdmin, controller.adminController.fetchUserOrderByOrderId);
app.post('/add-ads', authenticateAdmin, upload.fields(fieldsConfig), controller.adminController.add_ads);
app.get('/get_all_ads', authenticateAdmin, controller.adminController.get_all_ads);
app.delete('/delete-ads', authenticateAdmin, controller.adminController.delete_ads);
app.get('/fetchSweepstacksUsersBysweepstacksId', authenticateAdmin, controller.adminController.fetchSweepstacksUsersBysweepstacksId);
app.post('/sweepstacksWinners', authenticateAdmin, controller.adminController.sweepstacksWinners);
app.get('/fetchTotalRevenue', authenticateAdmin, controller.adminController.fetchTotalRevenue);
app.get('/revenue-graph', authenticateAdmin, controller.adminController.revenue_graph);
app.post('/update-ads', authenticateAdmin, upload.fields(fieldsConfig), controller.adminController.updateAdsData);
app.post('/update_orderStatus', authenticateAdmin, controller.adminController.update_orderStatus);


// ===============================Content Managments==========================================================//

app.get("/fetchContentMangmentByType", authenticateAdmin, controller.adminController.fetchContentMangmentByType);
app.post("/updateContentManagmentsByType", authenticateAdmin, controller.adminController.updateContentManagmentsBythereType);

//=================================== Seller Payout==========================================================// 
// app.get('/get-list-seller-payout', authenticateAdmin, controller.adminController.getAllSellerToPayList);
// app.get('/get-payout-list', authenticateAdmin, controller.adminController.getAllSellerPayoutList);
// app.post('/pay-to-seller', authenticateAdmin, controller.adminController.payPaymentToSeller);

app.post('/upload_audio', authenticateAdmin, upload.fields(fieldsConfig), controller.adminController.audio_add);
app.get('/fetch-audioList', controller.adminController.fetchAllAudio);
app.post('/update_audio/:id', authenticateAdmin, upload.fields(fieldsConfig), controller.adminController.updateAudio);
app.delete('/delete_audio', authenticateAdmin, controller.adminController.delete_audio);

// admin commission
app.post('/update_admin_commission', authenticateAdmin, adminCommissionValidation, handleValidationErrors, updateAdminCommission);
app.get("/get-boosted-products", controller.adminController.get_boosted_product_data);
app.get("/get-boosted-posts", controller.adminController.get_boosted_post_data);
app.get("/get-post-promotional-package", controller.adminController.fetchPostPromotionalPackage);
app.get("/get-product-promotional-package", controller.adminController.fetchProductPromotionalPackage);
app.post("/update-post-promotional-package", controller.adminController.updatePostPromotionalPackage);
app.post("/update-product-promotional-package", controller.adminController.updateProductPromotionalPackage);
app.get("/get-live-streams-data", controller.adminController.fetchLiveStreamData);
app.get("/get-user-wallet-history", controller.adminController.fetchUserWalletData)


app.get("/fetchAllUsersContactSupport", controller.adminController.fetchAllUsersContactSupport)
app.get('/fetch-terms-and-conditions', controller.adminController.termsAndConditions);
app.get('/privacy-policy', controller.adminController.privacy_policy);

app.get('/user-transactions', controller.adminController.user_transactions);
app.get('/fetchAllUserTransactions', controller.adminController.fetchAllUserTransactions);


//=================================== User Apply to Become a Investor ==================================
app.get('/fetch-user-apply-to-become-investor', authenticateAdmin, controller.adminController.fetchUserApplyToBecomeInvestor);
app.post('/create-ranch', authenticateAdmin, upload.fields(fieldsConfig), createRanchValidations, adminHandleValidationErrors, controller.adminController.createRanch);
app.get('/fetch-ranch', authenticateAdmin, controller.adminController.fetchRanch);
app.get('/fetch-ranch-by-id', authenticateAdmin, controller.adminController.fetchRanchByIds);
app.get('/ranches-ownership-dashboard', authenticateAdmin, controller.adminController.ranchesOwnershipDashboard);
app.post('/ranches-status-changes', authenticateAdmin, controller.adminController.ranchesStatusChanges);
app.post('/update-ranch', authenticateAdmin, upload.fields(fieldsConfig), controller.adminController.updateRanch);
app.delete('/deleteImagesRanchesById', authenticateAdmin, controller.adminController.deleteImagesRanchesById);
app.get('/getGeoLocation', upload.fields(fieldsConfig), controller.adminController.getGeoLocation);
app.get('/fetch-invester-by-id', controller.adminController.fetchInvesterFormByUserId);
app.delete('/deletedRanchesById', authenticateAdmin, controller.adminController.deletedRanchesById);


// --------------------------------Invester application------------------------------------------------

app.get('/fetchAllUserInvesterApplication', controller.adminController.fetchAllUserInvesterApplication);
app.get('/fetchApplicationById', authenticateAdmin, controller.adminController.fetchApplicationByIds);
app.post('/approve-reject-user-apply-to-become-investor', controller.adminController.approveRejectUserApplyToBecomeInvestor);


// -----------------------------------ranches purchases history------------------------------------------------

app.get("/fetchInvesterOwnerships", authenticateAdmin, controller.adminController.fetchInvesterOwnerships);

// ----------------------------------APPROVE RESERVATION-----------------------------------------//

app.post('/approveAndReleaseFunds', authenticateAdmin, controller.adminController.approveAndReleaseFunds);
app.post('/rejectAndRefundFunds', authenticateAdmin, controller.adminController.rejectAndRefundFunds);

//=================================== invester-support ==================================
app.get('/invester-get-supports', authenticateAdmin, controller.adminController.invester_supports_data);
app.post('/invester-support-reply', authenticateAdmin, controller.adminController.reply_to_invester_support);

// -----------------------------------ranches blackout days------------------------------------------------
app.get('/fetchRanchesBlackoutDays', authenticateAdmin, controller.adminController.fetchRanchesBlackoutDays);
app.post('/insertRanchesBlackoutDays', authenticateAdmin, controller.adminController.insertRanchesBlackoutDays);
app.post('/updateRanchesBlackoutDays', authenticateAdmin, controller.adminController.updateRanchesBlackoutDays);

app.get('/bookingRequestManagment', authenticateAdmin, controller.adminController.bookingRequestManagment);
app.post('/approveAndRejectBookingRequest', controller.adminController.approveAndRejectBookingRequest);
app.get('/fetchBookingRequestManagmentById', controller.adminController.fetchBookingRequestManagmentById);


app.post('/notActiveAdmin', controller.adminController.notActiveAdmin);

// ------------------------------------seller-payout-----------------------------------------------
app.get('/get-list-seller-payout', authenticateAdmin, getAllSellerToPayList);
app.get('/get-payout-list', authenticateAdmin, getAllSellerPayoutList);
app.post('/pay-to-seller', authenticateAdmin, payPaymentToSeller);

app.get('/get-products', controller.adminController.get_product_data);




export default app;