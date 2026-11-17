import React, { useState, useEffect } from "react";

const Timer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const { isStart } = props;

  useEffect(() => {
    if (isStart) setSeconds(0);

    const intervalId = setInterval(() => {
      if (isStart) setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [isStart]); // Empty dependency array ensures effect runs only once on mount

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const remainingSeconds = time % 60;

    const formattedHours = hours > 0 ? `${hours}:` : "";
    const formattedMinutes = minutes > 0 ? `${minutes}:` : "0:";
    const formattedSeconds =
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    if (formattedMinutes !== "0:") {
      return formattedMinutes + formattedSeconds;
    } else if (formattedHours !== "") {
      return formattedHours + formattedMinutes + formattedSeconds;
    } else {
      return formattedSeconds;
    }
  };

  return (
    <div style={{ width: "250px", margin: "0 auto" }}>
      <p
        style={{
          textAlign: "center",
          fontSize: "30px",
          color: "#28a745",
          marginLeft: "-30px",
        }}
      >
        {formatTime(seconds)}
      </p>
    </div>
  );
};

export default Timer;
