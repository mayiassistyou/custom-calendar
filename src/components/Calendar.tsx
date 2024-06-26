import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { MdImportantDevices } from "react-icons/md";
import { CiCalendar, CiClock2, CiLocationOn } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { DAYS, STORAGE_KEY } from "../contants";
import {
  convertJsonToObjEvent,
  datesAreOnSameDay,
  filterFromTimeOptions,
  filterToTimeOptions,
  getIncommingEvents,
  getMonthYear,
  getSortedDaysInMonth,
  nextMonth,
  prevMonth,
  sortEventsByDate,
  timeOptions,
} from "../utils";
import Modal from "./Modal";
import { Event } from "../types";
import EventCard from "./EventCard";
import { toast } from "react-toastify";

type EventInputs = {
  title: string;
  from: string;
  to: string;
  priority: "low" | "medium" | "high";
  location: string;
};

const eventsString = localStorage.getItem(STORAGE_KEY.EVENTS) || [];
const EVENTS =
  typeof eventsString === "string"
    ? convertJsonToObjEvent(JSON.parse(eventsString))
    : [];

function Calendar(): JSX.Element {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [events, setEvents] = useState<Event[]>(sortEventsByDate(EVENTS));
  const [isShowAddEventModal, setIsShowAddEventModal] =
    useState<boolean>(false);
  const [isShowEventDetailModal, setIsShowEventDetailModal] =
    useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<Event>();
  const [fromTimeOptions, setFromTimeOptions] = useState<string[]>(timeOptions);
  const [toTimeOptions, setToTimeOptions] = useState<string[]>(timeOptions);

  const daysInMonth = getSortedDaysInMonth(currentDate);
  const incommingEvents = getIncommingEvents(events);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInputs>();

  function onDateClick(day: number | undefined) {
    if (!day) return;

    addEvent(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  function addEvent(date: Date) {
    setCurrentDate(date);
    setIsShowAddEventModal(true);
  }

  function handleAddEvent(data: EventInputs) {
    const newEvents = [
      ...events,
      {
        title: data.title,
        date: currentDate,
        startTime: data.from,
        endTime: data.to,
        priority: data.priority,
        location: data?.location,
      },
    ];

    setEvents(newEvents);
    localStorage.setItem(STORAGE_KEY.EVENTS, JSON.stringify(newEvents));

    setIsShowAddEventModal(false);
    toast.success("Add event successfully!!!");
  }

  function handleEventClick(event: Event) {
    setCurrentEvent(event);
    setIsShowEventDetailModal(true);
  }

  return (
    <>
      <div className="w-full max-w-5xl bg-white px-4 py-8 md:px-8">
        {/* calendar control on mobile */}
        <div className="flex justify-center gap-4 md:hidden">
          <button onClick={() => prevMonth(currentDate, setCurrentDate)}>
            <FaChevronLeft />
          </button>
          <div>{getMonthYear(currentDate, "short")}</div>
          <button onClick={() => nextMonth(currentDate, setCurrentDate)}>
            <FaChevronRight />
          </button>
        </div>

        {/* calendar control on large device */}
        <div className="hidden items-center gap-8 md:flex">
          <button
            className="border-dark-blue text-dark-blue hover:bg-dark-blue rounded-xl border px-4 py-2 transition hover:text-white"
            onClick={() => setCurrentDate(today)}
          >
            Today
          </button>
          <button
            className="text-dark-blue"
            onClick={() => prevMonth(currentDate, setCurrentDate)}
          >
            <FaChevronLeft />
          </button>
          <button
            className="text-dark-blue"
            onClick={() => nextMonth(currentDate, setCurrentDate)}
          >
            <FaChevronRight />
          </button>
          <div className="text-dark-blue text-xl font-semibold">
            {getMonthYear(currentDate, "long")}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-7">
          {DAYS.map((day, index) => (
            <div
              key={index}
              className="grid-item text-center font-medium text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="md:border-1/2 mt-2 grid grid-cols-7 border-gray-300">
          {daysInMonth.map((day, index) => {
            let numOfEvents = 0;

            return (
              <div
                key={index}
                onClick={() => onDateClick(day)}
                className={`md:border-1/2 aspect-square border-gray-300 py-2 ${!day ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex justify-center">
                  <span
                    className={`${
                      datesAreOnSameDay(
                        today,
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day,
                        ),
                      )
                        ? "bg-dark-blue text-white"
                        : "text-gray-500"
                    } flex h-8 w-8 items-center justify-center rounded-full text-lg`}
                  >
                    {day}
                  </span>
                </div>
                <div className="mx-1 hidden md:block">
                  {events.map((evt, index) => {
                    const isSameDay = datesAreOnSameDay(
                      evt.date,
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day,
                      ),
                    );

                    if (isSameDay) numOfEvents++;

                    if (isSameDay && numOfEvents < 3)
                      return (
                        <EventCard
                          key={index}
                          event={evt}
                          onEventClick={handleEventClick}
                        />
                      );
                  })}
                </div>
                {numOfEvents > 2 && (
                  <div className="text-dark-blue mx-1 mt-1 hidden text-xs md:block">
                    {numOfEvents - 2} more
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:hidden">
          <h2 className="text-dark-blue mb-4 block text-xl font-bold">
            Upcomming Events
          </h2>
          {incommingEvents.length === 0 ? (
            <h3 className="text-lg font-semibold">No events</h3>
          ) : (
            incommingEvents.map((evt, index) => (
              <EventCard
                key={index}
                event={evt}
                onEventClick={handleEventClick}
              />
            ))
          )}
        </div>
      </div>

      {/* modal add event */}
      <Modal
        isOpen={isShowAddEventModal}
        onClose={() => setIsShowAddEventModal(false)}
      >
        <form onSubmit={handleSubmit(handleAddEvent)}>
          <input
            type="text"
            className="border-t-none border-l-none border-r-none focus:border-light-blue mb-4 border-b-2 text-xl font-medium outline-none md:min-w-80"
            placeholder="Add title *"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <p className="-mt-4 text-sm text-red-500">This field is required</p>
          )}

          <div className="mb-4 flex items-center gap-2">
            <CiClock2 />
            <span className="mr-4">
              {currentDate.toLocaleString("default", {
                weekday: "long",
                month: "long",
                year: "numeric",
                day: "2-digit",
              })}
            </span>

            <select
              {...register("from", {
                required: true,
                onChange: (e) => {
                  setToTimeOptions(filterToTimeOptions(e.target.value));
                },
              })}
            >
              {fromTimeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              {...register("to", {
                required: true,
                onChange: (e) => {
                  setFromTimeOptions(filterFromTimeOptions(e.target.value));
                },
              })}
            >
              {toTimeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            className="border-t-none border-l-none border-r-none focus:border-light-blue mb-4 w-full border-b-2 outline-none md:min-w-80"
            placeholder="Location"
            {...register("location")}
          />

          <div className="mb-6 flex items-center gap-2 outline-none">
            <MdImportantDevices />
            <span>Priority: </span>
            <select {...register("priority", { required: true })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex w-full justify-end">
            <button
              className="bg-light-blue rounded px-4 py-2 text-white"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* modal show event detail */}
      <Modal
        isOpen={isShowEventDetailModal}
        onClose={() => setIsShowEventDetailModal(false)}
      >
        <div className="min-w-80 max-w-md">
          <div className="font-xl text-dark-blue mb-4 font-bold leading-tight">
            {currentEvent?.title}
          </div>
          <div className="flex items-center gap-2">
            <CiClock2 /> {currentEvent?.startTime} - {currentEvent?.endTime}
          </div>
          <div className="flex items-center gap-2">
            <CiCalendar />{" "}
            {currentEvent?.date.toLocaleString("default", {
              weekday: "long",
              month: "long",
              year: "numeric",
              day: "2-digit",
            })}
          </div>
          {currentEvent?.location && (
            <div className="flex items-center gap-2">
              <CiLocationOn /> {currentEvent?.location}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default Calendar;
