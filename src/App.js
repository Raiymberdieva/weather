import React, {useState, useEffect, useRef} from 'react'
import * as THREE from 'three'
import Net from 'vanta/dist/vanta.clouds.min'
import axios from "axios";
import './style.css'
import CurrentDay from "./components/CurrentDay/CurrentDay"
import FiveDays from './components/FiveDays/FiveDays';

function App() {
    const [weather, setWeather] = useState({});
    const [weatherFive,setWeatherFive] =useState({});
    const [city, setCity] = useState('');
    const [temp,setTemp] = useState('C');
    const [five,setFive] = useState(false);
    const [day,setDay] = useState(1);

    const [vantaEffect, setVantaEffect] = useState(0)
    const myRef = useRef(null)
    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(Net({
                el:myRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x45b5e8,
                sunlightColor: 0xeb9648,
                speed: 1.60
            }))
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect]);

    const getWeather = () => {
        axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c3ca235f299a5ac03a9b15b27ae3fee0`)
            .then(({data}) =>setWeather(data) );

    };


    const getWeatherForFiveDay = () => {
        axios(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c3ca235f299a5ac03a9b15b27ae3fee0`)
            .then(({data}) => {
                console.log(data)
                setWeatherFive(data)
            });
        setFive(true)
    };

    const toDate = (date) =>{
       return new Intl.DateTimeFormat('ru-RU',{
           day:'2-digit',
           month:'long',
           year:'numeric',
           hour:'2-digit',
           minute:'2-digit',
           second:'2-digit'
       }).format(new Date(date))
    };

    let days = JSON.stringify(weatherFive) === '{}' ? '': weatherFive.list.map((item)=> item.dt_txt.slice(0,10));


    return (
        <>
           <div className='vanta'  ref={myRef}>
           </div>
            <main className='main' >
                {
                    !five
                        ? <CurrentDay setDay={setDay} setCity={setCity} getWeather={getWeather} weather={weather} temp={temp} setTemp={setTemp} toDate={toDate} getWeatherForFiveDay={getWeatherForFiveDay}/>
                        : <FiveDays setFive={setFive} day={day} setDay={setDay} weatherFive={weatherFive} days={days} weather={weather} temp={temp} setTemp={setTemp}/>
                }
            </main>
        </>

    );
}

export default App;
