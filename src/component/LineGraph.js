import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callback: {
            lable: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}    

const buildCharData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;

    for( let date in data[casesType]) {
        if(lastDataPoint) {
            const newDataPoint = {
                x : date,
                y : data[casesType][date] - lastDataPoint
            };
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
}

const casesTypeColor = {
    "cases" : {
        hex: "#CC1034",
        rgba: "rgba(204,16,52,0.5)"
    },
    "recovered" : {
        hex: "#7dd71d",
        rgba: "rgba(125,215,29,0.5)"
    },
    "deaths" : {
        hex: "#2b484f",
        rgba: "rgba(43, 72, 79,0.5)"
    },
};

function LineGraph({ casesType, ...props }) {
    // last 120 days data : https://disease.sh/v3/covid-19/historical/all?lastdays=120
    const [data, setData] = useState({});
    
    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then((data) => {
                const chartData = buildCharData(data, casesType);
                setData(chartData);
            })
        }

        fetchData();
    }, [casesType]);
    
    return(
        <div className={props.className}>
            {data?.length > 0 && (
                <Line options={options} data={{
                    datasets:[{
                        data: data,
                        backgroundColor: casesTypeColor[casesType].rgba,
                        borderColor: casesTypeColor[casesType].hex,
                        },],
                    }} />
            )}
        </div>
    );
}

export default LineGraph