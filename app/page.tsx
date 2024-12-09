'use client';
import { Button, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { useState } from 'react';
import { Typography } from '@mui/material';
  
export default function Home() {
  const [apiLink, setApiLink] = useState('');
  const [data, setData] = useState([]);
  const monthlyPlays = Array.from({ length: 12 }, (_, month) => {
    const filteredData = data.filter((item: { time: number }) => {
      const date = new Date(item.time * 1000);
      return date.getFullYear() === 2024 && date.getMonth() === month;
    });

    const originCounts = filteredData.reduce((acc: { [key: string]: number }, item: { origin: string }) => {
      acc[item.origin] = (acc[item.origin] || 0) + 1;
      return acc;
    }, {});

    const totalPlays = Object.values(originCounts).reduce((acc, count) => acc + count, 0);

    return {
      month: new Date(2024, month).toLocaleString('default', { month: 'long' }),
      total: filteredData.length,
      totalPlays,
      ...originCounts,
    };
  });
  const hourlyPlays = Array.from({ length: 24 }, (_, hour) => {
    const filteredData = data.filter((item: { time: number }) => {
      const date = new Date(item.time * 1000);
      return date.getFullYear() === 2024 && date.getHours() === hour;
    });

    const originCounts = filteredData.reduce((acc: { [key: string]: number }, item: { origin: string }) => {
      acc[item.origin] = (acc[item.origin] || 0) + 1;
      return acc;
    }, {});

    const totalPlays = Object.values(originCounts).reduce((acc, count) => acc + count, 0);

    return {
      hour: `${hour}:00`,
      total: filteredData.length,
      totalPlays,
      ...originCounts,
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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px' }}>
        <Typography variant="h6" component="p">
          Play Count by Month
        </Typography>

        <ResponsiveContainer width="48%" height={300}>
          <LineChart
          data={monthlyPlays}
          margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
          >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month">
          <Label value="Months" offset={-2} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Play Count" angle={-90} offset={0} position="insideLeft" />
        </YAxis>
        <Tooltip />
        <Legend />
        {Object.keys(monthlyPlays.reduce((acc, cur) => ({ ...acc, ...cur }), {})).filter(key => key !== 'month' && key !== 'total').map((key, index) => (
          <Line key={index} type="monotone" dataKey={key} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
        ))}
          </LineChart>
        </ResponsiveContainer>

        <Typography variant="h6" component="p">
          Play Count by Hour of Day
        </Typography>
        <ResponsiveContainer width="48%" height={300}>
          <LineChart
        data={hourlyPlays}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
          >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour">
          <Label value="Hour of Day" offset={-2} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Play Count" angle={-90} offset={0} position="insideLeft" />
        </YAxis>
        <Tooltip />
        <Legend />
        {Object.keys(monthlyPlays.reduce((acc, cur) => ({ ...acc, ...cur }), {})).filter(key => key !== 'month' && key !== 'total').map((key, index) => (
          <Line key={index} type="monotone" dataKey={key} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
        ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

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
