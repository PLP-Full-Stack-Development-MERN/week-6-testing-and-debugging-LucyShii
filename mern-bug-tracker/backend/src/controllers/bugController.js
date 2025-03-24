const Bug = require('../models/Bug');

// Get all bugs
exports.getAllBugs = async (req, res, next) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.status(200).json(bugs);
  } catch (error) {
    next(error);
  }
};

// Get a single bug
exports.getBugById = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    res.status(200).json(bug);
  } catch (error) {
    next(error);
  }
};

// Create a new bug
exports.createBug = async (req, res, next) => {
  try {
    const bug = await Bug.create(req.body);
    res.status(201).json(bug);
  } catch (error) {
    next(error);
  }
};

// Update a bug
exports.updateBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    res.status(200).json(bug);
  } catch (error) {
    next(error);
  }
};

// Delete a bug
exports.deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    res.status(200).json({ message: 'Bug deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Add an intentional bug
exports.updateBug = async (req, res, next) => {
    try {
      // Intentional bug: incorrect parameter name
      const bug = await Bug.findByIdAndUpdate(
        req.params.bugId, // Bug: Should be req.params.id
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!bug) {
        return res.status(404).json({ message: 'Bug not found' });
      }
      
      res.status(200).json(bug);
    } catch (error) {
      next(error);
    }
  };

//  Add debugging code
exports.updateBug = async (req, res, next) => {
    try {
      // Debugging step 1: Log parameters
      console.log('Request parameters:', req.params);
      console.log('Request body:', req.body);
      
      // Debugging step 2: Fix the parameter name
      const bug = await Bug.findByIdAndUpdate(
        req.params.id, // Fixed: Changed from req.params.bugId
        req.body,
        { new: true, runValidators: true }
      );
      
      // Debugging step 3: Log the result
      console.log('Result:', bug);
      
      if (!bug) {
        return res.status(404).json({ message: 'Bug not found' });
      }
      
      res.status(200).json(bug);
    } catch (error) {
      // Debugging step 4: Enhanced error logging
      console.error('Error updating bug:', error);
      next(error);
    }
  };