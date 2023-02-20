const User = require('../models/User');
const Jobs = require('../models/Jobs');
const asyncHandler = require('express-async-handler');

//get all jobs
//@ route Get /users
//@access Private
const getAllJobs = asyncHandler(async (req, res) => {
  //get all the jobs for the user in mongodb
  const jobs = Jobs.find().lean();

  //check if no jobs
  if (!jobs?.length) {
    res.send(400).json({ message: 'No jobs were found' });
  }

  const userWithJobs = await Promise.all(
    jobs.map(async (job) => {
      const user = await User.findById(job.user).lean().exec();
      return { ...job, username: user.username };
    })
  );
  res.json(userWithJobs);
});
