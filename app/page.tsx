'use client'
import React from 'react';
import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Button, TextField, Typography } from '@mui/material';

export default function Home() {
  const [apiLink, setApiLink] = useState('');
  const [data, setData] = useState([]);
  type MonthlyPlay = {
    month: string;
    total: number;
    totalPlays: number;
    [key: string]: number | string;
  };

  const monthlyPlays: MonthlyPlay[] = Array.from({ length: 12 }, (_, month) => {
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
  const monthlyOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthlyPlays.map((item) => item.month),
    },
    legend: {
      data: Object.keys(monthlyPlays[0] || {}).filter(key => key !== 'month' && key !== 'total' && key !== 'totalPlays')
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    yAxis: {
      type: 'value',
    },
    series: Object.keys(monthlyPlays[0] || {}).map(origin => ({
      name: origin,
      type: 'line',
      stack: 'Total',
      data: monthlyPlays.map((item) => item[origin] || 0),
    })),
  };
  type HourlyPlay = {
    hour: string;
    total: number;
    totalPlays: number;
    [key: string]: number | string;
  };

  const hourlyPlays: HourlyPlay[] = Array.from({ length: 24 }, (_, hour) => {
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
  const hourlyOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: hourlyPlays.map((item) => item.hour),
    },
    legend: {
      data: Object.keys(hourlyPlays[0] || {}).filter(key => key !== 'hour' && key !== 'total' && key !== 'totalPlays')
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    yAxis: {
      type: 'value',
    },
    series: Object.keys(hourlyPlays[0] || {}).filter(key => key !== 'hour' && key !== 'total' && key !== 'totalPlays').map(origin => ({
      name: origin,
      type: 'line',
      stack: 'Total',
      data: hourlyPlays.map((item) => item[origin] || 0),
    })),
  };

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
    <div>
      <Typography variant="h6" component="p">
        Welcome to Maloja Wrapped! You have listened to {data.length} songs in 2024.
      </Typography>
      <Typography variant="h6" component="p">
          Play Count by Month
      </Typography>
      <ReactECharts option={monthlyOption} style={{height: '500px'}}/>
      <Typography variant="h6" component="p">
          Play Count by Hour of Day
      </Typography>
      <ReactECharts option={hourlyOption} style={{height: '500px'}}/>
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