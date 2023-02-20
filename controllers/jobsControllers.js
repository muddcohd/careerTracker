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
    return res.status(400).json({ message: 'No jobs were found' });
  }

  const userWithJobs = await Promise.all(
    jobs.map(async (job) => {
      const user = await User.findById(job.user).lean().exec();
      return { ...job, username: user.username };
    })
  );
  res.json(userWithJobs);
});

//@desc create new job
//@route Post users
//@access private
const createNewJob = asyncHandler(async (res, req) => {
  const { user, title, company, replied } = req.body;

  //confirm data of job
  if (!user || !title || !company || typeof replied !== 'boolean') {
    return res.status(409).json({ message: 'All fields are required' });
  }
  //create job entry
  const newJob = await Jobs.create({ user, title, company, replied });

  if (job) {
    return res.status(201).json({ message: `New job created for ${user}` });
  } else {
    return res.status(400).json({ message: 'Invalid job data received' });
  }
});

//@desc update job
//route Patch /jobs
//@access Private
const updateJob = asyncHandler(async (res, req) => {
  const { user, title, company, replied } = req.body;

  if (!user || !title || !company || typeof replied !== 'boolean') {
    return res.status(409).json({ message: 'All fields are required' });
  }

  //Confirm that job to update has been already added
  const jobHasBeenAdded = await Jobs.findById(id).exec();

  if (!jobHasBeenAdded) {
    return res.send(400).json({ message: 'Job does not exist' });
  }

  jobHasBeenAdded.user = user;
  jobHasBeenAdded.title = title;
  jobHasBeenAdded.company = company;
  jobHasBeenAdded.replied = replied;

  const updateJob = await jobHasBeenAdded.save();

  res.json(`${updateJob} has been updated`);
});

//@desc Delete a job
//route Delete /jobs
//@access private

const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.body;

  //confirm that id exists
  if (!id) {
    return res.status(400).json({ message: ' Job id is required' });
  }

  const jobToDelete = await Jobs.findById(id).exec();

  if (!jobToDelete) {
    return res.send(400).json({ message: 'No job found' });
  }

  const deleteThisJob = await jobToDelete.deleteOne();
  const message = `Job ${deleteThisJob.title} at ${deleteThisJob.company} has been deleted`;

  res.json(message);
});

module.exports = {
  getAllJobs,
  createNewJob,
  updateJob,
  deleteJob,
};
