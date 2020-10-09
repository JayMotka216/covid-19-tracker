import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InfoBox from './component/InfoBox';
import Map from './component/Map';
import Table from './component/Table';
import LineGraph from './component/LineGraph';
import { sortData, preetyPrintStat } from './utils';
import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
    // allcountry : https://disease.sh/v3/covid-19/countries
    // worldwide : https://disease.sh/v3/covid-19/all
    // country : https://disease.sh/v3/covid-19/countries/[country_code]
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(['worldwide']);
    const [countryInfo, setCountryInfo] = useState({}); 
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 26.3351, lng:17.2283});
    const [mapZoom, setMapZoom] = useState(2);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState('cases');

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
        .then(response => response.json())
        .then((data) => {
            setCountryInfo(data);
        })
    }, []);

    useEffect( () => {
          const getCountryData = async () => {
              await fetch('https://disease.sh/v3/covid-19/countries')
              .then((response) => response.json())
              .then((data) => {
                    const countries = data.map( (country) => (
                        {
                            name: country.country,
                            value: country.countryInfo.iso2
                        }
                    ));

                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setCountries(countries);
                    setMapCountries(data);
              })
          }

        getCountryData();
    }, [] );
    
    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        setCountry(countryCode);

        const url = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        await fetch(url)
        .then(response => response.json())
        .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);
            console.log(data.countryInfo)
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);
        })
    }

    return (
        <div className="app">
            <div className="app__left">
                <div className="app_header">
                    <h1>Covid - 19 Tracker</h1>
                    
                    <FormControl className="app__dropdown">
                        <Select variant="outlined" value={country} onChange={onCountryChange}>
                            <MenuItem value="worldwide" >WorldWide</MenuItem>
                            {
                              countries.map((country) => {
                                return <MenuItem value={country.value} >{country.name}</MenuItem>
                              })
                            }
                        </Select>
                    </FormControl>
                </div>

                <div className="app__status">
                    <InfoBox title='Cases' onClick={(e) => setCasesType('cases')} active={casesType === 'cases'} type="1"
                        total={preetyPrintStat(countryInfo.cases)} cases={preetyPrintStat(countryInfo.todayCases)} />
                    <InfoBox title='Recoverd' onClick={(e) => setCasesType('recovered')} active={casesType === 'recovered'} type="2"
                        total={preetyPrintStat(countryInfo.recovered)} cases={preetyPrintStat(countryInfo.todayRecovered)} />
                    <InfoBox title='Deaths' onClick={(e) => setCasesType('deaths')} active={casesType === 'deaths'} type="3"
                        total={preetyPrintStat(countryInfo.deaths)} cases={preetyPrintStat(countryInfo.todayDeaths)} />
                </div>

                <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
            </div>
                
            <div className="app__right">
                <Card>
                    <CardContent>
                      <h3>Live Cases By Country</h3><hr/>
                      <Table countries={tableData} />
                      <div>
                        <h3 className="app__h">Worldwide new Cases</h3><hr/>
                        <LineGraph className="app__graph" casesType={casesType} />
                      </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default App;
