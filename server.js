const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config()
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection setup
mongoose.connect(process.env.moongose, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Routes
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports=app;