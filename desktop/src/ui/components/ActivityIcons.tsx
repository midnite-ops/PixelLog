import { Eye, Share, X, Zap } from "lucide-react";

export const activityIcon = {
  save: (
    <div className="bg-connected/20 text-connected rounded-lg p-1 px-2">
      <Eye className=" w-4" />
    </div>
  ),
  share: (
    <div className="bg-active/20 text-active rounded-lg p-1 px-2">
      <Share className=" w-4" />
    </div>
  ),
  error: (
    <div className="bg-red-500/20 text-red-100 rounded-lg p-1 px-2">
      <X className=" w-4" />
    </div>
  ),
  startUp: (
    <div className="bg-[#fbbf24]/20 text-[#fbbf24] rounded-lg p-1 px-2">
      <Zap className=" w-4" />
    </div>
  ),
};
