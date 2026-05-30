const express = require('express');
const cors = require('cors');
const githubRoutes = require('./routes/github');
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const githubPrRoutes = require('./routes/githubPr');
const history = require('./routes/history');
const guardrailRoutes = require('./routes/guardrails');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', history);
app.use('/api/github-pr', githubPrRoutes);
app.use('/api/guardrail', guardrailRoutes);

app.get('/', (req, res) => {
  res.send('Devflow AI server is running!');
});

app.listen(PORT, ()=> {
  console.log(`Server is sprinting on port ${PORT}`);
});

