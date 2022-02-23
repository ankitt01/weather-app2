import React from 'react'
import cities from '../../lib/city.list.json'
import Head from 'next/head';
import TodaysWeather from '../../components/TodaysWeather';


export async function getServerSideProps(context) {
    const  city = getCity(context.params.city)
    if(!city) {
        return {notFound: true,}
    }

    // Fetching data (one-call api)
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric&exclude=minutely`)
    const data = await res.json()
    if(!data) {
        return {
            notFound: true
        }
    }
    
    const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);

  const weeklyWeather = data.daily;

  return {
    props: {
      city: city,
      timezone: data.timezone,
      currentWeather: data.current,
      hourlyWeather: hourlyWeather,
      weeklyWeather: weeklyWeather,
    }, // will be passed to the page component as props
  };
}
const getCity = param => {
    const cityParam = param.trim();
    const splitCity = cityParam.split("-");
    const id = splitCity[splitCity.length-1];
    console.log(id)

    if(!id)
    return null

    const city = cities.find(city => city.id.toString() == id)
    if(city) {
        return city
    }else {
        return null
    }
}

//sorting and filtering the data
const getHourlyWeather = (hourlyData) => {
    const current = new Date();
    current.setHours(current.getHours(), 0, 0, 0);
    const tomorrow = new Date(current);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    //divide by 1000 to get timestamps in seconds

    const currentTimeStamp = Math.floor(current.getTime() / 1000);
  const tomorrowTimeStamp = Math.floor(tomorrow.getTime() / 1000);

  const todaysData = hourlyData.filter((data) => data.dt < tomorrowTimeStamp);

  return todaysData;

}

function city({hourlyWeather, currentWeather, weeklyWeather, city}) {
    console.log(weeklyWeather[0])
  return (
    <div>
        <Head>
            <title>{city.name} Weather App</title>
        </Head>

        <div className='page-wrapper'>
            <TodaysWeather city={city} weather={weeklyWeather[0]} />
        </div>

        
    </div>
  )
}

export default city