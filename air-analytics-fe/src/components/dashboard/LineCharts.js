import { Box, useMediaQuery, useTheme } from "@mui/material"
import { useCallback } from "react";
import ReactApexChart from "react-apexcharts"

export default function LineCharts(props) {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const dataChart = {
        series: [
            {
                name: props.seriesName,
                data: props.seriesData,
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    // borderRadius: 10,
                    dataLabels: {
                        position: 'top', // top, center, bottom
                    },
                    columnWidth: props.widthColumn,
                    // endingShape: 'rounded'
                }
            },
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            toolbar: {
                show: false
            },
            colors: ['#FF9900', '#545454'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: props.titleText,
                align: 'center'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: props.xaxisCategories,
                // axisBorder: {
                //     show: false
                // },
                // axisTicks: {
                //     show: false
                // },
                // crosshairs: {
                //     fill: {
                //         type: 'gradient',
                //         gradient: {
                //             colorFrom: '#D8E3F0',
                //             colorTo: '#BED1E6',
                //             stops: [0, 100],
                //             opacityFrom: 0.4,
                //             opacityTo: 0.5,
                //         }
                //     }
                // },
                tooltip: {
                    enabled: true,
                }
            },
            yaxis: {
                title: {
                    text: props.yaxisTitle
                },
                labels: {
                    formatter: function (val) {
                        return val.toFixed(0);
                    }
                },
                min: props.minYaxis,
                max: props.maxYaxis
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        },
    }

    return (
        <Box>
            <ReactApexChart options={dataChart.options} series={dataChart.series} type="bar" height={350} />
        </Box>
    )
}