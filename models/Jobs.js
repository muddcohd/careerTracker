const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },

    replied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

module.exports = mongoose.model('Jobs', jobSchema);
