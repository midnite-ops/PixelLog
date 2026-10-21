import { activityIcon } from "../components/ActivityIcons";
import { getActivity } from "../utils/loadActivity";

function Activity() {
  const activity = getActivity();

  return (
    <section className="page-spacing no-scrollbar">
      <div className="bg-cardColor rounded-lg border border-disabledBorder  flex flex-col gap-3">
        {activity.map((act, index) => (
          <div
            className={`flex items-center gap-4 pt-3 px-3 pb-4 ${index === activity.length - 1 ? "" : "border-b border-disabledBorder"}`}
          >
            {act.event === 'Export' ? activityIcon.save : act.event === 'Upload Complete' ? activityIcon.share : act.event === 'Upload Failed' ? activityIcon.error : act.event === 'PixelLog Started' ? activityIcon.startUp : act.event === 'Print' ?  activityIcon.save : act.event === 'Save' ? activityIcon.save : ''}
            <div className="flex flex-col gap-1">
              <p className="text-sm">{act.event}</p>
              <p className="text-xs text-disabled font-mono">{act.file}</p>
            </div>
            <p className="text-xs text-disabled ml-auto">{act.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Activity;