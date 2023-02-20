const User = require('../models/User');
const Jobs = require('../models/Jobs');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

//get all users
//@ route Get /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();

  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' });
  }
  res.json(users);
});

//@desc Create new user
//@route Get /users
//@ access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  //Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  //Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  //hash the password entered by user
  const hashedPass = await bcrypt.hash(password, 10);

  const newUserObj = { username, password: hashedPass, roles };

  //Create the user and store in the db

  const user = await User.create(newUserObj);

  if (user) {
    //if the user was created
    res.status(201).json({ message: `New user ${username} was created` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

//@desc Update a user
//@route Patch /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res.status(400).json('All fields are required');
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  //Check for duplicate
  const dupe = await User.findOne({ username }).lean().exec();

  //Allow updates to the Original User ONLY
  if (dupe && dupe?.id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    //hashing the new password
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();

  res.json({ message: `${updateUser.username} was updated` });
});

//@desc delete a user
//@route Delete /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User id required' });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const userToBeDeleted = await user.deleteOne();

  const userDeletedMessage = `Username ${userToBeDeleted.username} with ID ${userToBeDeleted._id} has been deleted`;

  res.json(userDeletedMessage);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
