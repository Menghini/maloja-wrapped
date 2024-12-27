// calendarHeatmapData.tsx
export const getCalendarHeatMapOption = (data: any[], year: any) => {
    const calendarHeatMapData = data.reduce((acc: { [key: string]: number }, item: { time: number }) => {
        const date = new Date(item.time * 1000);
        const dateString = date.toISOString().split('T')[0];
        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
    }, {});

    const max = Object.values(calendarHeatMapData).length > 0 ? Math.max(...Object.values(calendarHeatMapData) as number[]) : 0;

    return {
        tooltip: {
            position: 'top'
        },
        visualMap: {
            min: 0,
            max: max,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: 'top'
        },
        calendar: {
            range: year,
            cellSize: ['auto', 20]
        },
        series: [
            {
                name: 'Scrobbles',
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: Object.entries(calendarHeatMapData).map(([date, count]) => [date, count])
            }
        ]
    };
};