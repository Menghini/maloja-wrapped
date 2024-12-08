'use client';
import { Button, TextField } from '@mui/material';
import { LineChart, Line } from 'recharts';
import { useState } from 'react';
const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 300, pv: 4567, amt: 2400}, {name: 'Page C', uv: 200, pv: 1398, amt: 2400}, {name: 'Page D', uv: 278, pv: 3908, amt: 2400}, {name: 'Page E', uv: 189, pv: 4800, amt: 2400}, {name: 'Page F', uv: 239, pv: 3800, amt: 2400}, {name: 'Page G', uv: 349, pv: 4300, amt: 2400}];


  
export default function Home() {
  const [apiLink, setApiLink] = useState('');
  const handleButtonClick = () => {
    console.log(apiLink);
    fetch(`/api/scrobbles?in=today`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching data:', error));
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Welcome to Maloja Wrapped!
      
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
