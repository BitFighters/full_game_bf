import React from 'react';
import { useState, useEffect } from 'react';

function CompetitionTime() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTime = () => {
    // const timestring = new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
    // const deadline = new Date(timestring);
    const deadline = new Date('2023-09-29T23:59:00+05:30');

    // const deadline = new Date(2023,8,18,0,30,0);
    const time = deadline.getTime() - (new Date()).getTime();
    // setDays(Math.floor(time / (1000 * 60 * 60 * 24)));

    setHours(Math.floor((time / (1000 * 60 * 60))));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));

    // setHours(0);
    // setMinutes(0);
    // setSeconds(0);
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1 *1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer" style={{
      display: 'flex',
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    }}>
      <div> 
        <div className="cooper-black-tab">
          Game Ends In: {` ${hours} : ${minutes} : ${seconds} `}
          {/* Game Ends On: Friday (Sep 29nd) */}
        </div> 
      </div>
    </div>
  );
}

export default CompetitionTime;