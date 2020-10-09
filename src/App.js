import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InfoBox from './component/InfoBox';
import Map from './component/Map';
import Table from './component/Table';
import { sortData } from './utils';
import './App.css';

function App() {
    // allcountry : https://disease.sh/v3/covid-19/countries
    // worldwide : https://disease.sh/v3/covid-19/all
    // country : https://disease.sh/v3/covid-19/countries/[country_code]
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(['worldwide']);
    const [countryInfo, setCountryInfo] = useState({}); 
    const [tableData, setTableData] = useState([]);

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
                    <InfoBox title='Coronavirus Cases' total={countryInfo.cases} cases={countryInfo.todayCases} />
                    <InfoBox title='Recoverd' total={countryInfo.recovered} cases={countryInfo.todayRecovered} />
                    <InfoBox title='Deaths' total={countryInfo.deaths} cases={countryInfo.todayDeaths} />
                </div>

                <Map />
            </div>
                
            <div className="app__right">
                <Card>
                    <CardContent>
                      <h3>Live Cases By Country</h3>
                      <Table countries={tableData} />
                      <h3>Worldwide new Cases</h3>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default App;
