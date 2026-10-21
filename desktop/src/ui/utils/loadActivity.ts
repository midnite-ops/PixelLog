import type { Activity, ActivityType } from "../../../types";
const STORAGE_KEY = "pixelLogActivity";

export function saveActivity(
  event: ActivityType,
  file: string,
  eventId: string
) {
  const activities = getActivity();

  const alreadyExists = activities.some(
    (activity) => activity.id === eventId
  );

  if (alreadyExists) return;

  activities.unshift({
    id: eventId,
    event,
    file,
    time: new Date().toISOString(),
  });

  localStorage.setItem(
    "pixelLogActivity",
    JSON.stringify(activities)
  );
}

export function getActivity(): Activity[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}


