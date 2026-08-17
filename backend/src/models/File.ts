import { model, Schema } from "mongoose";
import EventSchema from "./Events";

const FileSchema = new Schema({
//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

  fileName: {
    type: String,
    required: true,
  },

  filePath: {
    type: String,
  },
  event: [EventSchema],
});

export default model('File', FileSchema)
