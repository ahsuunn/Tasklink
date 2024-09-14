import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ITask, IStep } from "../../lib/types/Task";
import useFetch from "../../lib/CustomHooks/useFetch";
import "./CalendarPage.css";

interface ICalendarEvent {
  date: Date;
  title: string;
  description: string;
  color?: string;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [currentDate, _setCurrentDate] = useState(new Date());

  
  const {
    response: tasks,
    error,
    loading,
  } = useFetch<ITask[]>({
    url: "/task/mine", // Fetch tasks assigned to the user
  });

  useEffect(() => {
    if (tasks) {
      const eventsData: ICalendarEvent[] = [];
      tasks.forEach((task) => {
        task.steps.forEach((step: IStep) => {
          if (step.deadlinedate) {
            eventsData.push({
              date: new Date(step.deadlinedate),
              title: step.steptitle,
              description: step.stepdescription,
              color: task.color,
            });
          }
        });
      });

      setEvents(eventsData);
    }
  }, [tasks]);

  // Function to tile content with events
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayEvents = events.filter(
        (event) => event.date.toDateString() === date.toDateString(),
      );
      return (
        <div className="event-container">
          {dayEvents.map((event, index) => (
            <span
              key={index}
              className="event-badge"
              style={{ backgroundColor: event.color }}
            >
              {event.title}
            </span>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-10 mt-10">
      <div className="calendar-page">
        <h1 className="calendar-title">Calendar</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error loading tasks.</p>}
        <Calendar
          value={currentDate}
          tileContent={tileContent}
          className="custom-calendar"
          nextLabel=">"
          prevLabel="<"
          navigationLabel={({ date }) => (
            <span className="nav-label">
              {date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
