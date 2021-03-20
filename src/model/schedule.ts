import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  id: String,
  subject: String,
  teacher: String,
  type: String,
  classroom: String,
  time: {
    start: String,
    end: String,
  },
});

const dayScheduleSchema = new mongoose.Schema({
  day: String,
  date: String,
  classes: [classSchema],
});

const weekScheduleSchema = new mongoose.Schema({
  week: Number,
  days: [dayScheduleSchema],
});

const scheduleSchema = new mongoose.Schema({
  group: String,
  schedule: [weekScheduleSchema],
});

export default mongoose.model('Schedule', scheduleSchema);
