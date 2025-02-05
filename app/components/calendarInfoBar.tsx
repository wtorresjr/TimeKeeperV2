import { NewHoursCompProps } from "./newHoursComp";

export const CalendarInfoBar = ({ chosenClient }: NewHoursCompProps) => {
  const totalHours: number = parseFloat(
    chosenClient.hours.reduce((acc, hour) => acc + hour.hours, 0).toFixed(2)
  );

  return (
    <div className="addHoursContainer">
      <div className="borderLine"></div>
      <div className="flex flex-row w-full justify-between text-2xl">
        <h1>{`Adding Hours For ${chosenClient.client_name}`}</h1>
        <h1>{`Total Hours: ${totalHours}`}</h1>
      </div>
      <div className="flex w-full flex-row gap-4">
        <label>Days Worked:</label>
        {chosenClient.hours &&
          chosenClient.hours.map((day) => (
            <div className="text-orange-500">{day.date.split("T")[0]}</div>
          ))}
      </div>
      <div className="flex w-full justify-between">
        <div>{`Hourly Rate: $${chosenClient.hourly_rate}`}</div>
        <div>{`Total Earned: $${(chosenClient.hourly_rate * totalHours).toFixed(
          2
        )}`}</div>
      </div>
      <div className="borderLine"></div>
    </div>
  );
};
