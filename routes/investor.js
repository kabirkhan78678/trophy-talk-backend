import express from 'express';
import controller from '../controllers/index.js';
import { upload } from '../middleware/upload.js'
import { authenticateInvestor } from '../middleware/userAuth.js';
import { uploadFile } from '../services/uploadImage.js';
import { investorLogin } from '../controllers/investor_controller.js';
import {
  investorLoginVallidations,
  handleValidationErrors
} from '../vallidation/investorVallidation.js';

const app = express();


app.post('/login', investorLoginVallidations, handleValidationErrors, controller.investorController.investorLogin);
app.get("/profile", authenticateInvestor, controller.investorController.getInvestorProfile);
app.get("/ranches", authenticateInvestor, controller.investorController.getAllRanchesConroller);
app.get("/ranches/:id", authenticateInvestor, controller.investorController.getRanchesByIdConroller);


app.get('/investor_dashboard', authenticateInvestor, controller.investorController.investorDashboardData);
app.post('/ranches-purchases', authenticateInvestor, controller.investorController.ranches_purchases);
app.get("/myInvestment", authenticateInvestor, controller.investorController.myInvestment);
app.get("/viewMyInvestementById", authenticateInvestor, controller.investorController.viewMyInvestementById);
app.get("/ranchesPurchaseHistory", authenticateInvestor, controller.investorController.ranchesPurchaseHistory);

app.post('/investerForgotPassword', controller.sellerController.forgotPassword);
app.get('/verifyPassword/:token', controller.sellerController.verifyPassword);
app.post('/changeForgotPassword', controller.sellerController.changeForgotPassword);

app.post("/invester-contact-supports", authenticateInvestor, controller.investorController.invester_create_contact_support);
app.get('/fetchAllPendingRanches', authenticateInvestor, controller.investorController.fetchAllPendingRanches);
app.get("/escrowPaymentDetails", authenticateInvestor, controller.investorController.escrowPaymentDetails);
app.get('/fetchInvestorAllNotification', authenticateInvestor, controller.investorController.fetchInvestorAllNotification);


// ----------------------------------ranches booking managment system------------------------------------------------------//

app.get('/fetchRanchesBookingDatesAvailability', authenticateInvestor, controller.investorController.fetchRanchesBookingDatesAvailability);
app.post('/bookingRanchesBooking', authenticateInvestor, controller.investorController.bookingRanchesBooking);
app.get('/fetchRanchesBooking', authenticateInvestor, controller.investorController.fetchRanchesBooking);

// ----------------------------------fetch all documnets by investor id---------------------------------------//
app.get('/fetchInvestorAllDocs', authenticateInvestor, controller.investorController.fetchInvestorAllDocs);


export default app;