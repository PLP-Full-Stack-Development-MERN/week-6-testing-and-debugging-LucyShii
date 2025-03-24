const validateBug = (req, res, next) => {
    const { title, description, reportedBy } = req.body;
    const errors = [];
  
    if (!title || title.trim() === '') {
      errors.push('Title is required');
    }
  
    if (!description || description.trim() === '') {
      errors.push('Description is required');
    }
  
    if (!reportedBy || reportedBy.trim() === '') {
      errors.push('Reporter name is required');
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    next();
  };
  
  module.exports = validateBug;