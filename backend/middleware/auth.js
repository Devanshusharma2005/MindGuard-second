const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = function(req, res, next) {
  // Allow access if userId is provided in query params (mainly for profile lookup)
  if (req.path === '/profile' && req.query.userId) {
    return next();
  }
  
  // Get token from header (check both x-auth-token and Authorization headers)
  let token = req.header('x-auth-token');
  
  // If token is not found in x-auth-token header, try Authorization header
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (authHeader) {
      // In case Authorization header is sent directly without 'Bearer' prefix
      token = authHeader;
    }
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload to request
    // Handle both token formats (old: {user: {id}} and new: {id, username})
    if (decoded.user && decoded.user.id) {
      req.user = decoded.user;
    } else if (decoded.id) {
      req.user = { id: decoded.id };
      if (decoded.username) {
        req.user.username = decoded.username;
      }
    } else {
      throw new Error('Invalid token format');
    }
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

function storeDataInJson(input, output, filePath = 'data.json') {
    try {
        // Read existing data
        let data = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            data = JSON.parse(fileData);
        }

        // Append new input and output
        console.log('Input data:', input);
        console.log('Output data:', output);
        data.push({ input, output });

        // Write updated data back to the file
        console.log(`Writing data to ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log(`Data successfully written to ${filePath}`);
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
    }
} 