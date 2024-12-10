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

  const hours = [
    '12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'
  ];

  const days = [
    'Saturday', 'Friday', 'Thursday',
    'Wednesday', 'Tuesday', 'Monday', 'Sunday'
  ];

  const heatmapData = data.reduce((acc: number[][], item: { time: number }) => {
    const date = new Date(item.time * 1000);
    const day = date.getDay();
    const hour = date.getHours();
    const existing = acc.find(d => d[0] === day && d[1] === hour);
    if (existing) {
      existing[2]++;
    } else {
      acc.push([day, hour, 1]);
    }
    return acc;
  }, []).map(item => [item[1], item[0], item[2] || '-']);

  const heatmapOption = {
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%'
    },
    series: [
      {
        name: 'Punch Card',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const calendarHeatmapData = data.reduce((acc: { [key: string]: number }, item: { time: number }) => {
    const date = new Date(item.time * 1000);
    const dateString = date.toISOString().split('T')[0];
    acc[dateString] = (acc[dateString] || 0) + 1;
    return acc;
  }, {});

  const calendarHeatmapOption = {
    tooltip: {
      position: 'top'
    },
    visualMap: {
      min: 0,
      max: 200,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 'top'
    },
    calendar: {
      range: '2024',
      cellSize: ['auto', 20]
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: Object.entries(calendarHeatmapData).map(([date, count]) => [date, count])
      }
    ]
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
      <Typography variant="h6" component="p">
        Heat Map Of Listening Times By Day and Hour of Week
      </Typography>
      <ReactECharts option={heatmapOption} style={{height: '500px'}}/>
      <Typography variant="h6" component="p">
        Heat Map Of Listening Times By Day of Month
      </Typography>
      <ReactECharts option={calendarHeatmapOption} style={{height: '500px'}}/>
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