// monthlyPlays.tsx
type MonthlyPlay = {
    month: string;
    total: number;
    totalPlays: number;
    [key: string]: number | string;
  };
  
export const getMonthlyOption = (data: any[]) => {
  const monthlyPlays: MonthlyPlay[] = Array.from({ length: 12 }, (_, month) => {
    const filteredData = data.filter((item: { time: number }) => {
      const date = new Date(item.time * 1000);
      return date.getFullYear() === 2024 && date.getMonth() === month;
    });

    const originCounts = filteredData.reduce((acc: { [key: string]: number }, item: { origin: string }) => {
      acc[item.origin] = (acc[item.origin] || 0) + 1;
      return acc;
    }, {});

    const totalPlays = Object.values(originCounts).reduce((acc: number, count: number) => acc + count, 0);

    return {
      month: new Date(2024, month).toLocaleString('default', { month: 'long' }),
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
};