import { Event } from "../types";

type Props = {
  event: Event;
  onEventClick: (even: Event) => void;
};

function EventCard(props: Props): JSX.Element {
  const { event, onEventClick } = props;
  const { title, date, startTime, endTime, priority } = event;

  const mainBgColor =
    priority === "high"
      ? "dark-orange"
      : priority === "medium"
        ? "light-orange"
        : "dark-blue";
  const subBgColor =
    priority === "high"
      ? "light-blue"
      : priority === "medium"
        ? "dark-blue"
        : "dark-orange";

  function handleEventClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    onEventClick(event);
  }

  return (
    <div onClick={handleEventClick}>
      <div className={`bg-${mainBgColor} mt-2 flex rounded-lg md:hidden`}>
        <div className={`bg-${subBgColor} w-2 rounded-l-lg`} />
        <div
          className={`${priority === "low" ? "text-white" : "text-dark-blue"} flex-1 px-4 py-2`}
        >
          <div className="font-lg mb-2 font-bold leading-tight">{title}</div>
          <div className="font-extralight">
            {startTime} - {endTime}
          </div>
          <div>
            {date.toLocaleString("default", {
              weekday: "long",
              month: "long",
              year: "numeric",
              day: "2-digit",
            })}
          </div>
        </div>
      </div>

      <div className={`bg-${mainBgColor} mt-1 hidden gap-1 rounded md:flex`}>
        <div className={`bg-${subBgColor} w-1 rounded-l`} />
        <div
          className={`${priority === "low" ? "text-white" : "text-dark-blue"} flex-1 overflow-hidden p-1`}
        >
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
