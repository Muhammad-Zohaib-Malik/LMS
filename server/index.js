import express from 'express'
const app = express();


// Middleware to parse JSON bodies
app.use(express.json());
const port = process.env.PORT || 3000;
// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the server!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
