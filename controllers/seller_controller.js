import dotenv from 'dotenv';
import Msg from '../utils/message.js';
import path from 'path';
import { NotificationTypes, StatusCode } from '../utils/constant.js';
import handlebars from 'handlebars';
import { handleError, handleSuccess } from '../utils/responseHandler.js';
import {
    getSellerDetailsByUserId,
    fetchSellerInfoById,
    fetchAllCategory,
    addMeAsSeller,
    updateSellerInfo,
    addProductImageModel,
    addProductModel,
    deleteProductByIdModal,
    deleteProductImageModal,
    getProductDataByIdModal,
    getProductDetailsById,
    getProductListModal,
    getUserProductImagesModal,
    getUserProductListModal,
    updateProductModel,
    getProductImageModal,
    deleteSellerById,
    getCategoryDataById,
    upadteProductCategoryModel,
    getAllProductCategoryModel,
    getProductCategoryByIDModel,
    addProductCategoryModel,
    getCategoryDataByName,
    getAllProductCategoryBySellerIdModel,
    fetchSellerByEmail,
    getProductDetailsId,
    getSellerDetailsBySeller_d,
    fetchcartByUserId,
    fetchfavroiteByUserIdAndProductId,
    getAllSellerProductListModal,
    getCategoryDataByNameInUpdate,
    getUserDetailById,
    updateUserPasswordModel,
    getDashboartCount,
    updateSellerDataModel,
    fetchAdmin,
    getInventoryDataCountModel,
    fetchUsersByEmail,
    updateUsersGenToken,
    updatePasswordByGenToken,
    getSupportDataModel,
    getProductOrderDataModel,
    getOrderManagementDataModel,
    getShippingProductAddress,
    getDashboardSalesModel,
    getYearGraphDataModel,
    getMonthYearGraphDataModel,
    getTotalyearEarningModel,
    getTotalMonthlyEarningModel,
    getYearlyOrderDataModel,
    getMonthlyOrderDataModel,
    getTopProductListModel,
    getAllSellProductListModel,
    getSelledProductByIDModel,
    updateProductDeliveryStatusModel,
    getProductDataByOrderId,
    getAllSellProductListByIdModel,
    getLastPayoutDataModel,
    getListOfTotalPayoutToSeller,
    fetchSellerOnBoardProfileCompleteOrnot,
    getContentManagementList,
    getPromotionPackageById,
    fetchBoostProductsBySellerId,
    fetchBoostProductsByProductId,
    fetchAllPromotionPackagesModel,
    fetchAllBoostedProduct,
    fetchBoostedProductById,
    fetchBoostedAnalyticsProductById,
    fetchAllFeaturedBoostedProduct,
    fetchAllPromotionPackagesModelByIds,
    fetchBoostActiveProductsByProductId,
    insertBoostProducts,
    updateProductBoost,
    fetchProductSizesModel,
    addProductColorModel,
    fetchSizeIdBySystemAndValueModel,
    addProductVariantModel,
    getProductVariantsByPid,
    getUserProductImagesByColorModal,
    getProductColorsByPid,
    updateProductVariantModel,
    addProductColorsByPidAndColorName,
    getProductColorsByPidAndColorName,
    getDataFromSizeMasterModel,
    fetchProductSizesApperelsModel,
    deleteProductImagesByColorId,
    deleteProductVariantsByColorId,
    deleteProductColorById,
    fetchLowProductStock,
    fetchOutOfStockProductsModel,
    fetchLowStockProductVariantsByPid,
    fetchIsProductStockOrNot,
    fetchSellerPayoutBySellerId,
    fetchOrdersBySellerId,
    getSellerGrossEarningsModel,
    getSellerPaidAmountModel,
    getSellerNetEarningsModel,
    getSellerCommissionPaidModel,
    getSellerTotalGrossModel,
    getSellerTotalReceivedModel,
    getSellerPayoutListModel,
    getProductVariantByPidAndColor,
    updateProductVariantStockModel,

    fetchAllColorModel,
    // -----------------------------------------------------------//
    deleteAllProductVariants,
    fetchColorIdByPidAndColorName,
    isProductIsAllreadyAddedToCart,
    updateProductVariantByIdStockModel,

} from '../models/seller.model.js';
import {
    authenticateUser,
    createNotificationMessage,
    generateTransactionId,
    generateUniqueProductID,
    randomStringAsBase64Url,
    sendNotification,
} from '../utils/user_helper.js';
import { fileURLToPath } from 'url';

import { baseurl } from '../config/path.js';
import { getPublicUrl, deleteFileFromS3 as deleteFromS3 } from '../middleware/upload.js';
import { checkAvailableProductModel, fetchOrderSummary, fetchOrderSummaryByOrderId, fetchUsersById, fetchUsersByToken, fetchWalletBalanceById, insertWalletHistory, isUsersExistsOrNot } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/emailService.js';
import fs from 'fs/promises';
import localStorage from 'localStorage';
import db from '../config/db.js';
import { fetchOrderItemByID, fetchOrderItemByIDForSeller, fetchProductDetailedById, modelFetchOrdersByOrderId } from '../models/admin.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
dotenv.config();

// Auth
export const changeSellerPassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        const user = req.user;
        if (old_password == new_password) {
            return handleError(res, StatusCode.status400, Msg.CHANGE_PASSWORD_ERROR);
        };
        const userData = await getUserDetailById(user?.id);
        if (userData?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.USER_NOT_FOUND);
        };
        const sellerData = await getSellerDetailsByUserId(user?.id);
        if (sellerData?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
        };
        const match = await bcrypt.compare(old_password, userData[0]?.password);
        if (!match) {
            return handleError(res, StatusCode.status400, Msg.OLD_PASSWORD_ERROR);
        };
        const hash = await bcrypt.hash(new_password, 12);
        const update_password = {
            password: hash
        };
        const update_user_password = await updateUserPasswordModel(update_password, user?.id);
        if (update_user_password.affectedRows > 0) {
            return handleSuccess(res, StatusCode.status200, Msg.UPDATE_PASSWORD);
        } else {
            return handleError(res, StatusCode.status304, Msg.UPDATE_PASSWORD_ERROR);
        };
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

export const getMyProfileData = async (req, res) => {
    try {
        const user = req.user;
        let fetchUserBusinessInfo = await fetchSellerInfoById(user?.id);
        const data = {
            user_id: user?.id,
            full_name: user?.fullName ?? '',
            store_name: fetchUserBusinessInfo[0]?.businessName ?? '',
            email_address: user?.email ?? '',
            bussiness_email: fetchUserBusinessInfo[0]?.email ?? '',
            bussiness_number: fetchUserBusinessInfo[0]?.phone ?? '',
            profile_image: user?.profileImage ?? null
        };
        return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

export const updateProfileData = async (req, res) => {
    try {
        const user = req.user;
        const { full_name, store_name, bussiness_number } = req.body;
        const file = req.file;
        if (file) {
            const data = {
                profileImage: file?.location,
                fullName: full_name
            };
            const data12 = {
                businessName: store_name,
                phone: bussiness_number
            };
            const updateSeller = await updateUserPasswordModel(data, user?.id);
            const updateUser = await updateSellerDataModel(data12, user?.id);
            if (updateSeller.affectedRows > 0 && updateUser?.affectedRows > 0) {
                return handleSuccess(res, StatusCode.status200, Msg.sellerInfoUpdateSuccessfully);
            } else {
                return handleError(res, StatusCode.status304, Msg.sellerInfoNotUpdate);
            };
        } else {
            const data = {
                fullName: full_name
            };
            const data12 = {
                businessName: store_name,
                phone: bussiness_number
            };
            const updateSeller = await updateUserPasswordModel(data, user?.id);
            const updateUser = await updateSellerDataModel(data12, user?.id);
            if (updateSeller.affectedRows > 0 && updateUser?.affectedRows > 0) {
                return handleSuccess(res, StatusCode.status200, Msg.sellerInfoUpdateSuccessfully);
            } else {
                return handleError(res, StatusCode.status304, Msg.sellerInfoNotUpdate);
            };
        };
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

export const fetchAllCategories = async (req, res) => {
    try {
        let getAllcategories = await fetchAllCategory()
        if (getAllcategories.length > 0) {
            return handleSuccess(res, 200, Msg.categoryFoundSuccessful, getAllcategories);
        } else {
            return handleError(res, 400, Msg.categoryNotFound, []);
        }
    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const applyToSeller = async (req, res) => {
    try {
        let { id, fullName } = req.user
        let { businessName, businessEIN, email, phone, bussinessDescription, businessAddress, yearExperince, businessWebsite, noOfEmploys } = req.body
        let isSellerExists = await fetchSellerInfoById(id)
        if (isSellerExists.length > 0) {
            await deleteSellerById(isSellerExists[0].id)
        }
        let businessLogo = null;
        if (req.files) {
            businessLogo = req.files.businessLogo ? getPublicUrl(req.files.businessLogo[0].key) : null;
        }
        let data = {
            userId: id,
            businessName,
            businessEIN,
            email,
            phone,
            bussinesslogo: businessLogo,
            bussinessDescription,
            businessAddress, yearExperince, businessWebsite, noOfEmploys
        }
        let isSellerExistByEmail = await fetchSellerByEmail(email);
        if (isSellerExistByEmail.length > 0) {
            return handleSuccess(res, 200, Msg.emailAlreadyExists);
        }
        let isInsert = await addMeAsSeller(data);
        if (isInsert.insertId == 0) {
            return handleError(res, 400, Msg.insertError);
        }
        let adminId = await fetchAdmin();
        let usersfetchFcmToken = adminId[0]?.fcmToken || ""
        let userId = adminId[0].id
        let followId = null
        let postId = null
        let notificationType = NotificationTypes.APPLY_TO_SELLER_NOTIFICATION
        let notificationSend = 'applyBecomeSeller';
        let message = await createNotificationMessage({ notificationSend, fullName, id, userId, followId, usersfetchFcmToken, notificationType, postId });
        await sendNotification(message, postId);
        return handleSuccess(res, 200, Msg.sellerFormSubmission);

    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const fetchSellerInfo = async (req, res) => {
    try {
        let { id } = req.user
        let fetchUserBusinessInfo = await fetchSellerInfoById(id)
        if (fetchUserBusinessInfo.length > 0) {
            return handleSuccess(res, 200, Msg.dataFoundSuccessful, fetchUserBusinessInfo[0]);
        } else {
            return handleError(res, 400, Msg.dataNotFound, {});
        }
    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const updateSellerData = async (req, res) => {
    try {
        const { id } = req.user;
        let userData = req.body;
        let sellerDetails = await getSellerDetailsByUserId(id);
        let bussinesslogo = sellerDetails[0].bussinesslogo;

        // -----------------------------------s3 start code------------------------------------------//

        if (req.files && req.files.businessLogo) {
            await deleteFromS3(bussinesslogo);
            userData.bussinesslogo = req.files.businessLogo ? getPublicUrl(req.files.businessLogo[0].key) : null;
        }

        // -----------------------------------end---------------------------------------------------//

        // if (req.files) {
        //     userData.bussinesslogo = req.files && req.files.businessLogo ? `${baseurl}/profile/${req.files.businessLogo[0].filename}` : null
        // } else {
        //     userData.bussinesslogo = bussinesslogo;
        // }
        userData.isApproved = sellerDetails[0].isApproved == 2 ? 0 : sellerDetails[0].isApproved
        const result = await updateSellerInfo(userData, id);
        if (result.affectedRows > 0) {
            return handleSuccess(res, 200, Msg.sellerInfoUpdateSuccessfully, result);
        };
        return handleError(res, 400, Msg.sellerInfoNotUpdate, []);
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { product_id } = req.body;
        const product_detail = await getProductDataByIdModal(product_id);
        if (product_detail?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.PRODUCT_NOT_AVAILABLE);
        };
        const data = {
            status: 1
        };
        const result = await deleteProductByIdModal(data, product_id);
        if (result?.affectedRows > 0) {
            return handleSuccess(res, StatusCode.status200, Msg.PRODUCT_DELETE);
        } else {
            return handleSuccess(res, StatusCode.status400, Msg.PRODUCT_DELETE_ERROR);
        };
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    }
};

export const getAllProductsList = async (req, res) => {
    try {
        let user = req.user;
        const seller_details = await getSellerDetailsByUserId(user?.id);
        let product_data;
        let featuredProduct;
        if (seller_details?.length == 0) {
            product_data = await getAllSellerProductListModal();
            featuredProduct = await fetchAllFeaturedBoostedProduct()
        } else {
            product_data = await getUserProductListModal(seller_details[0]?.id);
            featuredProduct = await fetchAllBoostedProduct(seller_details[0]?.id)
        }
        product_data = await Promise.all(
            product_data?.map(async (item) => {
                const product_category = await getProductCategoryByIDModel(item.product_category);
                const sellerData = await getSellerDetailsBySeller_d(item.seller_id)
                const check = await checkAvailableProductModel(item?.pId, user?.id);
                const images = await getUserProductImagesModal(item?.pId);
                item.businessName = sellerData[0]?.businessName;
                item.product_category = item.product_category;
                item.product_categoryName = product_category[0]?.category_name;
                item.category_id = product_category[0]?.id;
                item.isCart = check?.length > 0 ? true : false;
                item.images = images;
                item.boostedId = 0
                let fetchStockQuantity = await fetchIsProductStockOrNot(item?.pId)
                item.is_stock_quantity = fetchStockQuantity.length > 0 ? true : false
                return item;
            })
        );

        featuredProduct = await Promise.all(
            featuredProduct?.map(async (item) => {
                const product_category = await getProductCategoryByIDModel(item.product_category);
                const sellerData = await getSellerDetailsBySeller_d(item.seller_id)
                const check = await checkAvailableProductModel(item?.pId, user?.id);
                const images = await getUserProductImagesModal(item?.pId);
                let boostedProductId = await fetchBoostProductsByProductId(item?.pId)
                item.boostedId = boostedProductId[0].id
                item.businessName = sellerData[0]?.businessName;
                item.product_category = item.product_category;
                item.product_categoryName = product_category[0]?.category_name;
                item.category_id = product_category[0]?.id;
                item.isCart = check?.length > 0 ? true : false;
                item.images = images;
                return item;
            })
        );

        let data = {
            feturedProducts: featuredProduct,
            product_data: product_data
        }
        return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, data);
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

// export const getProductById = async (req, res) => {
//     try {
//         const { product_id } = req.query;
//         const user = req.user.id;
//         let product_detail = await getProductDetailsById(product_id);
//         product_detail = await Promise.all(
//             product_detail?.map(async (item) => {
//                 const images = await getUserProductImagesModal(item?.pId)
//                 const seller_details = await getSellerDetailsBySeller_d(product_detail[0]?.seller_id);
//                 const product_category = await getProductCategoryByIDModel(item.product_category);
//                 let addedInCart = await fetchcartByUserId(product_id, user);
//                 let isFavrouite = await fetchfavroiteByUserIdAndProductId(product_id, user)
//                 // item.product_category = product_category[0]?.id;
//                 item.product_categoryName = product_category[0]?.category_name;
//                 item.product_category = item.product_category
//                 item.isFavrouite = isFavrouite.length > 0 ? true : false
//                 item.addedInCart = addedInCart.length > 0 ? true : false
//                 item.itsOwnProduct = seller_details[0]?.userId == user ? true : false
//                 item.businessName = seller_details[0].businessName;
//                 item.bussinessDescription = seller_details[0].bussinessDescription;
//                 item.bussinesslogo = seller_details[0].bussinesslogo;
//                 item.images = images;
//                 return item;
//             })
//         );
//         return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, product_detail[0]);
//     } catch (err) {
//         return handleError(res, StatusCode.status500, Msg.internalServerError);
//     }
// };

export const getShopDetailsBySellerId = async (req, res) => {
    try {
        const user = req.user
        let fetchUserBusinessInfo = await fetchSellerInfoById(user?.id);
        const data = fetchUserBusinessInfo?.length != 0 ? fetchUserBusinessInfo[0] : []
        return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
    } catch (err) {
        return handleError(res, 500, Msg.internalServerError);
    };
};

// Dashboard
// export const sellerDashboardData = async (req, res) => {
//     try {
//         const user = req.user;
//         const seller = req.seller;
//         const adminData = await fetchAdmin();
//         const adminCommission = adminData[0]?.admin_commission ?? 0;
//         const seller_details = await getSellerDetailsByUserId(user?.id);
//         if (seller_details?.length == 0) {
//             return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
//         };
//         const [product_count] = await getDashboartCount(seller_details[0]?.id);
//         const total_product_sale_count = await getProductOrderDataModel(seller?.id);
//         const orderRows = await db.query(`SELECT DISTINCT oi.order_id, o.shippingDetailed,o.createdAt,o.updatedAt,o.totalAmount,o.orderStatus FROM tbl_order_items oi JOIN tbl_products p ON oi.product_id = p.pId JOIN tbl_orders o ON o.id = oi.order_id WHERE p.seller_id = ? ORDER BY o.createdAt DESC`, [seller?.id]);
//         let val = 0;
//         let total_sale = 0;
//         Promise.all(total_product_sale_count?.map((item) => {
//             val += parseInt(item?.quantity ?? 0)
//             const priceAtOrder = parseFloat(item?.price_at_order ?? 0);
//             const productQuantity = parseFloat(item?.quantity ?? 0);
//             const shippingCharges = parseFloat(item?.delivery_charge ?? 0);
//             total_sale += (priceAtOrder * productQuantity) + shippingCharges
//         }))
//         product_count.total_product_sale_count = val ?? 0;
//         product_count.total_sale = total_sale ? parseFloat(total_sale - (total_sale * adminCommission / 100)) : 0;
//         product_count.total_order = orderRows?.length ?? 0;
//         let isSellerAccountOrNot = await fetchSellerOnBoardProfileCompleteOrnot(seller_details[0]?.id)
//         product_count.isSellerAccountOrNot = isSellerAccountOrNot.length > 0 && isSellerAccountOrNot[0].is_onboarding_complete == 1 ? 1 : 0;
//         return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, product_count);
//     } catch (err) {
//         return handleError(res, StatusCode.status500, Msg.internalServerError);
//     };
// };

// Category
export const addProductCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const user = req.user;
        const seller_details = await getSellerDetailsByUserId(user?.id);
        if (seller_details?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
        };
        const check_category = await getCategoryDataByName(category_name);
        if (check_category?.length != 0) {
            return handleError(res, StatusCode.status400, Msg.PRODUCT_CATEGORY_ERROR);
        };
        const data = {
            category_name: category_name,
            seller_id: seller_details[0]?.id
        }
        const add_category = await addProductCategoryModel(data);
        if (add_category.affectedRows > 0) {
            return handleSuccess(res, StatusCode.status201, Msg.ADD_PRODUCT_CATEGORY);
        } else {
            return handleError(res, StatusCode.status400, Msg.ADD_PRODUCT_CATEGORY_ERROR);
        };
    } catch (err) {
        console.log("Error", err)
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

export const updateProductCategory = async (req, res) => {
    try {
        const { category_id, category_name } = req.body;
        const user = req.user;
        const seller_details = await getSellerDetailsByUserId(user?.id);
        if (seller_details?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
        };
        const check_category_product_cateogory_name = await getCategoryDataByNameInUpdate(category_name, category_id);

        if (check_category_product_cateogory_name?.length != 0) {
            return handleError(res, 400, Msg.PRODUCT_CATEGORY_ERROR);
        };

        const check_category = await getCategoryDataById(category_id, seller_details[0]?.id);
        if (check_category?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.PRODUCT_CATEGORY_NOT_EXIST);
        };
        const data = {
            category_name: category_name
        };
        const update_category = await upadteProductCategoryModel(data, category_id);
        if (update_category.affectedRows > 0) {
            return handleSuccess(res, StatusCode.status200, Msg.UPDATE_PRODUCT_CATEGORY);
        } else {
            return handleError(res, StatusCode.status400, Msg.UPDATE_PRODUCT_CATEGORY_ERROR);
        };
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

// export const getAllCategoryData = async (req, res) => {
//     try {
// const category_data = await getAllProductCategoryModel();
//         return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, category_data);
//     } catch (err) {
//         return handleError(res, StatusCode.status500, Msg.internalServerError);
//     };
// };

export const getAllCategoryDataBySellerId = async (req, res) => {
    try {
        const user = req.user;
        const seller_details = await getSellerDetailsByUserId(user?.id);
        if (seller_details?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
        };
        const category_data = await getAllProductCategoryBySellerIdModel(seller_details[0]?.id);
        return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, category_data);
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

export const getAllCategoryDataByID = async (req, res) => {
    try {
        const { category_id } = req.query;
        const category_data = await getProductCategoryByIDModel(category_id);
        if (category_data?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.dataNotFound);
        };
        return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, category_data[0]);
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

export const deleteProductCategory = async (req, res) => {
    try {
        const { category_id } = req.query;
        const category_data = await getProductCategoryByIDModel(category_id);
        if (category_data?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.dataNotFound);
        };
        const data = {
            is_active: 1
        };
        const delete_category = await upadteProductCategoryModel(data, category_id);
        if (delete_category.affectedRows > 0) {
            return handleSuccess(res, StatusCode.status200, Msg.DELETE_PRODUCT_CATEGORY);
        } else {
            return handleError(res, StatusCode.status400, Msg.DELETE_PRODUCT_CATEGORY_ERROR);
        };
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    }
};

// Inventory
export const updateInventoryProductStock = async (req, res) => {
    try {
        const { stock, product_id } = req.body;
        const user = req.user;
        const seller_details = await getSellerDetailsByUserId(user?.id);
        if (seller_details?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
        };
        const data = {
            stock_quantity: stock
        };
        const result = await updateProductModel(data, product_id);
        if (result?.affectedRows > 0) {
            return handleSuccess(res, StatusCode.status200, Msg.UPDATE_PRODUCT)
        } else {
            return handleError(res, StatusCode.status400, Msg.UPDATE_PRODUCT_Error);
        };
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

// export const getInventoryDataCount = async (req, res) => {
//     try {
//         const user = req.user;
//         const seller_details = await getSellerDetailsByUserId(user?.id);
//         if (seller_details?.length == 0) {
//             return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
//         };
//         const get_inventory = await getInventoryDataCountModel(seller_details[0]?.id);
//         return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, get_inventory[0]);
//     } catch (err) {
//         return handleError(res, StatusCode.status500, Msg.internalServerError);
//     };
// };

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await fetchUsersByEmail(email);
        if (data.length !== 0) {
            if (data[0].isVerified == 1) {
                let genTokens = await randomStringAsBase64Url(20);
                let generateToken = {
                    genToken: genTokens
                }
                await updateUsersGenToken(generateToken, email);
                const context = {
                    href_url: `${baseurl}/api/seller/verifyPassword/${genTokens}`,
                    msg: "Please click below link to change password.",
                };

                const projectRoot = path.resolve(__dirname, "../");
                const emailTemplatePath = path.join(projectRoot, "views", "forgot_password.handlebars");
                const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
                const template = handlebars.compile(templateSource);
                const emailHtml = template(context);

                const emailOptions = {
                    to: email,
                    subject: "Forgot Password",
                    html: emailHtml,
                };
                await sendEmail(emailOptions);
                return handleSuccess(res, 200, "Password reset link sent successfully. Please check your email " +
                    email);
            } else {
                return handleError(res, 400, "Account Not verify");
            }
        } else {
            return handleError(res, 400, Msg.emailNotFound, []);
        }
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

export const verifyPassword = async (req, res) => {
    try {
        const id = req.params.token;
        if (!id) {
            return handleError(res, 400, "Invalid link");
        } else {
            const result = await fetchUsersByToken(id);
            const token = result[0]?.genToken;
            const projectRoot = path.resolve(__dirname, "../");
            if (result.length !== 0) {
                localStorage.setItem("vertoken", JSON.stringify(token));
                res.render(path.join(projectRoot, "views", "forgotPassword.ejs"), { msg: "", });
            } else {
                res.render(path.join(projectRoot, "views", "forgotPassword.ejs"), { msg: "", });
            }
        }
    } catch (err) {
        return handleError(res, StatusCode.status500, `<div class="container">
            <p>404 Error, Page Not Found</p>
            </div> `);
    }
};

export const changeForgotPassword = async (req, res) => {
    try {
        const { password, confirm_password } = req.body;
        const token = JSON.parse(localStorage.getItem("vertoken"));
        const projectRoot = path.resolve(__dirname, "../");
        if (password == confirm_password) {
            const data = await fetchUsersByToken(token);
            if (data.length !== 0) {
                const hash = await bcrypt.hash(password, 12);
                let hashPassword = {
                    password: hash,
                    genToken: ''
                }
                const result2 = await updatePasswordByGenToken(hashPassword, token);
                if (result2) {
                    res.sendFile(path.join(projectRoot, "views", "message.html"));
                } else {
                    res.render(path.join(projectRoot, "views", "forgotPassword.ejs"), {
                        msg: "Internal Error Occurred, Please contact Support.",
                    });
                }

            } else {
                res.render(path.join(projectRoot, "views", "sessionExpire.ejs"), {
                    msg: "Your session has expired",
                });
            }
        } else {
            res.render(path.join(projectRoot, "views", "forgotPassword.ejs"), {
                msg: "Password and Confirm Password do not match",
            });
        }
    } catch (error) {
        return handleError(res, StatusCode.status500, `<div class="container">
            <p>404 Error, Page Not Found</p>
            </div> `);
    }
};

export const sellerSignIn = async (req, res) => {
    try {
        let moduleType = "userLogin"
        const { email, password, fcmToken } = req.body;
        const userData = await isUsersExistsOrNot(email);
        if (userData?.length == 0) {
            return handleError(res, 400, Msg.accountNotFound, []);
        }
        const seller = await fetchSellerInfoById(userData[0].id)
        if (seller?.length == 0) {
            return handleError(res, 400, Msg.accountNotFound, []);
        }
        // if (seller[0].status == 0) {
        //     return handleError(res, 400, Msg.ACCOUNT_SUSPENDED);
        // }

        if (userData[0].is_suspended == 1) {
            return handleError(res, 400, Msg.ACCOUNT_SUSPENDED);
        }

        if (seller[0].status == 0) {
            return handleError(res, 400, Msg.SELLER_ACCOUNT_SUSPENDED);
        }
        let data = { fcmToken: fcmToken }
        await updateSellerInfo(data, userData[0].id);
        let fcm_token = userData[0].fcmToken
        return authenticateUser(res, email, password, userData, fcm_token, moduleType);
    } catch (error) {
        console.log("Error", error)
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const getSupportsData = async (req, res) => {
    try {
        const user = req.user;
        const data = await getSupportDataModel(user?.id);
        return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, data);
    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    }
};

// Order Management
// export const getOrderManagementData = async (req, res) => {
//     try {
//         const seller = req.seller;
//         const orderRows = await db.query(`SELECT DISTINCT oi.order_id, o.shippingDetailed,o.createdAt,o.updatedAt,o.totalAmount,o.orderStatus,o.order_summaryId FROM tbl_order_items oi JOIN tbl_products p ON oi.product_id = p.pId JOIN tbl_orders o ON o.id = oi.order_id WHERE p.seller_id = ? ORDER BY o.createdAt DESC`, [seller?.id]);
//         const adminData = await fetchAdmin();
//         const adminCommission = adminData[0]?.admin_commission ?? 0;
//         const ordersWithProducts = await Promise.all(orderRows?.map(async (order) => {
//             const productRows = await db.query(`SELECT oi.*, p.* FROM tbl_order_items oi JOIN tbl_products p ON oi.product_id = p.pId WHERE oi.order_id = ? AND p.seller_id = ?`, [order.order_id, seller?.id]);
//             const data = [];
//             let orderSummary = await fetchOrderSummaryByOrderId(order.order_summaryId);
//             await Promise.all(
//                 productRows?.map(async (item) => {
//                     const images = await getUserProductImagesModal(item?.product_id);
//                     const product_category = await getProductCategoryByIDModel(item.product_category);
//                     data.push({
//                         product_id: item?.product_id,
//                         product_category: product_category[0]?.category_name ?? '',
//                         quantity: item?.quantity ?? 0,
//                         price: (item?.price_at_order ? item?.price_at_order - (item?.price_at_order * adminCommission / 100) : 0).toString(),
//                         delivery_charge: item?.delivery_charge ? item?.delivery_charge - (item?.delivery_charge * adminCommission / 100) : 0,
//                         delivery_status: item?.delivery_status ?? 0,
//                         product_name: item?.product_name ?? '',
//                         product_description: item?.product_description ?? '',
//                         images: images ?? [],
//                     });
//                 })
//             );
//             return {
//                 order_id: order?.order_id ?? null,
//                 order_placed: order?.createdAt ?? null,
//                 totalAmount: orderSummary[0].total_prices,
//                 status: order?.orderStatus ?? null,
//                 customer_info: order?.shippingDetailed ? JSON.parse(order?.shippingDetailed)[0] : null,
//                 products: data
//             };
//         }));
//         return handleSuccess(res, 200, ordersWithProducts?.length != 0 ? Msg.dataFoundSuccessful : Msg.dataNotFound, ordersWithProducts?.length != 0 ? ordersWithProducts : []);
//     } catch (err) {
//         return handleError(res, 500, Msg.internalServerError);
//     }
// };

// Sales Summary
export const getSalesDashboardData = async (req, res) => {
    try {
        const seller = req.seller;
        const product_data = await getDashboardSalesModel(seller?.id);
        return handleSuccess(res, 200, product_data?.length != 0 ? Msg.dataFoundSuccessful : Msg.dataNotFound, product_data?.length != 0 ? product_data[0] : {});
    } catch (err) {
        return handleError(res, 500, Msg.internalServerError);
    };
};

export const getSalesGrowGraphData = async (req, res) => {
    try {
        const seller = req.seller;
        const { graph_data, filter_for, year } = req.query;
        if (graph_data == "yearly") {
            const graph = await getYearGraphDataModel(year, seller?.id);
            const total = await getTotalyearEarningModel(year, seller?.id);
            const data12 = await getYearlyOrderDataModel(year, seller?.id);
            const data = {
                yearly_total: total?.length != 0 ? total[0]?.yearly_total : 0,
                orders: data12?.length,
                graph
            };
            return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
        } else if (graph_data == "monthly") {
            const data = { filter_for, year, seller_id: seller?.id };
            const graph = await getMonthYearGraphDataModel(data);
            const total = await getTotalMonthlyEarningModel(data);
            const data13 = await getMonthlyOrderDataModel(data);
            const data12 = {
                monthly_total: total?.length != 0 ? total[0]?.monthly_total : 0,
                orders: data13?.length,
                graph
            };
            return handleSuccess(res, 200, Msg.dataFoundSuccessful, data12);
        } else {
            return handleError(res, 400, Msg.GRAPH_DATA_ERROR);
        };
    } catch (err) {
        return handleError(res, 500, Msg.internalServerError);
    };
};

// // Earing & payout 
// export const getEarningDashboardData = async (req, res) => {
//     // try {
//         const seller = req.seller;
//         console.log('seller',seller);

//         const dashboardData = await getProductOrderDataModel(seller?.id);
//         const getPreviousPaidToSeller = await getLastPayoutDataModel(seller?.id);
//         let getListOfPayout = await getListOfTotalPayoutToSeller(seller?.id);
//         console.log('getListOfPayout',getListOfPayout);

//         getListOfPayout[0].seller_id = `'${seller?.id}'`
//         const adminData = await fetchAdmin();
//         console.log(adminData[0]?.admin_commission);
//         const adminCommission = adminData[0]?.admin_commission ?? 0;
//         let val = 0;
//         Promise.all(dashboardData?.map((item) => {
//             const price_order = parseFloat(item?.price_at_order ?? 0);
//             const quantity = parseFloat(item?.quantity ?? 0);
//             const delivery_charge = parseFloat(item?.delivery_charge ?? 0)
//             val += (price_order * quantity) + delivery_charge
//         }));
//         const total_payout = parseFloat(val ?? 0) - parseFloat(getPreviousPaidToSeller[0]?.total_amount ?? 0)
//         const commission_cut = parseFloat((total_payout * adminCommission) / 100)?.toFixed(2);
//         const data = {
//             total_earning: parseFloat(val - (val * adminCommission / 100) ?? 0)?.toFixed(2),
//             total_payout: parseFloat(total_payout - (total_payout * adminCommission / 100) ?? 0)?.toFixed(2),
//             total_paid_payout: parseFloat(getPreviousPaidToSeller[0]?.total_amount - (getPreviousPaidToSeller[0]?.total_amount * adminCommission / 100) ?? 0)?.toFixed(2),
//             getListOfPayout: getListOfPayout
//         };

//         console.log({ commission_cut: getPreviousPaidToSeller[0] })
//         return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
//     // } catch (err) {
//     //     console.log(err)
//     //     return handleError(res, 500, Msg.internalServerError);
//     // };
// };

export const getTopProductsList = async (req, res) => {
    try {
        const seller = req.seller;
        const data = await getTopProductListModel(seller?.id);
        await Promise.all(
            data?.map(async (item) => {
                const images = await getUserProductImagesModal(item?.pId);
                const product_category = await getProductCategoryByIDModel(item.product_category);
                item.images = images;
                item.product_category_name = product_category[0]?.category_name;
            })
        );
        return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
    } catch (err) {
        return handleError(res, 500, Msg.internalServerError);
    };
};

export const updateDeliveryStatus = async (req, res) => {
    try {
        const { delivery_status, product_id } = req.body;
        const product_detail = await getSelledProductByIDModel(product_id);
        if (product_detail?.length == 0) {
            return handleError(res, StatusCode.status400, Msg.dataNotFound);
        };
        const data = {
            delivery_status: delivery_status
        };
        const result = await updateProductDeliveryStatusModel(data, product_id);
        if (result?.affectedRows > 0) {
            let fetchUserByOrderId = await getProductDataByOrderId(product_detail[0].order_id)
            let userData = await fetchUsersById(fetchUserByOrderId[0].userId);
            let usersfetchFcmToken = userData[0]?.fcmToken || ""
            let userId = userData[0].id
            let followId = null
            let notificationType;
            let notificationSend;
            if (delivery_status == 0) {
                notificationType = NotificationTypes.NOTIFICATION_SEND_PENDING
                notificationSend = 'orderPendingNotification';
            } else if (delivery_status == 1) {
                notificationType = NotificationTypes.NOTIFICATION_SEND_SHIPPED
                notificationSend = 'orderShippedNotification';
            } else if (delivery_status == 2) {
                notificationType = NotificationTypes.NOTIFICATION_SEND_DELIVERED
                notificationSend = 'orderDeliveredNotification';
            }
            let productId = product_detail[0].product_id
            let productName = await getProductDetailsById(productId)
            let fullName = productName[0].product_name
            let postId = product_detail[0].order_id
            let id = product_id
            let message = await createNotificationMessage({ notificationSend, fullName, id, userId, followId, usersfetchFcmToken, notificationType, postId });
            await sendNotification(message, postId);
            return handleSuccess(res, StatusCode.status200, Msg.DELIVERY_STATUS_UPDATE_SUCCESSFULLY);
        } else {
            return handleError(res, StatusCode.status400, Msg.FAILED_TO_UPDATE_DELIVERY_STATUS);
        };
    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    };
};

export const getAllProductOrderList = async (req, res) => {
    try {
        const seller = req.seller;
        const product_data = await getAllSellProductListModel(seller?.id);
        await Promise.all(product_data?.map(async (item) => {
            const data = await getProductDataByOrderId(item?.order_id)
            const images = await getUserProductImagesModal(item?.pId);
            if (data?.length != 0) {
                const val_data = JSON.parse(data[0]?.shippingDetailed || '')
                if (val_data?.length != 0) {
                    item.userData = val_data[0]
                };
            };
            if (images?.length != 0) {
                item.product_images = images
            };
        }));
        return handleSuccess(res, 200, Msg.dataFoundSuccessful, product_data);
    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const getProductOrderListById = async (req, res) => {
    try {
        const { product_id } = req.query;
        const product_data = await getAllSellProductListByIdModel(product_id);
        await Promise.all(product_data?.map(async (item) => {
            const data = await getProductDataByOrderId(item?.order_id)
            const images = await getUserProductImagesModal(item?.pId);
            if (data?.length != 0) {
                const val_data = JSON.parse(data[0]?.shippingDetailed || '')
                if (val_data?.length != 0) {
                    item.userData = val_data[0]
                };
            };
            if (images?.length != 0) {
                item.product_images = images
            };
        }));
        const value = product_data?.length != 0 ? product_data[0] : []
        return handleSuccess(res, 200, Msg.dataFoundSuccessful, value);
    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    }
};

// Seller Wallet

// Wallet Payment: We need to create a database table to store transaction records between the seller and the admin.When the admin pays the seller, the seller's wallet balance will be reset to zero. After that, any new product sales will reflect the corresponding amount in the seller's wallet from the date of sale onward.This cycle will continue for each transaction. We have to add the logic accordingly.

export const getSellerWalletData = async (req, res) => {
    try {
        const seller = req.seller;
        const getPreviousPaidToSeller = await getLastPayoutDataModel(seller?.id);
        const dashboardData = await getProductOrderDataModel(seller?.id);
        let val = 0;
        Promise.all(dashboardData?.map((item) => {
            const price_order = parseFloat(item?.price_at_order ?? 0);
            const quantity = parseFloat(item?.quantity ?? 0);
            const delivery_charge = parseFloat(item?.delivery_charge ?? 0)
            val += (price_order * quantity) + delivery_charge
        }));
        const total_payout = parseFloat(val ?? 0) - parseFloat(getPreviousPaidToSeller[0]?.total_amount ?? 0)
        const data = {
            total_payout: parseFloat(total_payout)?.toFixed(2)
        };
        return handleSuccess(res, 200, Msg.dataFoundSuccessful, data);
    } catch (error) {
        console.log(error);
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const getContentManagementData = async (req, res) => {
    try {
        const list = await getContentManagementList();
        if (list?.length != 0) {
            const groupedByDiscoverName = await list?.reduce((acc, item) => {
                acc[item.content_type] = item;
                return acc;
            }, {});
            return handleSuccess(res, 200, Msg.dataFoundSuccessful, groupedByDiscoverName);
        }
    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    };
};


// --------------------seller-boost-product--------------------------------

export const boostProduct = async (req, res) => {
    try {
        const { product_id, packages_id, status } = req.body;
        const fetchBoostProduct = await fetchBoostActiveProductsByProductId(product_id);
        if (!product_id || !packages_id || !status) {
            return handleError(res, 400, 'Product ID or Package ID or status are required');
        }
        if (fetchBoostProduct.length) {
            return handleError(res, 400, 'This Product Is Already Promoted');
        }
        const productDetails = await getProductDetailsById(product_id);
        const [userDetails] = await getSellerDetailsBySeller_d(productDetails[0]?.seller_id);
        if (!userDetails) {
            return handleError(res, 400, 'Seller not found for this product');
        }
        const productName = productDetails[0]?.product_name;
        const promotionPackageId = await getPromotionPackageById(packages_id);
        const durationDays = promotionPackageId[0]?.duration_days;
        const reachCount = promotionPackageId[0]?.reach;
        const promotionPriceInCents = Math.round(Number(promotionPackageId[0]?.price) * 100);
        const sellerId = productDetails[0]?.seller_id;
        const productId = product_id;
        if (status == 1) {
            const [walletBalance] = await fetchWalletBalanceById(userDetails.userId);
            if (!walletBalance) {
                return handleError(res, 400, 'Wallet not found for this user');
            }
            console.log(walletBalance.balance, promotionPackageId[0]?.price);
            if (Number(walletBalance.balance) < Number(promotionPackageId[0]?.price)) {
                return handleError(res, 400, 'Insufficient TT Coins');
            }

            const currentDate = new Date();
            const duration_Days = parseInt(durationDays);
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + duration_Days);
            const product_promotion = {

                user_id: sellerId,
                product_id: product_id,
                package_id: packages_id,
                start_date: currentDate,
                end_date: endDate,
                payment_status: 'paid',
            };

            let insertProductPromotionResult = await insertBoostProducts(product_promotion);
            console.log('insertProductPromotionResult', insertProductPromotionResult);

            if (insertProductPromotionResult.insertId) {
                console.log('true');
                console.log('insertProductPromotionResult.insertId', insertProductPromotionResult.insertId);

                await updateProductBoost(product_id);
                const rechargeData = {
                    user_id: userDetails.userId,
                    amount: promotionPackageId[0]?.price,
                    description: "Product Promotion",
                    status: 1,
                    transaction_id: generateTransactionId(),
                };

                let rechargeResult = await insertWalletHistory(rechargeData);
                return handleSuccess(res, 200, Msg.ProductBoostSuccessfully,);
            } else {
                return handleError(res, 400, Msg.ProductBoostFailed);
            }

        } else {
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `Promote Product: ${productName}`,
                            },
                            unit_amount: promotionPriceInCents,
                        },
                        quantity: 1,
                    }
                ],
                payment_intent_data: {
                    transfer_group: 'promotions',
                    metadata: {
                        type: 'product_promotion',
                        seller_id: sellerId.toString(),
                        product_id: productId.toString(),
                        package_id: packages_id.toString(),
                        duration: durationDays.toString(),
                        reach: reachCount.toString()
                    }

                },
                mode: 'payment',
                success_url: 'https://18.224.187.144:4000/success',
                cancel_url: `${baseurl}/promotion/cancel`,
            });

            return handleSuccess(res, 200, Msg.linkToPay, { url: session.url });
        }

    } catch (error) {
        console.log(error);
        return handleError(res, 500, Msg.internalServerError);
    };
};

export const getBoostedProducts = async (req, res) => {
    try {
        const user = req.user;
        const seller_details = await getSellerDetailsByUserId(user?.id);
        let sellerId = seller_details[0].id
        let fetchBoostedProducts = await fetchBoostProductsBySellerId(sellerId);

        if (fetchBoostedProducts.length > 0) {
            fetchBoostedProducts = await Promise.all(
                fetchBoostedProducts?.map(async (item) => {
                    const product_data = await getProductDataByIdModal(item.product_id);
                    let images = await getUserProductImagesModal(product_data[0].pId)
                    let view_count = await fetchBoostedAnalyticsProductById(item.id)
                    let packagesDetails = await fetchAllPromotionPackagesModelByIds(item.package_id)
                    item.images = images.map(img => img.pImage);
                    item.product_name = product_data[0].product_name;
                    item.view_count = view_count[0].boost_count;
                    item.reach = packagesDetails.length > 0 ? packagesDetails[0].reach : "0"
                    item.price = packagesDetails.length > 0 ? packagesDetails[0].price : 0
                    item.duration_days = packagesDetails.length > 0 ? packagesDetails[0].duration_days : 0
                    return item;
                })
            )
            return handleSuccess(res, 200, Msg.FETCH_BOOSTED_PRODUCTS, fetchBoostedProducts);
        } else {
            return handleError(res, 400, Msg.FAILED_FETCH_BOOSTED_PRODUCTS);
        }
    } catch (error) {
        console.log(error);
        return handleError(res, 500, Msg.internalServerError);
    };
};

export const fetchAllPromotionPackages = async (req, res) => {
    try {
        let fetchPromotionPackages = await fetchAllPromotionPackagesModel();
        if (fetchPromotionPackages.length > 0) {
            return handleSuccess(res, 200, Msg.dataFoundSuccessful, fetchPromotionPackages);
        } else {
            return handleError(res, 400, Msg.dataNotFound, []);
        }
    } catch (error) {
        console.log(error);
        return handleError(res, 500, Msg.internalServerError);
    };
};

export const getBoostedProductById = async (req, res) => {
    try {
        let { id } = req.query
        let fetchData = await fetchBoostedProductById(id)
        let productId = fetchData[0].product_id
        const product_data = await getProductDataByIdModal(productId);
        let images = await getUserProductImagesModal(product_data[0].pId)
        let totalView = await fetchBoostedAnalyticsProductById(id)
        product_data[0].images = images.map(img => img.pImage);
        product_data[0].product_name = product_data[0].product_name;
        product_data[0].totalView = totalView[0].boost_count
        return handleSuccess(res, 200, Msg.FETCH_BOOSTED_PRODUCTS, product_data);

    } catch (error) {
        console.log(error);
        return handleError(res, 500, Msg.internalServerError);
    };
};

export const showBoostedProductInMarketPlace = async (req, res) => {
    try {
        const user = req.user;
        let product_data = await fetchAllBoostedProduct();
        if (product_data.length == 0) {
            return handleError(res, StatusCode.status400, 'Boosted Products Not Found', product_data);
        }
        product_data = await Promise.all(
            product_data?.map(async (item) => {
                const product_category = await getProductCategoryByIDModel(item.product_category);
                const sellerData = await getSellerDetailsBySeller_d(item.seller_id)
                const check = await checkAvailableProductModel(item?.pId, user?.id);
                const images = await getUserProductImagesModal(item?.pId);
                item.businessName = sellerData[0]?.businessName
                item.product_category = item.product_category
                item.product_categoryName = product_category[0]?.category_name;
                item.category_id = product_category[0]?.id;
                item.isCart = check?.length > 0 ? true : false;
                item.images = images;
                return item;
            })
        );
        return handleSuccess(res, StatusCode.status200, Msg.FETCH_BOOSTED_PRODUCTS, product_data);
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};


// ------------------------------------------add product with there sizes and colors----------------------------//

export const productSizes = async (req, res) => {
    try {
        const { category } = req.query;
        let rows = [];
        if (category == 'APPAREL') {
            rows = await fetchProductSizesApperelsModel(category);
        } else {
            rows = await fetchProductSizesModel(category);
        }
        if (!rows || rows.length === 0) {
            return handleSuccess(res, 200, Msg.dataNotFound, {});
        }
        const fitTypesSet = new Set();
        const sizes = {};
        rows.forEach((row) => {
            const { size_system, fit_type, size_value } = row;
            if (fit_type) {
                fitTypesSet.add(fit_type);
            }
            if (!sizes[size_system]) {
                sizes[size_system] = new Set();
            }
            sizes[size_system].add(size_value);
        });
        let mergedSizes = [];
        if (category == 'APPAREL') {
            mergedSizes = Array.from(new Set(rows.map(r => `${r.size_value}`)));
        } else {
            mergedSizes = Array.from(new Set(rows.map(r => `${r.size_system} -${r.size_value}`)));
        }

        const response = {
            category: category.toUpperCase(),
            fit_types: Array.from(fitTypesSet),
            sizes: mergedSizes
        };
        return handleSuccess(res, 200, Msg.dataFoundSuccessful, response);

    } catch (error) {
        console.error(error);
        return handleError(res, 500, Msg.internalServerError);
    }
};

// export const addSellerProduct = async (req, res) => {
//     try {
//         const { product_name, product_category, category_type, product_description, base_price, discount, final_price, shipping_charge, free_shipping, colors } = req.body;
//         const user = req.user;
//         const files = req.files || [];
//         if (!colors) {
//             return handleError(res, 400, "Colors & variants data is required");
//         }
//         const parsedColors = JSON.parse(colors);
//         if (!Array.isArray(parsedColors) || parsedColors.length === 0) {
//             return handleError(res, 400, "Invalid colors format");
//         }

//         const sellerDetails = await getSellerDetailsByUserId(user.id);
//         if (!sellerDetails?.length) {
//             return handleError(res, 400, Msg.SELLER_NOT_AVAILABLE);
//         }

//         const onboarding = await fetchSellerOnBoardProfileCompleteOrnot(
//             sellerDetails[0].id
//         );
//         if (!onboarding?.[0]?.is_onboarding_complete) {
//             return handleError(res, 400, "Please complete your onboarding profile first.");
//         }
//         const productId = generateUniqueProductID();
//         await addProductModel({
//             pId: productId,
//             seller_id: sellerDetails[0].id,
//             product_name,
//             product_category,
//             product_description,
//             base_price,
//             discount,
//             final_price,
//             shipping_charges: shipping_charge,
//             free_shipping,
//             stock_quantity: null,
//             low_stock_alert: null
//         });
//         const colorMap = {};
//         for (const c of parsedColors) {
//             // if (c.name == 'DEFAULT') {
//             //     colorMap[c.name] = 0
//             //     continue
//             // } else {
//                 const result = await addProductColorModel(productId, c.name);
//                 colorMap[c.name] = result.insertId;
//             // }
//         }

//         for (const c of parsedColors) {
//             const color_id = colorMap[c.name];
//             // if (color_id === 0) {
//             //     continue
//             // } else {
//                 for (const v of c.variants) {
//                     let sizeCategory;
//                     let sizeRow;
//                     if (category_type === 'APPAREL') {
//                         sizeCategory = 'APPAREL';
//                         sizeRow = await fetchSizeIdBySystemAndValueModel(sizeCategory, v.size_system, v.size);
//                     } else if (category_type === 'BOOTS') {
//                         sizeCategory = 'BOOTS';
//                         let [_, country, num] = v.size.match(/([A-Za-z]+)\s*-?(\d+)/);
//                         sizeRow = await fetchSizeIdBySystemAndValueModel(sizeCategory, country, num);
//                     } else {
//                         throw new Error('Invalid product category');
//                     }
//                     if (!sizeRow.length) {
//                         throw new Error(`Invalid size ${v.size}`);
//                     }
//                     await addProductVariantModel(productId, color_id, sizeRow[0].id, v.stock, v.low_stock)
//                 }
//             // }
//         }

//         for (const file of files) {
//             const match = file.fieldname.match(/images\[(.+)\]/);
//             if (!match) continue;

//             const colorName = match[1];
//             const color_id = colorMap[colorName];
//             if (!color_id) continue;

//             await addProductImageModel({ pId: productId, color_id, pImage: file.location });
//         }
//         return handleSuccess(res, StatusCode.status201, Msg.ADD_PRODUCT)
//     } catch (err) {
//         console.error("Add product error:", err);
//         return handleError(res, 500, err.message || Msg.internalServerError);
//     }
// };

export const addSellerProduct = async (req, res) => {
    try {
        const {
            product_name,
            product_category,
            category_type,
            product_description,
            base_price,
            discount,
            final_price,
            shipping_charge,
            free_shipping,
            colors
        } = req.body;

        const user = req.user;
        const files = req.files || [];

        if (!colors) {
            return handleError(res, 400, "Colors data required");
        }
        const parsedColors = JSON.parse(colors);
        const sellerDetails = await getSellerDetailsByUserId(user.id);
        if (!sellerDetails?.length) {
            return handleError(res, 400, Msg.SELLER_NOT_AVAILABLE);
        }
        const onboarding = await fetchSellerOnBoardProfileCompleteOrnot(sellerDetails[0].id);
        if (!onboarding?.[0]?.is_onboarding_complete) {
            return handleError(res, 400, "Complete onboarding first");
        }
        const productId = generateUniqueProductID();
        await addProductModel({
            pId: productId,
            seller_id: sellerDetails[0].id,
            product_name,
            product_category,
            product_description,
            base_price,
            discount,
            final_price,
            shipping_charges: shipping_charge,
            free_shipping,
            stock_quantity: null,
            low_stock_alert: null
        });

        /* =====================================================
           🔴 NON-APPAREL / NON-FOOTWEAR → DEFAULT VARIANT
        ====================================================== */
        if (!['APPAREL', 'FOOTWEAR'].includes(category_type)) {
            const defaultColor = parsedColors[0]; // DEFAULT
            const defaultVariant = defaultColor.variants[0];
            const colorRes = await addProductColorModel(productId, 'DEFAULT');
            const colorId = colorRes.insertId;
            const sizeRow = await fetchSizeIdBySystemAndValueModel('DEFAULT', 'DEFAULT', 'DEFAULT');
            if (!sizeRow.length) {
                throw new Error('DEFAULT size missing in size master');
            }
            await addProductVariantModel(productId, colorId, sizeRow[0].id, defaultVariant.stock, defaultVariant.low_stock);
            for (const file of files) {
                await addProductImageModel({ pId: productId, color_id: colorId, pImage: file.location });
            }
            return handleSuccess(res, StatusCode.status201, Msg.ADD_PRODUCT);
        }

        /* =====================================================
           🟢 APPAREL / FOOTWEAR → REAL VARIANTS
        ====================================================== */
        const colorMap = {};
        for (const c of parsedColors) {
            const result = await addProductColorModel(productId, c.name);
            colorMap[c.name] = result.insertId;
        }
        for (const c of parsedColors) {
            const color_id = colorMap[c.name];
            for (const v of c.variants) {
                let sizeRow;
                if (category_type === 'APPAREL') {
                    sizeRow = await fetchSizeIdBySystemAndValueModel('APPAREL', v.size_system, v.size);
                } else if (category_type === 'FOOTWEAR') {
                    // const [_, sys, num] = v.size.match(/([A-Za-z]+)\s*(\d+)/);
                    const match = v.size.match(/([A-Za-z]+)\s*-?\s*(\d+)/);
                    if (!match) {
                        throw new Error(`Invalid footwear size format: ${v.size}`);
                    }
                    const [, sys, num] = match;
                    sizeRow = await fetchSizeIdBySystemAndValueModel('BOOTS', sys, num);
                } else {
                    throw new Error('Invalid product category');
                }
                if (!sizeRow.length) {
                    throw new Error(`Invalid size ${v.size}`);
                }
                await addProductVariantModel(productId, color_id, sizeRow[0].id, v.stock, v.low_stock);
            }
        }

        for (const file of files) {
            const match = file.fieldname.match(/images\[(.+)\]/);
            if (!match) continue;
            const color_id = colorMap[match[1]];
            if (!color_id) continue;
            await addProductImageModel({ pId: productId, color_id, pImage: file.location });
        }
        return handleSuccess(res, StatusCode.status201, Msg.ADD_PRODUCT);
    } catch (err) {
        console.error("Add product error:", err);
        return handleError(res, 500, err.message);
    }
};


export const getAllProductListGetBySellerId = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = userId || req.user.id;
        const sellerDetails = await getSellerDetailsByUserId(user);
        if (!sellerDetails?.length) {
            return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
        }
        const products = await getProductListModal(sellerDetails[0].id);
        await Promise.all(
            products.map(async (product) => {
                product.businessName = sellerDetails[0].businessName;
                product.bussinessDescription = sellerDetails[0].bussinessDescription;
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

export const getProductById = async (req, res) => {
    try {
        const { product_id } = req.query;
        const userId = req.user.id;
        let product_detail = await getProductDetailsById(product_id);
        if (!product_detail?.length) {
            return handleError(res, 404, Msg.dataNotFound);
        }
        product_detail = await Promise.all(
            product_detail.map(async (item) => {
                const images = await getUserProductImagesModal(item.pId);
                const seller_details = await getSellerDetailsBySeller_d(item.seller_id);
                const product_category = await getProductCategoryByIDModel(item.product_category);
                const addedInCart = await fetchcartByUserId(product_id, userId);
                const isFavrouite = await fetchfavroiteByUserIdAndProductId(product_id, userId);
                item.product_categoryName = product_category[0]?.category_name;
                item.isFavrouite = isFavrouite.length > 0;
                item.addedInCart = addedInCart.length > 0;
                item.itsOwnProduct = seller_details[0]?.userId == userId;
                item.businessName = seller_details[0].businessName;
                item.bussinessDescription = seller_details[0].bussinessDescription;
                item.bussinesslogo = seller_details[0].bussinesslogo;
                item.images = images;
                // ---------- NEW LOGIC (COLORS + VARIANTS) ----------
                const colors = await getProductColorsByPid(item.pId);
                if (!colors || colors.length === 0) {
                    item.colors = [];
                    return item;
                }
                const colorData = [];
                for (const color of colors) {
                    const colorImages = await getUserProductImagesByColorModal(item.pId, color.id);
                    let variants = await getProductVariantsByPid(item.pId, color.id);
                    if (variants.length > 0) {
                        if (product_category[0]?.category_name == 'APPAREL') {
                            variants = await Promise.all(
                                variants.map(async (item) => {
                                    const isExists = await isProductIsAllreadyAddedToCart(
                                        item.varient_id,
                                        userId
                                    );
                                    return {
                                        ...item,
                                        addedInCart: isExists.length > 0
                                    };
                                })
                            );
                            // variants = variants
                        } else {

                            // variants = variants.map(v => ({ ...v, size_value: `${v.size_system} -${v.size_value}` }));
                            variants = await Promise.all(
                                variants.map(async (item) => {
                                    const isExists = await isProductIsAllreadyAddedToCart(
                                        item.varient_id,
                                        userId
                                    );
                                    return {
                                        ...item,
                                        size_value: `${item.size_system} - ${item.size_value}`,
                                        addedInCart: isExists.length > 0
                                    };
                                })
                            );

                        }
                    } else {
                        variants = [];
                    }
                    colorData.push({
                        color: color.color_name,
                        images: colorImages || [],
                        variants: variants
                    });
                }
                item.colors = colorData;
                return item;
            })
        );
        return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, product_detail[0]);
    } catch (err) {
        console.error("getProductById error:", err);
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    }
};

export const getAllCategoryData = async (req, res) => {
    try {
        const category_data = await getAllProductCategoryModel();
        return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, category_data);
    } catch (err) {
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    };
};

// export const updateProductDetails = async (req, res) => {
//     try {
//         const { product_id, product_name, product_category, product_description, base_price, discount,
//             final_price, shipping_charge, free_shipping, delete_img_id, colors, category_type } = req.body;

//         const user = req.user;
//         const files = req.files || [];

//         const seller_details = await getSellerDetailsByUserId(user.id);
//         if (!seller_details?.length) {
//             return handleError(res, 400, Msg.SELLER_NOT_AVAILABLE);
//         }

//         await updateProductModel(
//             {
//                 product_name, product_category, product_description, base_price, discount,
//                 final_price, shipping_charges: shipping_charge, free_shipping
//             },
//             product_id
//         );

//         const deleteIds = delete_img_id ? JSON.parse(delete_img_id) : [];
//         for (const imgId of deleteIds) {
//             const img = await getProductImageModal(imgId);
//             if (img?.length) {
//                 await deleteFromS3(img[0].pImage);
//                 await deleteProductImageModal(imgId);
//             }
//         }

//         const parsedColors = JSON.parse(colors);
//         const existingColors = await getProductColorsByPid(product_id);
//         const existingColorMap = {};
//         existingColors.forEach(c => { existingColorMap[c.color_name] = c.id; });
//         const incomingColorNames = parsedColors.map(c => c.name);
//         const colorsToDelete = existingColors.filter(c => !incomingColorNames.includes(c.color_name));
//         for (const color of colorsToDelete) {
//             const images = await getUserProductImagesByColorModal(product_id, color.id);
//             for (const img of images) {
//                 await deleteFromS3(img.pImage);
//             }
//             await deleteProductImagesByColorId(color.id);
//             await deleteProductVariantsByColorId(product_id, color.id);
//             await deleteProductColorById(color.id);
//         }
//         const colorMap = {};
//         for (const c of parsedColors) {
//             if (existingColorMap[c.name]) {
//                 colorMap[c.name] = existingColorMap[c.name];
//             } else {
//                 const insert = await addProductColorsByPidAndColorName(product_id, c.name);
//                 colorMap[c.name] = insert.insertId;
//             }
//         }
//         for (const colorName of Object.keys(colorMap)) {
//             await deleteProductVariantsByColorId(product_id, colorMap[colorName]);
//         }
//         for (const c of parsedColors) {
//             const color_id = colorMap[c.name];
//             for (const v of c.variants) {
//                 let sizeRow;
//                 if (category_type === 'APPAREL') {
//                     sizeRow = await getDataFromSizeMasterModel(v.size_system, v.size);
//                 } else {
//                     let [_, country, num] = v.size.match(/([A-Za-z]+)\s*-?(\d+)/);
//                     sizeRow = await getDataFromSizeMasterModel(country, num);
//                 }
//                 if (!sizeRow.length) {
//                     throw new Error(`Invalid size ${v.size}`);
//                 }
//                 await addProductVariantModel(product_id, color_id, sizeRow[0].id, v.stock, v.low_stock);
//             }
//         }
//         for (const file of files) {
//             const match = file.fieldname.match(/images\[(.+)\]/);
//             if (!match) continue;
//             const colorName = match[1];
//             const color_id = colorMap[colorName];
//             if (!color_id) continue;
//             await addProductImageModel({ pId: product_id, color_id, pImage: file.location });
//         }
//         return handleSuccess(res, 200, Msg.UPDATE_PRODUCT);
//     } catch (err) {
//         console.error("updateProductDetails error:", err);
//         return handleError(res, 500, err.message || Msg.internalServerError);
//     }
// };

export const updateProductDetails = async (req, res) => {
    try {
        const {
            product_id,
            product_name,
            product_category,
            product_description,
            base_price,
            discount,
            final_price,
            shipping_charge,
            free_shipping,
            delete_img_id,
            colors,
            category_type
        } = req.body;

        const user = req.user;
        const files = req.files || [];

        const seller_details = await getSellerDetailsByUserId(user.id);
        if (!seller_details?.length) {
            return handleError(res, 400, Msg.SELLER_NOT_AVAILABLE);
        }
        await updateProductModel(
            {
                product_name, product_category, product_description, base_price, discount, final_price,
                shipping_charges: shipping_charge, free_shipping
            },
            product_id
        );
        const deleteIds = delete_img_id ? JSON.parse(delete_img_id) : [];
        for (const imgId of deleteIds) {
            const img = await getProductImageModal(imgId);
            if (img?.length) {
                await deleteFromS3(img[0].pImage);
                await deleteProductImageModal(imgId);
            }
        }
        const parsedColors = colors ? JSON.parse(colors) : [];
        if (category_type === 'APPAREL' || category_type === 'FOOTWEAR') {
            const existingColors = await getProductColorsByPid(product_id);
            const existingColorMap = {};
            existingColors.forEach(c => (existingColorMap[c.color_name] = c.id));
            const incomingColorNames = parsedColors.map(c => c.name);
            for (const color of existingColors) {
                if (!incomingColorNames.includes(color.color_name)) {
                    const images = await getUserProductImagesByColorModal(product_id, color.id);
                    for (const img of images) {
                        await deleteFromS3(img.pImage);
                    }
                    await deleteProductImagesByColorId(color.id);
                    await deleteProductVariantsByColorId(product_id, color.id);
                    await deleteProductColorById(color.id);
                }
            }
            const colorMap = {};
            for (const c of parsedColors) {
                if (existingColorMap[c.name]) {
                    colorMap[c.name] = existingColorMap[c.name];
                } else {
                    const insert = await addProductColorsByPidAndColorName(product_id, c.name);
                    colorMap[c.name] = insert.insertId;
                }
            }
            for (const colorId of Object.values(colorMap)) {
                await deleteProductVariantsByColorId(product_id, colorId);
            }
            for (const c of parsedColors) {
                const color_id = colorMap[c.name];
                for (const v of c.variants) {
                    let sizeRow;
                    if (category_type === 'APPAREL') {
                        sizeRow = await fetchSizeIdBySystemAndValueModel('APPAREL', v.size_system, v.size);
                    } else if (category_type === 'FOOTWEAR') {
                        // const [_, sys, num] = v.size.match(/([A-Za-z]+)\s*(\d+)/);
                        const match = v.size.match(/([A-Za-z]+)\s*-?\s*(\d+)/);
                        if (!match) {
                            throw new Error(`Invalid footwear size format: ${v.size}`);
                        }
                        const [, sys, num] = match;
                        sizeRow = await fetchSizeIdBySystemAndValueModel('BOOTS', sys, num);
                    } else {
                        throw new Error('Invalid product category');
                    }
                    if (!sizeRow?.length) {
                        throw new Error(`Invalid size ${v.size}`);
                    }
                    await addProductVariantModel(product_id, color_id, sizeRow[0].id, v.stock, v.low_stock);
                }
            }
            for (const file of files) {
                const match = file.fieldname.match(/images\[(.+)\]/);
                if (!match) continue;
                const colorName = match[1];
                const color_id = colorMap[colorName];
                if (!color_id) continue;
                await addProductImageModel({ pId: product_id, color_id, pImage: file.location });
            }

        }
        /* ================= CASE 2: ALL OTHER CATEGORIES ================= */
        else {
            const colorInsert = await fetchColorIdByPidAndColorName(product_id);
            const color_id = colorInsert[0].id;
            const defaultVariant = parsedColors[0].variants;
            const sizeRow = await getDataFromSizeMasterModel('DEFAULT', 'DEFAULT');
            let stock_quantity = defaultVariant[0].stock
            let low_stock = defaultVariant[0].low_stock
            let size_id = sizeRow[0].id
            await updateProductVariantByIdStockModel(product_id, color_id, stock_quantity, low_stock, size_id);
            for (const file of files) {
                await addProductImageModel({ pId: product_id, color_id, pImage: file.location });
            }
        }
        return handleSuccess(res, 200, Msg.UPDATE_PRODUCT);
    } catch (err) {
        console.error("updateProductDetails error:", err);
        return handleError(res, 500, err.message || Msg.internalServerError);
    }
};

export const fetchLowStockProducts = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = userId || req.user.id;
        const sellerDetails = await getSellerDetailsByUserId(user);
        if (!sellerDetails?.length) {
            return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
        }
        const products = await fetchLowProductStock(sellerDetails[0].id);
        if (!products || products.length === 0) {
            return handleError(res, StatusCode.status400, Msg.dataNotFound, []);
        }
        await Promise.all(
            products.map(async (product) => {
                product.businessName = sellerDetails[0].businessName;
                product.bussinessDescription = sellerDetails[0].bussinessDescription;
                const colors = await getProductColorsByPid(product.pId);
                if (!colors || colors.length === 0) {
                    product.colors = [];
                    product.variants = [];
                    return product;
                }
                const colorResults = [];
                for (const color of colors) {
                    const colorImages = await getUserProductImagesByColorModal(product.pId, color.id);
                    const variants = await fetchLowStockProductVariantsByPid(product.pId, color.id, product.size_id);
                    colorResults.push({
                        color: color.color_name,
                        images: colorImages?.length ? colorImages : [],
                        variants: variants || []
                    });
                }
                product.colors = colorResults;
                return product;
            })
        );
        return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, products);
    } catch (err) {
        console.error("Get product list error:", err);
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    }
};

export const fetchOutOfStockProducts = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = userId || req.user.id;
        const sellerDetails = await getSellerDetailsByUserId(user);
        if (!sellerDetails?.length) {
            return handleError(res, StatusCode.status400, Msg.SELLER_NOT_AVAILABLE);
        }
        const products = await fetchOutOfStockProductsModel(sellerDetails[0].id);
        if (!products || products.length === 0) {
            return handleError(res, StatusCode.status400, Msg.dataNotFound, []);
        }
        await Promise.all(
            products.map(async (product) => {
                product.businessName = sellerDetails[0].businessName;
                product.bussinessDescription = sellerDetails[0].bussinessDescription;
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
                return product;
            })
        );
        return handleSuccess(res, StatusCode.status200, Msg.dataFoundSuccessful, products);
    } catch (err) {
        console.error("Get product list error:", err);
        return handleError(res, StatusCode.status500, Msg.internalServerError);
    }
};

export const getEarningDashboardData = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const [grossRow] = await getSellerGrossEarningsModel(sellerId);
        const [receivedRow] = await getSellerTotalReceivedModel(sellerId);
        let payoutList = await getSellerPayoutListModel(sellerId);
        payoutList = payoutList.map((item) => {
            item.amount = Number(item.payout_amount || 0);
            item.id = Number(item.stripe_transfer_id.replace(/\D/g, ''));
            item.admin_commission = item.admin_commission;
            item.platformFee = '0.00';
            return item
        })
        const admin = await fetchAdmin();
        const adminCommission = Number(admin[0].admin_commission || 0);
        const gross = Number(grossRow.gross_earnings || 0);
        const platformFee = (gross * adminCommission) / 100;
        const netEarnings = gross - platformFee;
        const received = Number(receivedRow.received_amount || 0);
        const pending = Math.max(netEarnings - received, 0);
        return handleSuccess(res, 200, Msg.dataFoundSuccessful, {
            total_earning: received.toFixed(2),
            total_payout: pending.toFixed(2),   // already paid
            total_paid_payout: received.toFixed(2),
            getListOfPayout: payoutList
        });

    } catch (err) {
        console.error(err);
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const sellerDashboardData = async (req, res) => {
    try {
        const user = req.user;
        const seller = req.seller;
        const sellerDetails = await getSellerDetailsByUserId(user.id);
        if (!sellerDetails?.length) {
            return handleError(res, 400, Msg.SELLER_NOT_AVAILABLE);
        }
        const sellerId = sellerDetails[0].id;
        const [productCount] = await getDashboartCount(sellerId);
        const orderItems = await getProductOrderDataModel(sellerId);
        let totalQty = 0;
        for (const item of orderItems) {
            totalQty += Number(item.quantity || 0);
        }
        const orderRows = await db.query(`
      SELECT DISTINCT oi.order_id
      FROM tbl_order_items oi
      JOIN tbl_products p ON p.pId = oi.product_id
      WHERE p.seller_id = ?
    `, [sellerId]);
        const payouts = await fetchSellerPayoutBySellerId(sellerId);
        const totalEarnings = payouts.length ? Number(payouts[0].total_payout).toFixed(2) : 0.00;
        const onboarding = await fetchSellerOnBoardProfileCompleteOrnot(sellerId);
        productCount.total_sale = Number(totalEarnings);
        productCount.total_product_sale_count = totalQty;
        productCount.total_order = orderRows.length;
        productCount.isSellerAccountOrNot = onboarding.length && onboarding[0].is_onboarding_complete === 1 ? 1 : 0;
        return handleSuccess(
            res,
            StatusCode.status200,
            Msg.dataFoundSuccessful,
            productCount
        );

    } catch (err) {
        console.error("sellerDashboardData error:", err);
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const getOrderManagementData = async (req, res) => {
    try {
        const seller = req.seller;

        // 1️⃣ Get seller orders
        const orderRows = await db.query(`
      SELECT DISTINCT 
        oi.order_id,
        o.shippingDetailed,
        o.createdAt,
        o.orderStatus
      FROM tbl_order_items oi
      JOIN tbl_products p ON oi.product_id = p.pId
      JOIN tbl_orders o ON o.id = oi.order_id
      WHERE p.seller_id = ?
      ORDER BY o.createdAt DESC
    `, [seller.id]);

        const ordersWithProducts = await Promise.all(
            orderRows.map(async (order) => {

                // 2️⃣ Get only seller’s products for this order
                const productRows = await db.query(`
          SELECT 
            oi.quantity,
            oi.price_at_order,
            oi.delivery_charge,
            oi.delivery_status,
            p.pId AS product_id,
            p.product_name,
            p.product_description,
            p.product_category
          FROM tbl_order_items oi
          JOIN tbl_products p ON oi.product_id = p.pId
          WHERE oi.order_id = ?
            AND p.seller_id = ?
        `, [order.order_id, seller.id]);

                let products = [];
                let sellerTotalAmount = 0;
                const shippingAddedForProduct = new Set(); // ✅ shipping once per product

                for (const item of productRows) {
                    const images = await getUserProductImagesModal(item.product_id);
                    const product_category = await getProductCategoryByIDModel(item.product_category);

                    // 🔹 Product price × quantity
                    const productAmount =
                        Number(item.price_at_order) * Number(item.quantity);

                    // 🔹 Shipping added once per product
                    let shipping = 0;
                    if (!shippingAddedForProduct.has(item.product_id)) {
                        shipping = Number(item.delivery_charge || 0);
                        shippingAddedForProduct.add(item.product_id);
                    }

                    const itemTotal = productAmount + shipping;
                    sellerTotalAmount += itemTotal;

                    products.push({
                        product_id: item.product_id,
                        product_category: product_category?.[0]?.category_name ?? '',
                        quantity: item.quantity,
                        price: productAmount.toFixed(2),
                        delivery_charge: Number(shipping.toFixed(2)),
                        delivery_status: item.delivery_status ?? 0,
                        product_name: item.product_name ?? '',
                        product_description: item.product_description ?? '',
                        images: images ?? [],
                    });
                }

                return {
                    order_id: order.order_id,
                    order_placed: order.createdAt,
                    totalAmount: sellerTotalAmount.toFixed(2), // ✅ seller-only
                    status: order.orderStatus,
                    customer_info: order.shippingDetailed
                        ? JSON.parse(order.shippingDetailed)[0]
                        : null,
                    products
                };
            })
        );

        return handleSuccess(
            res,
            200,
            ordersWithProducts.length
                ? Msg.dataFoundSuccessful
                : Msg.dataNotFound,
            ordersWithProducts
        );

    } catch (err) {
        console.error("getOrderManagementData:", err);
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const updateProductVariantStock = async (req, res) => {
    try {
        const { pid, color_id, size_id, stock_quantity } = req.body;
        if (
            stock_quantity === undefined ||
            !pid ||
            !color_id
        ) {
            return handleError(res, 400, "All fields are required");
        }



        // Check variant exists
        const variant = await getProductVariantByPidAndColor(pid, color_id, size_id);
        if (!variant.length) {
            return handleError(res, 404, "Product variant not found");
        }

        if (Number(variant[0].low_stock_alert) >= Number(stock_quantity)) {
            return handleError(
                res,
                400,
                "stock quantity alert must be greater than low quantity"
            );
        }
        // Update variant stock
        const result = await updateProductVariantStockModel({
            pid,
            color_id,
            stock_quantity,
            size_id
        });

        if (result.affectedRows > 0) {
            return handleSuccess(res, 200, "Product variant stock updated successfully");
        }

        return handleError(res, 400, "Failed to update product variant");

    } catch (err) {
        console.error("updateProductVariantStock:", err);
        return handleError(res, 500, Msg.internalServerError);
    }
};


export const getInventoryDataCount = async (req, res) => {
    try {
        const user = req.user;

        const seller_details = await getSellerDetailsByUserId(user?.id);
        if (!seller_details?.length) {
            return handleError(
                res,
                StatusCode.status400,
                Msg.SELLER_NOT_AVAILABLE
            );
        }

        const sellerId = seller_details[0].id;

        const [inventory] = await getInventoryDataCountModel(sellerId);
        console.log('inventory', inventory);


        return handleSuccess(
            res,
            StatusCode.status200,
            Msg.dataFoundSuccessful,
            inventory
        );

    } catch (err) {
        console.error("getInventoryDataCount:", err);
        return handleError(
            res,
            StatusCode.status500,
            Msg.internalServerError
        );
    }
};

export const fetchUserOrderByOrderId = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { orderId } = req.query;
        const sellerInfo = await fetchSellerInfoById(userId);
        if (!sellerInfo.length) {
            return handleError(res, 403, "Seller not found");
        }
        const seller_id = sellerInfo[0].id;
        const orders = await modelFetchOrdersByOrderId(orderId);
        if (!orders.length) {
            return handleError(res, 404, "Order not found");
        }
        const order = orders[0];
        order.shippingDetailed = order.shippingDetailed
            ? JSON.parse(order.shippingDetailed)
            : {};
        const [orderBookedBy] = await fetchUsersById(order.userId);
        const orderItems = await fetchOrderItemByIDForSeller(order.id, seller_id);
        if (!orderItems.length) {
            return handleSuccess(res, 200, "Order found successfully", {
                order_id: order.id,
                products: [],
                paymentSummary: {
                    subtotal: "0.00",
                    shipping: "0.00",
                    total: "0.00",
                }
            });
        }
        const products = await Promise.all(
            orderItems.map(async (i) => {
                const images = await getUserProductImagesByColorModal(
                    i.product_id,
                    i.color_id
                );

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
                    isSelfProduct: true,
                    deliveryStatus: i.delivery_status,
                    shippingCharges: i.delivery_charge
                };
            })
        );
        const subtotal = products.reduce(
            (sum, p) => sum + (p.price_at_order * p.quantity),
            0
        );
        const shippingCharge = Number(order.shipping_price || 0);
        const total = subtotal + shippingCharge;
        return handleSuccess(res, 200, "Order found successfully", {
            order_id: order.id,
            order_date: order.order_date,
            paymentStatus: order.paymentStatus,
            orderBookedBy,
            shippingDetailed: order.shippingDetailed,
            orderStatus: order.orderStatus,
            paymentSummary: {
                subtotal: subtotal.toFixed(2),
                shipping: shippingCharge.toFixed(2),
                total: total.toFixed(2),
            },
            products
        });

    } catch (error) {
        console.error("fetchUserOrderByOrderId:", error);
        return handleError(res, 500, error.message);
    }
};

export const fetchAllColours = async (req, res) => {
    try {
        const colors = await fetchAllColorModel();
        if (!colors.length) {
            return handleError(res, 403, "There no colours found", []);
        }
        return handleSuccess(res, 200, "Colours found successfully", colors);
    } catch (error) {
        console.error("fetchUserOrderByOrderId:", error);
        return handleError(res, 500, error.message);
    }
};