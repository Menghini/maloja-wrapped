// heatMapData.tsx
export const hours = [
    '12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'
];

export const days = [
'Saturday', 'Friday', 'Thursday',
'Wednesday', 'Tuesday', 'Monday', 'Sunday'
];

export const getHeatMapOption = (data: any[]) => {
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
    }, []).map((item: any[]) => [item[1], item[0], item[2] || '-']);

    const max = heatmapData.length > 0 ? Math.max(...heatmapData.map((item: any[]) => item[2])) : 0;
    
    return {
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
            max: max,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        series: [
            {
                name: 'Scrobbles',
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
};