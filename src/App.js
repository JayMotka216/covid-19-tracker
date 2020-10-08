import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InfoBox from './component/InfoBox';
import Map from './component/Map';
import './App.css';

function App() {
    // country : https://disease.sh/v3/covid-19/countries
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(['worldwide']);

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

                  setCountries(countries);
              })
          }

        getCountryData();
    }, [] );
    
    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        setCountry(countryCode);
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
                    <InfoBox title='Corona' total={2000} cases={200} />
                    <InfoBox title='Corona1' total={20001} cases={2001} />
                    <InfoBox title='Corona2' total={20004} cases={2002} />
                </div>

                <Map />
            </div>
                
            <div className="app__right">
                <Card>
                    <CardContent>
                      <h3>Live Cases By Country</h3>
                      <h3>Worldwide new Cases</h3>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default App;
