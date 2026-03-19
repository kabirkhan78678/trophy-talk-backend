import express from 'express';
import controller from '../controllers/index.js';
import {
  applyToSellVallidations, AddProductSchema, UpdateProductSchema, sellerValidations, DeleteProduct,
  handleValidationErrors,
  AddCategoryNameSchema,
  UpdateCategoryNameSchema,
  getCategorySchema,
  passwordVallidate,
  udpateProfile,
  UpdateInventorySchema,
  updateDeliveryStatusValidation,
  getByIdOrderListId,
} from '../vallidation/sellerVallidation.js';
import { authenticateUser, authenticateSeller } from '../middleware/userAuth.js';
// import { upload } from '../middleware/uploadProfile.js'
import { upload } from '../middleware/upload.js'

import { addProductCategory, changeSellerPassword, deleteProductCategory, getAllCategoryData, getAllCategoryDataByID, getAllCategoryDataBySellerId, getAllProductOrderList, getContentManagementData, getEarningDashboardData, getInventoryDataCount, getMyProfileData, getOrderManagementData, getProductOrderListById, getSalesDashboardData, getSalesGrowGraphData, getSellerWalletData, getShopDetailsBySellerId, getSupportsData, getTopProductsList, sellerDashboardData, updateDeliveryStatus, updateInventoryProductStock, updateProductCategory, updateProfileData } from '../controllers/seller_controller.js';
import { supportVallidation } from '../vallidation/userVallidation.js';

const fieldsConfig = [
  { name: 'profileImage', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 20 },
  { name: 'media', maxCount: 20 },
  { name: 'businessLogo', maxCount: 1 },

];

const app = express();

app.post('/change_password', authenticateUser, passwordVallidate, handleValidationErrors, changeSellerPassword);
// app.get('/seller_dashboard', authenticateUser, sellerDashboardData);

app.get("/myprofile_data", authenticateUser, getMyProfileData);
app.put('/update_profile', authenticateUser, upload.single('file'), udpateProfile, handleValidationErrors, updateProfileData);

app.get('/get_shop_data', authenticateUser, getShopDetailsBySellerId);

app.post('/applyToSeller', authenticateUser, upload.fields(fieldsConfig), applyToSellVallidations, handleValidationErrors, controller.sellerController.applyToSeller);
app.get('/fetchAllCategory', authenticateUser, controller.sellerController.fetchAllCategories);
app.get('/fetchSellerInfo', authenticateUser, controller.sellerController.fetchSellerInfo);
app.post('/updateSeller', authenticateUser, upload.fields(fieldsConfig), sellerValidations, handleValidationErrors, controller.sellerController.updateSellerData);

// app.post('/add_product', authenticateUser, upload.array('files'), AddProductSchema, handleValidationErrors, controller.sellerController.addSellerProduct);
// app.put('/update_product', authenticateUser, upload.array('files'), UpdateProductSchema, handleValidationErrors, controller.sellerController.updateProductDetails);
app.put('/update_inventory', authenticateUser, UpdateInventorySchema, handleValidationErrors, updateInventoryProductStock);

// app.get('/get_seller_product_list', authenticateUser, controller.sellerController.getAllProductListGetBySellerId);
app.delete('/product_delete', authenticateUser, DeleteProduct, handleValidationErrors, controller.sellerController.deleteProduct);
app.get('/get_product_list', authenticateUser, controller.sellerController.getAllProductsList);
// app.get('/get_product_by_id', authenticateUser, controller.sellerController.getProductById);

// Product Category

app.post('/add_product_category', authenticateUser, AddCategoryNameSchema, handleValidationErrors, addProductCategory);
app.put('/update_product_category', authenticateUser, UpdateCategoryNameSchema, handleValidationErrors, updateProductCategory);
app.get('/get_all_product_category', getAllCategoryData);
app.get('/get_all_product_category_by_seller_id', authenticateUser, getAllCategoryDataBySellerId);
app.get('/get_category_by_id', authenticateUser, getCategorySchema, handleValidationErrors, getAllCategoryDataByID);
app.delete('/delete_product_category', authenticateUser, getCategorySchema, handleValidationErrors, deleteProductCategory);

// Inventory
app.get('/get_inventory_data', authenticateUser, getInventoryDataCount);
app.post('/sellerForgotPassword', controller.sellerController.forgotPassword);
app.get('/verifyPassword/:token', controller.sellerController.verifyPassword);
app.post('/changeForgotPassword', controller.sellerController.changeForgotPassword);
app.post('/sellerSignIn', controller.sellerController.sellerSignIn);


app.post('/contactToSupports', supportVallidation, handleValidationErrors, authenticateUser, controller.userController.contactToSupports);

app.get('/get_support_list', authenticateUser, getSupportsData);

// Order management
// app.get('/get-orders-data', authenticateUser, getOrderManagementData);

// Sales Summary
app.get('/sales-dashboard-data', authenticateUser, getSalesDashboardData);
app.get('/sales-graph-data', authenticateUser, getSalesGrowGraphData);

// Earing & Payload
// app.get('/earing-dashboard-data', authenticateUser, getEarningDashboardData);

// Top Products
app.get('/get-top-products', authenticateUser, getTopProductsList);

// Order List
app.get('/get-order-product-list', authenticateUser, getAllProductOrderList);
app.post('/update_order_status', updateDeliveryStatusValidation, handleValidationErrors, authenticateUser, updateDeliveryStatus);

app.get('/getProductOrderListById', getByIdOrderListId, handleValidationErrors, authenticateUser, getProductOrderListById);

// Seller Payout
app.get('/seller-wallet', authenticateUser, getSellerWalletData);
app.get("/fetch-content-management", authenticateUser, getContentManagementData)

// --------------------seller-boost-product--------------------------------
app.post('/boost-product', authenticateUser, controller.sellerController.boostProduct);
app.get('/get-boosted-products', authenticateUser, controller.sellerController.getBoostedProducts);
app.get('/promotion_packages', controller.sellerController.fetchAllPromotionPackages);

app.get('/get-boosted-product-by-id', authenticateUser, controller.sellerController.getBoostedProductById);
// app.put('/update-boosted-product', authenticateUser, controller.sellerController.updateBoostedProduct);
// app.delete('/delete-boosted-product', authenticateUser, controller.sellerController.deleteBoostedProduct);

app.get('/fetch-terms-and-conditions', controller.adminController.termsAndConditions);
app.get('/privacy-policy', controller.adminController.privacy_policy);
app.post("/contact-supports", controller.userController.create_contact_support);



// --------------------------------------add product with there size & color variants----------------------------//

app.get('/product_sizes', authenticateUser, controller.sellerController.productSizes);
app.post('/add_product', authenticateUser, upload.any(), AddProductSchema, handleValidationErrors, controller.sellerController.addSellerProduct);
app.get('/get_seller_product_list', authenticateUser, controller.sellerController.getAllProductListGetBySellerId);
app.get('/get_product_by_id', authenticateUser, controller.sellerController.getProductById);
app.put('/update_product', authenticateUser, upload.any(), controller.sellerController.updateProductDetails);
app.get('/fetch_low_stock_products', authenticateUser, controller.sellerController.fetchLowStockProducts);
app.get('/fetch_out_of_stock_products', authenticateUser, controller.sellerController.fetchOutOfStockProducts);

app.get('/seller_dashboard', authenticateUser, sellerDashboardData);
app.get('/earing-dashboard-data', authenticateUser, getEarningDashboardData);
app.get('/get-orders-data', authenticateUser, getOrderManagementData);

// ------------------------------update stock quantity-------------------------------------//
app.put('/update-product-variant-stock', authenticateUser, controller.sellerController.updateProductVariantStock);
app.get('/fetchUserOrderByOrderId', authenticateUser, controller.sellerController.fetchUserOrderByOrderId);

app.get('/fetchAllColours', controller.sellerController.fetchAllColours);



export default app;