import path from 'path';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import Msg from '../utils/message.js';
import { sendEmail } from '../utils/emailService.js';
import { handleError, handleSuccess, joiErrorHandle } from '../utils/responseHandler.js';
import { deleteFileFromS3, getPublicUrl } from '../middleware/upload.js';
import { body } from 'express-validator';
import { baseurl } from '../config/path.js';
import { addFcmTokenWhenLogin, fetchAllInvestorNotificationModel, fetchAllPendingRanchesModelPending, fetchInvestedRanchesByRanchesIdPending, fetchInvestorStats, getAllRanches, getInvestedRanchesByInvesterId, getInvesterByUserIdModel, getInvestorByEmail, getInvestorById, getRanchesById } from '../models/investor.model.js';
import { authenticateUser, comparePassword, generateToken, sendUserSupportEmail } from '../utils/user_helper.js';
import { fetchAllPendingRanchesModel, fetchBookingRanchesById, fetchChatIdThroughRanchesIdAndInvestor, fetchInvestedRanchesByRanchesId, fetchInvesterApplicationFormModel, fetchInvesterApplicationFormModelByUserId, fetchInvesterApplicationMediaModel, fetchInvesterByThereIds, fetchMyApprovalRanchesBookedDatesModel, fetchMyRanchesBookedDatesModel, fetchRanchesBlackoutDaysModel, fetchRanchesBookedDatesModel, fetchRanchesByIdUsersModel, fetchUnreadRanchesChatCountById, fetchUsersIdsByInvestorId, insertRanchBookedDatesModel, insertRanchBookingModel, investerInsertContactSupport, modelFetchInvestedRanchesById, modelFetchInvestedRanchesByRanchesId, modelRanchesPurchaseHistory, ranchesPurchasesByInvesters, totalCalculationSharedPurchase, updateTotalShares, updateUserForgotPasswordOtp } from '../models/user.model.js';
import { fetchRanchesDocumentsModel, fetchRanchesMediaModel } from '../models/admin.model.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const investorLogin = async (req, res) => {
    try {
        const { email, password, fcmToken } = req.body;
        const userData = await getInvestorByEmail(email);
        if (userData?.length == 0) {
            return handleError(res, 400, Msg.INVESTOR_APPLICATION_NOT_FOUND, []);
        }
        if (userData[0].status == 2) {
            return handleError(res, 400, Msg.INVESTOR_APPLICATION_REJECTED, []);
        }

        if (userData[0].status == 0) {
            return handleError(res, 400, Msg.INVESTOR_APPLICATION_IS_PENDING, []);
        }
        console.log(password, userData[0].password);

        const match = await comparePassword(password, userData[0].password);
        if (match) {
            const jwt_token = await generateToken(userData[0]);
            await addFcmTokenWhenLogin(fcmToken, userData[0].id)
            return handleSuccess(res, 200, Msg.loginSuccess, jwt_token);
        } else {
            return handleError(res, 400, Msg.currentPasswordIncorrect, []);
        }
    } catch (error) {
        console.error(error);
        return handleError(res, 500, Msg.internalServerError);
    }
};

export const getInvestorProfile = async (req, res) => {
    try {
        let { id } = req.user;
        let checkUser = await getInvestorById(id);

        if (checkUser.length == 0) {
            return handleError(res, 400, Msg.userNotFound, []);
        }

        if (checkUser[0].documents) {
            checkUser[0].documents = JSON.parse(checkUser[0].documents);
        }

        if (checkUser[0].disclosures) {
            try {
                const parsed = JSON.parse(checkUser[0].disclosures);
                checkUser[0].disclosures = JSON.parse(parsed)
            } catch (e) {
                console.error("Invalid JSON in disclosures:", e);
                checkUser[0].disclosures = {};
            }
        }

        return handleSuccess(res, 200, Msg.userDetailedFoundSuccessfully, checkUser[0]);
    } catch (error) {
        console.error(error);
        return handleError(res, 500, Msg.internalServerError);
    }
};

// export const getAllRanchesConroller = async (req, res) => {
//     // try {
//         const ranches = await getAllRanches();

//         if (ranches.length > 0) {
//             ranches?.map((item) => {
//                 item.images = JSON.parse(item.images);
//             })
//         }
//         return handleSuccess(res, 200, Msg.RANCH_FETCHED_SUCCESSFULLY, ranches);
//     // } catch (error) {
//     //     console.error(error);
//     //     return handleError(res, 500, Msg.internalServerError);
//     // }
// };

export const getAllRanchesConroller = async (req, res) => {
    const ranches = await getAllRanches();

    if (ranches.length > 0) {
        ranches.map((item) => {
            // Only parse if it's still a string
            if (typeof item.images === "string") {
                try {
                    item.images = JSON.parse(item.images);
                } catch (e) {
                    console.warn("Invalid JSON format for images:", item.images);
                    item.images = [];
                }
            }
        });
    }

    return handleSuccess(res, 200, Msg.RANCH_FETCHED_SUCCESSFULLY, ranches);
};

export const getRanchesByIdConroller = async (req, res) => {
    try {
        const { id } = req.params;
        const ranches = await getRanchesById(id);

        const ranchesWithDocs = await Promise.all(
            ranches.map(async (item) => {
                item.ranchesDocuments = await fetchRanchesDocumentsModel(item.id);
                return item;
            })
        );
        return handleSuccess(res, 200, Msg.RANCH_FETCHED_SUCCESSFULLY, ranchesWithDocs[0]);
    } catch (error) {
        console.error(error);
        return handleError(res, 500, Msg.internalServerError);
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
                item.images = fetchRanchesImages.length > 0 ? fetchRanchesImages : [];

                return item;
            }));
        } else {
            investorRanches = [];
        }
        investorStats[0].investorRanches = investorRanches
        investorStats[0].current_value = investorRanches[0].price_per_share
        investorStats[0].price_per_share = investorRanches[0].price_per_share
        return handleSuccess(res, 200, Msg.INVESTOR_DASHBOARD_DATA_FETCHED, investorStats[0]);
    } catch (error) {
        console.error(error);
        return handleError(res, 500, Msg.internalServerError);
    }
};

// ---------------------------------------------------ranches purchases--------------------------------------------------//


export const myInvestment = async (req, res) => {
    try {
        let { id } = req.user
        // let investerId = fetchInvesterIds[0].id;
        let investerId = id;
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
                item.current_value = item.price_per_share;
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
        // let investerId = fetchInvesterIds[0].id
        console.log('req.user.id', req.user.id);

        let fetchInvesterIds = await fetchInvesterByThereIds(req.user.id)
        let investerId = req.user.id
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
        // let fetchChatDetails = await fetchChatIdThroughRanchesIdAndInvestor(rows[0].ranch_id, investerId)
        // let unredChats = await fetchUnreadRanchesChatCountById(fetchChatDetails[0].id)
        // let rowss = await fetchInvestedRanchesByRanchesId(rows[0].ranch_id, investerId);

        let fetchChatDetails = await fetchChatIdThroughRanchesIdAndInvestor(rows[0].ranch_id, investerId)
        let unredChats;
        if (fetchChatDetails.length === 0) {
            unredChats = 0
        } else {
            unredChats = await fetchUnreadRanchesChatCountById(fetchChatDetails[0].id,investerId)
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

export const ranchesPurchaseHistory = async (req, res) => {
    try {
        let { id } = req.user;

        let rows = await modelRanchesPurchaseHistory(id);
        if (!rows || rows.length === 0) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "No purchase history found",
                data: {},
            });
        }
        return handleSuccess(res, 200, "Purchase history retrieved successfully", rows[0]);
    } catch (error) {
        return handleError(res, 500, Msg.internalServerError);
    }
};


// ------------------------new flow of ranches reserve------------------------------------------//

export const ranches_purchases = async (req, res) => {
    try {
        const { id } = req.user;
        const { ranchId, shares, amountPerShare, amount } = req.body;

        const fetchInvestor = await fetchInvesterApplicationFormModel(id);
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
        await updateTotalShares(remaining, ranchId);

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
        return handleError(res, 500, error);
    }
};

export const fetchAllPendingRanches = async (req, res) => {
    try {
        let { id } = req.user
        let fetchInvesterIds = id;
        if (!fetchInvesterIds || fetchInvesterIds.length === 0) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Investor not found",
                data: [],
            });
        }
        let investerId = fetchInvesterIds;
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

export const fetchInvestorAllNotification = async (req, res) => {
    try {
        let { id } = req.user;
        let checkUser = await fetchAllInvestorNotificationModel(id);

        if (checkUser.length == 0) {
            return handleError(res, 400, 'notification not found for this investor', []);
        }

        return handleSuccess(res, 200, Msg.userDetailedFoundSuccessfully, checkUser);
    } catch (error) {
        console.error(error);
        return handleError(res, 500, Msg.internalServerError);
    }
};

// ------------------------ranches booking dates availability---------------------------------------------------//

export const fetchRanchesBookingDatesAvailability = async (req, res) => {
    try {
        let investor_id = req.user.id;
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
        let investor_id = req.user.id;
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
        let { ranch_id, status } = req.query;
        let investor_id = req.user.id;
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

// ----------------------------------fetch all documnets by investor id---------------------------------------//

export const fetchInvestorAllDocs = async (req, res) => {
    try {
        function formatFileType(str) {
            if (!str) return str;
            str = str.replace(/_/g, " ");
            str = str.replace(/([a-z])([A-Z])/g, "$1 $2");
            str = str.replace(/\b\w/g, (c) => c.toUpperCase());
            return str;
        }
        let investor_id = req.user.id;
        let { ranch_id } = req.query;
        let investorDetails = await fetchUsersIdsByInvestorId(investor_id);
        let user_id = investorDetails[0].user_id
        let rows = await fetchInvesterApplicationFormModelByUserId(user_id);
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