import React from 'react';

import { Cards, Chart, CountryPicker, Alert } from './components';
import { playSound } from './components/Alert/playSound';
import { fetchDailyData, fetchData } from './api';
import style from './App.module.scss'

import coronaImg from './assets/image.png';

class App extends React.Component {
  state = {
    data: {},
    dailyData: [],
    country: ''
  };

  async componentDidMount() {
    const time = 1000 * 60 * 5;

    const data = await fetchData();
    const dailyData = await fetchDailyData();

    let tempData = data;

    this.setState({ data, dailyData });

    const yesterday = {
      confirmed: dailyData[dailyData.length - 1].confirmed,
      deaths: dailyData[dailyData.length - 1].deaths
    };
    const today = {
      confirmed: data.confirmed.value,
      deaths: data.deaths.value
    };
    this.calculateDeath(today, yesterday);

    setTimeout(() => {
      playSound();
    }, 3000);

    const polling = setInterval(async () => {
      console.warn('Requesting ...');

      const data = await fetchData(this.country);
      const dailyData = await fetchDailyData();

      const { confirmed, deaths } = data;

      if (tempData.confirmed.value !== confirmed.value || tempData.deaths.value !== deaths.value) {
        tempData = data;
        this.setState({ data, dailyData });
        playSound();
        console.warn('Data updated!');
      } else {
        console.warn('Not new data. Nothing update');
      }
    }, time);
  }

  handleCountryChange = async country => {
    const data = await fetchData(country);
    const dailyData = await fetchDailyData();
    this.setState({ data, dailyData, country });
  };

  calculateDeath = (today, yesterday) => {
    const { deaths: deathsX, confirmed: confirmedX } = today;
    const { deaths: deathsY, confirmed: confirmedY } = yesterday;

    const deathsDiff = deathsX - deathsY;
    const confirmedDiff = confirmedX - confirmedY;

    console.log(deathsDiff, confirmedDiff);

    let randomTime = Math.floor(Math.random() * 100000) / 2;

    const interval = setInterval(() => {
      clearInterval(interval);
      this.setState((prevState) => {
        return {
          ...prevState,
          data: {
            ...prevState.data,
            deaths: {
              ...prevState.data.deaths,
              value: prevState.data.deaths.value + Math.floor(Math.random() * 10)
            },
            confirmed: {
              ...prevState.data.confirmed,
              value: prevState.data.confirmed.value + Math.floor(Math.random() * 10)
            }
          }
        }
      });
      this.calculateDeath(today, yesterday);
      playSound();
    }, randomTime)
  };

  render() {
    const { data, country, dailyData } = this.state;

    return (
      <div className={style.container}>
        <img className={style.image} src={coronaImg} alt="covid-19 coronavirus" />
        <Cards data={data} />
        <CountryPicker handleCountryChange={this.handleCountryChange} />
        <Chart
          data={data}
          country={country}
          dailyData={dailyData}
        />
        <Alert />
      </div>
    );
  }
}

export default App;
