import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.js";



dotenv.config();
const app = express();

// Middleware.
 app.use(cors());
 app.use(express.json());



// MongoDB connection.
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//  Routes
app.use("/api/auth", authRoutes);
app.get('/', (req,res) => {
  res.send('API is running...')
});

// Start the server.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));