require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/User.routes'); 
const authRoutes = require('./routes/Auth.routes');

const app = express()

// User Test
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/auth", authRoutes);


app.listen(process.env.API_PORT, () => {
    console.log(`Server running on port ${process.env.API_PORT}`)
})