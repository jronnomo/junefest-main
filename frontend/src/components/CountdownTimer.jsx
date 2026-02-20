import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (expired) {
    return (
      <div className='jf-countdown'>
        <h2 className='jf-end-msg'>LET&apos;S GOOO!! 🌺</h2>
      </div>
    );
  }

  return (
    <div className='jf-countdown'>
      {timeLeft.days !== undefined && (
        <>
          <h2>{timeLeft.days}d</h2>
          <h2>{timeLeft.hours}h</h2>
          <h2>{timeLeft.mins}m</h2>
          <h2>{timeLeft.secs}s</h2>
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
