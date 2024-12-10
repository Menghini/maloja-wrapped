// hourlyPlays.tsx
export type HourlyPlay = {
    hour: string;
    total: number;
    totalPlays: number;
    [key: string]: number | string;
  };
  
export const getHourlyOption = (data: any[]) => {
    const hourlyPlays = Array.from({ length: 24 }, (_, hour) => {
        const filteredData = data.filter((item: { time: number }) => {
            const date = new Date(item.time * 1000);
            return date.getFullYear() === 2024 && date.getHours() === hour;
        });

        const originCounts = filteredData.reduce((acc: { [key: string]: number }, item: { origin: string }) => {
            acc[item.origin] = (acc[item.origin] || 0) + 1;
            return acc;
        }, {});

        const totalPlays = Object.values(originCounts).reduce((acc: number, count: number) => acc + count, 0);

        return {
            hour: `${hour}:00`,
            total: filteredData.length,
            totalPlays,
            ...originCounts,
        };
    });

    return {
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
};