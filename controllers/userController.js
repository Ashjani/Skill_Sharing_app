const User = require('../models/user');
const bcrypt = require('bcryptjs');
const tokenUtils = require('../utils/generateToken'); // <-- Import the new function

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
// helper to set the cookie and decide response type
function sendAuthSuccess(res, user, redirectTo = '/dashboard') {
  const token = tokenUtils.generateToken(user._id);

  // Set httpOnly cookie (1 week)
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // If this is a browser form submission, redirect to dashboard.
  // If it’s a fetch/AJAX client, return JSON.
  const wantsHTML = res.req.headers.accept?.includes('text/html');
  if (wantsHTML) return res.redirect(redirectTo);

  return res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  });
}


// const registerUser = async (req, res) => {
//   try {
//     // 1. Get firstName, lastName, email, and password from the request body
//     const { firstName, lastName, email, password } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User with this email already exists' });
//     }

//     // 2. Create a username by combining the first and last name
//     const username = `${firstName} ${lastName}`;

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // 3. Save the combined username to the database
//     const user = new User({
//       username, // Use the combined username
//       email,
//       password: hashedPassword,
//     });
//     await user.save();

//     // If user was created successfully, generate a token
//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         token: tokenUtils.generateToken(user._id), // Generate and send token
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User with this email already exists' });

    const username = `${firstName} ${lastName}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashedPassword });

    return sendAuthSuccess(res, user);  // <-- sets cookie & redirects/JSON
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     // Check if user exists AND if passwords match
//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.json({
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         token: tokenUtils.generateToken(user._id), //Generate and send token
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' }); // Use 401 for unauthorized
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return sendAuthSuccess(res, user);  // <-- sets cookie & redirects/JSON
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};