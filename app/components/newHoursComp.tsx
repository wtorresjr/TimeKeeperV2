import React, { useEffect, useState } from "react";

const NewHoursComp = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalHours, setTotalHours] = useState(0);

  const calculateHours = () => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

    // If end time is earlier than start time, assume it's the next day
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    setTotalHours(diff);
  };

  useEffect(() => {
    calculateHours();
  }, [startTime, endTime]);

  return (
    <div className="addHoursContainer">
      <h1>{`Adding Hours For $`}</h1>
      <div className="borderLine"></div>
      <form className="addHoursForm" onSubmit={(e) => e.preventDefault()}>
        <div className="inputGroup">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" className="inputItem" />
        </div>
        <div className="inputGroup">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            className="inputItem"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            className="inputItem"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="hours">Total Hours</label>
          <input
            type="number"
            id="hours"
            className="inputItem"
            value={totalHours.toFixed(2)}
            readOnly
          />
        </div>
        <button className="btn yellBtn">Add Hours</button>
      </form>
    </div>
  );
};

export default NewHoursComp;
