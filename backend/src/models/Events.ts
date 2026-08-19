import { Schema } from "mongoose";

const EventSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
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

  previewPath: {
    type: String,
  },

  previewUrl:{
    type: String
  }
});

export default EventSchema;
