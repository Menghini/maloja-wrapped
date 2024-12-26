'use client'
import React from 'react';
import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Link, Typography } from '@mui/material';
import { getMonthlyOption } from './monthlyPlays';
import { getHourlyOption } from './hourlyPlays';
import { getHeatMapOption } from './heatMapData';
import { getCalendarHeatMapOption } from './calendarHeatMapData';
import { MalojaURL } from '@/malojaWrapped.config';



export default function Home() {
  const [apiLink] = useState('');
  const [data, setData] = useState([]);
  const monthlyOption = getMonthlyOption(data);
  const hourlyOption = getHourlyOption(data);
  const heatMapOption = getHeatMapOption(data);
  const calendarHeatMapOption = getCalendarHeatMapOption(data);
  

  React.useEffect(() => {
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
  }, [apiLink]);
  
  return (
    <div>
      <Typography variant="h6" component="p">
        Welcome to Maloja Wrapped! Showing data for <Link href={MalojaURL}>{MalojaURL}</Link> You have listened to {data.length} songs in 2024.
      </Typography>
      <Typography variant="h6" component="p">
        Play Count by Month
      </Typography>
      <ReactECharts option={monthlyOption} style={{height: '500px'}}/>
      <Typography variant="h6" component="p">
        Play Count by Hour of Day
      </Typography>
      <ReactECharts option={hourlyOption} style={{height: '500px'}}/>
      <Typography variant="h6" component="p">
        Heat Map Of Listening Times By Day and Hour of Week
      </Typography>
      <ReactECharts option={heatMapOption} style={{height: '500px'}}/>
      <Typography variant="h6" component="p">
        Heat Map Of Listening Times By Day of Month
      </Typography>
      <ReactECharts option={calendarHeatMapOption} style={{height: '500px'}}/>
    </div>
  );
  
}