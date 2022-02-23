import React from 'react'
import cities from '../../lib/city.list.json'
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
    console.log(data)

    const slug = context.params.city;
    return {
        props :{
            slug
        }
    }
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
function city({slug}) {
  return (
    <div>
        <h1>{slug}</h1>
    </div>
  )
}

export default city