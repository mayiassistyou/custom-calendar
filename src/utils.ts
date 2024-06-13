import { Event } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertJsonToObjEvent(jsonEvents: any[]) {
  return jsonEvents.map((json) => ({
    ...json,
    date: new Date(json.date),
  }));
}

export function range(end: number) {
  const { result } = Array.from({ length: end }).reduce(
    ({ result, current }) => ({
      result: [...result, current],
      current: current + 1,
    }),
    { result: [], current: 1 },
  );
  return result;
}

export function getMonthYear(date: Date, format: "long" | "short") {
  return date.toLocaleString("default", { month: format, year: "numeric" });
}

export const nextMonth = (date: Date, cb: (date: Date) => void) => {
  const mon = date.getMonth();
  if (mon < 11) {
    date.setMonth(mon + 1);
  } else {
    date.setMonth(0);
    date.setFullYear(date.getFullYear() + 1);
  }
  cb(new Date(date));
};

export const prevMonth = (date: Date, cb: (date: Date) => void) => {
  const mon = date.getMonth();
  if (mon > 0) {
    date.setMonth(mon - 1);
  } else {
    date.setMonth(11);
    date.setFullYear(date.getFullYear() - 1);
  }
  cb(new Date(date));
};

export function getNumberOfDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getSortedDaysInMonth(date: Date) {
  const daysInMonth = range(getNumberOfDaysInMonth(date));
  const beforeEmptyDays = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  ).getDay();
  const afterEmptyDays =
    (beforeEmptyDays - 1 + daysInMonth.length) % 7 === 0
      ? 0
      : 7 - ((beforeEmptyDays - 1 + daysInMonth.length) % 7);

  return [
    ...Array(beforeEmptyDays === 0 ? 6 : beforeEmptyDays - 1),
    ...daysInMonth,
    ...Array(afterEmptyDays),
  ];
}

export function datesAreOnSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function sortEventsByDate(events: Event[]) {
  return events.sort((a: Event, b: Event) => {
    return a.date.getTime() - b.date.getTime();
  });
}

export function getIncommingEvents(events: Event[]) {
  const today = new Date().setHours(0, 0, 0, 0);

  const sortedEvents = sortEventsByDate(events);
  const index = sortedEvents.findIndex((event) => {
    return event.date.getTime() - today > 0;
  });

  return sortedEvents.slice(index);
}

export function createTimeOptions() {
  let result: string[] = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j = j + 15) {
      result = [...result, `0${i}`.slice(-2) + ":" + `0${j}`.slice(-2)];
    }
  }

  return result;
}

export const timeOptions = createTimeOptions();

export function filterFromTimeOptions(toTime: string) {
  const index = timeOptions.findIndex((option) => option === toTime);
  return timeOptions.slice(0, index - timeOptions.length);
}

export function filterToTimeOptions(fromTime: string) {
  const index = timeOptions.findIndex((option) => option === fromTime);

  return timeOptions.slice(index + 1);
}
