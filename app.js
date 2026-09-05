require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/User.routes'); 
const authRoutes = require('./routes/Auth.routes');
const roleRoutes = require('./routes/Role.routes');
const donorRoutes = require('./routes/Donor.routes');
const receiverRoutes = require('./routes/Receiver.routes');
const donationRoutes = require('./routes/Donation.routes');
const donationRequestRoutes = require('./routes/DonationRequest.routes');

const { testConnection } = require('./databases/mysql');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routing Endpoint Base API
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/donors", donorRoutes);
app.use("/receivers", receiverRoutes);
app.use("/donations", donationRoutes);
app.use("/donation-requests", donationRequestRoutes);

const PORT = process.env.API_PORT || 8000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await testConnection();
});