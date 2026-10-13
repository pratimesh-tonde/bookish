const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      return res.status(401).json({
        message: user
          ? "This account uses Google Sign-In. Please continue with Google."
          : "Invalid email or password",
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// POST /api/auth/google  { credential }
// `credential` is the ID token handed to us by Google's Sign In button on the frontend.
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({ name, email, googleId, authProvider: "google" });
    } else if (!user.googleId) {
      // an existing account is signing in with Google for the first time — link it
      user.googleId = googleId;
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ message: "Google sign-in failed", error: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (address) user.address = { ...user.address.toObject(), ...address };

    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Could not update profile", error: err.message });
  }
};

// POST /api/auth/wishlist/:bookId - toggle a book in/out of the wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = req.user;
    const index = user.wishlist.findIndex((id) => id.toString() === bookId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(bookId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Could not update wishlist", error: err.message });
  }
};

// GET /api/auth/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await req.user.populate("wishlist");
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch wishlist", error: err.message });
  }
};