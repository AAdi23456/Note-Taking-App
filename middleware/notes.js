// Middleware for Data Validation
const validateNote = (req, res, next) => {
    const { title, content } = req.body;
  
    // Validate title and content
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
  
    
    next();
  };
  
  // Middleware for Error Handling
  const handleErrors = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
      // Validation error
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ errors });
    } else if (err.name === 'CastError') {
      // Invalid ID format
      return res.status(400).json({ message: 'Invalid ID format' });
    } else {

      console.error(err.stack);
      res.status(500).send('Something went wrong!');
    }
  };
  module.exports={validateNote,handleErrors}