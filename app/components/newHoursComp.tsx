import React, { useEffect, useState } from "react";
import { useActionData, Form } from "@remix-run/react";
import type { Client, ActionData } from "../types/client";

interface Props {
  chosenClient: Client;
}

const NewHoursComp: React.FC<Props> = ({ chosenClient }) => {
  interface ActionData {
    error?: string;
  }

  const actionData = useActionData<ActionData>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalHours, setTotalHours] = useState(0);

  const calculateHours = () => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

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
      <Form method="post" className="addHoursForm">
        <input type="hidden" name="client_id" value={chosenClient.client_id} />
        <div className="inputGroup">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="inputItem"
            required
          />
        </div>
        <div className="inputGroupRow">
          <div className="timeDiv">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              className="inputItem"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="timeDiv">
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              className="inputItem"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
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
        {actionData?.error && (
          <p className="mt-2 text-center text-lg text-red-600">
            {actionData.error}
          </p>
        )}
        <button type="submit" className="btn yellBtn">
          Add
        </button>
      </Form>
    </div>
  );
};

export default NewHoursComp;
