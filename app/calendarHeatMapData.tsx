// calendarHeatmapData.tsx
export const getCalendarHeatMapOption = (data: any[]) => {
    const calendarHeatMapData = data.reduce((acc: { [key: string]: number }, item: { time: number }) => {
        const date = new Date(item.time * 1000);
        const dateString = date.toISOString().split('T')[0];
        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
    }, {});

    return {
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
                data: Object.entries(calendarHeatMapData).map(([date, count]) => [date, count])
            }
        ]
    };
};