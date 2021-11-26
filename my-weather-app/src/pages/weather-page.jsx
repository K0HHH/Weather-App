import Header from '../components/header/header.jsx'
import Grid from '@mui/material/Grid';
import './style.css'
import SearchBar from '../components/seach-bar/search-bar.jsx';
import InteractiveSection from '../components/Interactive-section/interactive-section.jsx';
import CardWeather from '../components/cards/card-weather.jsx';
import CardPodcast from '../components/cards/card-podcast.jsx';
import React from 'react';
import WeeklyWeatherSection from '../components/weekly-weather-section/weekly-weather-section.jsx';
import HourlyWeatherSection from '../components/hourly-weather-section/hourly-weather-section.jsx';
import { useContext, useEffect, useState } from 'react';
import { tempContext } from '../components/context/context.js'



export default function WeatherPage() {

    let input = ''
    const temp = useContext(tempContext)
    const [newTempUnit, updateTemp] = useState(temp);
    let [currentPositionWeather, setCurrentPositionWeather] = useState({})
    let [searchedCity, setSearchedCity] = useState({})

    const key = 'd845504f20477381a8993b61bddc5b2e';

    useEffect(() => {
        if (navigator.geolocation && searchedCity.name === undefined) { //Si la localización está activada y no hay ciudad buscada entonces busca por geolocalización
            getUserCurrentPosition()
        }
        else if (searchedCity !== undefined) {    //Si hay una ciudad buscada entonces trae los datos de esa ciudad
            getWeatherInfoByCity(searchedCity.name)
        }
        else {
            console.log('error')
        }
    }, [newTempUnit, searchedCity.city])


    function getUserCurrentPosition() { //Trae la locacalización actual del usuario
        navigator.geolocation.getCurrentPosition(function (position) {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${newTempUnit}&appid=${key}`)
                .then(response => response.json())
                .then(data => { setCurrentPositionWeather({ ...data }); setSearchedCity({})/* tras traer los datos del usuario resetea la ciudad buscada a vacío */; console.log(data) })
        })
    }

    function getWeatherInfoByCity(city) {//Trae el tiempo actual de la ciudad buscada
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key)
            .then(resp => resp.json())
            .then(data => {
                setSearchedCity(data);
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${newTempUnit}&appid=${key}`)
                    .then(responseWeather => responseWeather.json())
                    .then(r => { setCurrentPositionWeather({ ...r }); console.log(r) })
            })
    }


    function search(input) {
        getWeatherInfoByCity(input)
    }

    // const onTempChange = () => {
    //     if (newTempUnit === 'metric') {
    //         console.log(newTempUnit)
    //         updateTemp('imperial')
    //     }
    //     else {
    //         console.log(newTempUnit)
    //         updateTemp('metric')
    //     }
    // }




    return (
        <tempContext.Provider value={newTempUnit}>
            <Grid container>
                <Grid item xs={12}>
                    <Header></Header>
                </Grid>
                <Grid item xs={12}>
                    <SearchBar onSearch={search}></SearchBar>
                    {/* <div style={{height:'100em'}}></div> */}
                </Grid>
                <Grid item xs={12}>
                    <InteractiveSection></InteractiveSection>
                </Grid>
                <Grid item xs={12}>
                    <WeeklyWeatherSection info={currentPositionWeather} />
                </Grid>
                <Grid item xs={12}>
                    <HourlyWeatherSection info={currentPositionWeather} />
                </Grid>
            </Grid >
        </tempContext.Provider>
    )
}