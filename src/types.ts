export type Event = {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  priority: "low" | "medium" | "high";
  location?: string;
};
