import { useEffect, useState } from 'react';

export function useCurrentDateTime() {
  const getDateTime = () => {
    const now = new Date();

    return {
      date: now.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
  };

  const [dateTime, setDateTime] = useState(getDateTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return dateTime;
}