import { DateTime } from "luxon"

const API_KEY = "fc7b0ee8508bca3ffb03743fc0cd082f"
const BASE_URL = "https://api.openweathermap.org/data/2.5"

type MainDataType = {
   feels_like: number,
   grnd_level: number,
   humidity: number,
   pressure: number,
   sea_level: number,
   temp: number,
   temp_max: number,
   temp_min: number,
}
type SysDataType = {
   country: string,
   id: number,
   sunrise: number,
   sunset: number,
   type: 1
}
type WeatherDataType = {
   description: string,
   icon: string,
   id: number,
   main: string
}

type CurrentDataType = {
   base: string,
   clouds: {
      all?: number
   },
   cod: number,
   coord: {
      lon: number,
      lat: number
   },
   dt: number,
   id: number,
   main: MainDataType,
   name: string,
   sys: SysDataType,
   timezone: number,
   visibility: number,
   weather: WeatherDataType[],
   wind: { speed: number, deg: number, gust: number }
}

type DailyForecastType = {
   clouds: number,
   dew_point: number,
   dt: number,
   feels_like: { day: number, night: number, eve: number, morn: number },
   humidity: number,
   moon_phase: number,
   moonrise: number,
   moonset: number,
   pop: number,
   pressure: number,
   sunrise: number,
   sunset: number,
   temp: { day: number, min: number, max: number, night: number, eve: number, morn: number },
   uvi: number,
   weather: WeatherDataType[],
   wind_deg: number,
   wind_gust: number,
   wind_speed: number

}

type HourlyForecastType = {
   clouds: number,
   dew_point: number,
   dt: number,
   feels_like: number,
   humidity: number,
   pop: number,
   pressure: number,
   temp: number,
   uvi: number,
   visibility: number,
   weather: WeatherDataType[],
   wind_deg: number,
   wind_gust: number,
   wind_speed: number
}
type MinutelyForecastType = {
   dt: number,
   precipitation: number
}

type ForecastDataType = {
   daily: DailyForecastType[],
   hourly: HourlyForecastType[],
   lat: number,
   lon: number,
   minutely: MinutelyForecastType[],
   timezone: string,
   timezone_offset: number

}

type SearchParamsForWeatherType = {
   q?: string,
   id?: string,
   mode?: string,
   units?: string,
   lang?: string,
}
type SearchParamsForForecastType = {
   lat: number,
   lon: number,
   exclude: string,
   units: string
}




const getWeatherData = (infoType: string = "weather", searchParams: SearchParamsForWeatherType | SearchParamsForForecastType) => {

   const url = new URL(BASE_URL + '/' + infoType)
   url.search = new URLSearchParams({ ...searchParams, appid: API_KEY }) + ''

   const res = fetch(url).then(res => res.json()).then(data => data)

   return res
}

const formatCurrentWeather = (data: CurrentDataType) => {
   const {
      coord: { lat, lon },
      main: { temp, feels_like, temp_min, temp_max, humidity },
      name,
      dt,
      sys: { country, sunrise, sunset },
      weather,
      wind: { speed }
   } = data

   const { main: details, icon } = weather[0]

   return { lat, lon, name, dt, temp, feels_like, temp_min, temp_max, humidity, country, sunrise, sunset, speed, details, icon }
}

const formatForecastWeather = (data: ForecastDataType) => {

   let { timezone, daily, hourly } = data
   const newdaily = daily.slice(1, 6).map(d => {
      return {
         title: formatToLocalTime(d.dt, timezone, "ccc"),
         temp: d.temp.day,
         icon: d.weather[0].icon
      }
   })

   const newhourly = hourly.slice(1, 6).map(d => {
      return {
         title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
         temp: d.temp,
         icon: d.weather[0].icon
      }
   })
   return { timezone, daily: newdaily, hourly: newhourly }
}

const getFormattedWeatherData = async (searchParams: SearchParamsForForecastType | SearchParamsForWeatherType) => {

   const formattedCurrentWeather = await getWeatherData("weather", searchParams)
      .then(formatCurrentWeather)

   const { lat, lon } = formattedCurrentWeather

   const formattedForecastWeather = await getWeatherData("onecall",
      {
         lat,
         lon,
         exclude: "current, minutely, alerts",
         units: searchParams.units
      }).then(formatForecastWeather)

   return { ...formattedCurrentWeather, ...formattedForecastWeather }

}

const formatToLocalTime = (secs: number, zone: string, format = "cccc, dd LLL yyyy' | Local time 'hh:mm a ") => {
   return DateTime.fromSeconds(secs).setZone(zone).toFormat(format)
}

const iconUrlFromCode = (code: string) => `http://openweathermap.org/img/wn/${code}@2x.png`

export { formatToLocalTime, iconUrlFromCode }

export default getFormattedWeatherData