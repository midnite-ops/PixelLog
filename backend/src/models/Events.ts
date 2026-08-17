import { Schema } from "mongoose";

const EventSchema = new Schema({
  type: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  history: {
    type: Object,
    default: {},
  },

  fileType: {
    type: String,
  },

  preview: {
    type: String,
  },
});

export default EventSchema
