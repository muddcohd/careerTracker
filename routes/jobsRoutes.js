const express = require('express');
const router = express.Router();
const jobsControllers = require('../controllers/jobsControllers');

router
  .route('/')
  .get(jobsControllers.getAllJobs)
  .post(jobsControllers.createNewJob)
  .patch(jobsControllers.updateJob)
  .delete(jobsControllers.deleteJob);

module.exports = router;
