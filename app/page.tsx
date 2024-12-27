'use client'
import React from 'react';
import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Link, SelectChangeEvent, Typography } from '@mui/material';
import { getMonthlyOption } from './monthlyPlays';
import { getHourlyOption } from './hourlyPlays';
import { getHeatMapOption } from './heatMapData';
import { getCalendarHeatMapOption } from './calendarHeatMapData';
import { MalojaURL } from '@/malojaWrapped.config';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

export default function Home() {
  const [apiLink, setApiLink] = useState('');
  const [data, setData] = useState([]);
  const monthlyOption = getMonthlyOption(data);
  const hourlyOption = getHourlyOption(data);
  const heatMapOption = getHeatMapOption(data);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2013 + 1 }, (_, i) => 2013 + i);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString()); // Add state for selected year
  const calendarHeatMapOption = getCalendarHeatMapOption(data, selectedYear);

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    const year = event.target.value as string;
    setSelectedYear(year); // Update selected year state
    setApiLink(year === 'alltime' ? '/api/scrobbles?in=alltime' : `/api/scrobbles?in=${year}`);
  };
  

  React.useEffect(() => {
    console.log(apiLink);
    fetch(`/api/scrobbles?in=${selectedYear}`)
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
        Welcome to Maloja Wrapped! Showing data for <Link href={MalojaURL}>{MalojaURL}</Link> You have listened to {data.length} songs in {selectedYear}.
      </Typography>
    

      <div>
        <FormControl>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear === 'alltime' ? currentYear.toString() : selectedYear} // Set value to selectedYear state or current year
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
          {year}
              </MenuItem>
            ))}
            <MenuItem value="alltime">All</MenuItem>
          </Select>
        </FormControl>
    </div>
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