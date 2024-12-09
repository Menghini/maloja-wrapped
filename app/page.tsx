'use client';
import { Button, TextField } from '@mui/material';
import { LineChart, Line } from 'recharts';
import { useState } from 'react';
import { Typography } from '@mui/material';
  
export default function Home() {
  const [apiLink, setApiLink] = useState('');
  const [data, setData] = useState([]);
  const monthlyPlays = Array.from({ length: 12 }, (_, month) => {
    const plays = data.filter((item: { time: number }) => {
      const date = new Date(item.time * 1000);
      return date.getFullYear() === 2024 && date.getMonth() === month;
    }).length;
    return {
      month: new Date(2024, month).toLocaleString('default', { month: 'long' }),
      plays,
    };
  });

  const handleButtonClick = () => {
    console.log(apiLink);
    fetch(`/api/scrobbles?in=year`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const trackList = data.list.map((item: { track: string }) => item);
        console.log(trackList);
        setData(trackList);
      })
      .catch(error => console.error('Error fetching data:', error));
      console.log(monthlyPlays);
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Typography variant="h6" component="p">
        Welcome to Maloja Wrapped! You have listened to {data.length} songs in 2024.
      </Typography>
      <Typography variant="h6" component="p">
      January - {monthlyPlays[0].plays} plays
      
      </Typography>
      <Typography variant="h6" component="p">
      February - plays
      </Typography>
      <LineChart width={400} height={400} data={monthlyPlays}>
        <Line type="monotone" dataKey="plays" stroke="#8884d8" />
      </LineChart>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/*This TextField does nothing right now. The URL right now is set in next.config.ts*/}
        <TextField
          id="outlined-basic"
          label="API Link"
          variant="outlined"
          value={apiLink}
          onChange={(e) => setApiLink(e.target.value)}
        />
        <Button variant="text" onClick={handleButtonClick}>Update</Button>
      </div>
    </div>
  );
}
