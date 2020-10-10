import React from 'react';
import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';

export const sortData = (data) => {
    const sortedData = [...data];

    return sortedData.sort((a,b) => a.cases > b.cases ? -1 : 1)

}

const casesTypeColor = {
    "cases" : {
        hex: "#CC1034",
        multiplier: 800,
    },
    "recovered" : {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    "deaths" : {
        hex: "#2b484f",
        multiplier: 2000,
    },
};

export const showDataOnMap = (data, casesType) => {
    return data.map(country => (
        <Circle center={[country.countryInfo.lat, country.countryInfo.long]} 
        fillOpacity={0.4} fillColor={casesTypeColor[casesType].hex} color={casesTypeColor[casesType].hex} 
        radius={country[casesType] === 0 ? 0 : Math.sqrt(country[casesType])*casesTypeColor[casesType].multiplier/1.5} >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}} />
                    <div className="info-name">{country.country}</div>
                    <div className="info-cases">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recoverd: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ));
}

export const preetyPrintStat = (stat) => (
    stat ? `+${numeral(stat).format("0.0a")}` : 0
)