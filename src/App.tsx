import { useEffect, useState } from 'react'
import './App.css'
import Forecast from './components/Forecast'
import Inputs from './components/Inputs'
import TemperatureAndDetails from './components/TemperatureAndDetails'
import TimeAndLocation from './components/TimeAndLocation'
import TopButtons from './components/TopButtons'
import getFormattedWeatherData from './services/weatherService'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [query, setQuery] = useState({ q: "Bishkek" })
  const [units, setUnits] = useState("metric")
  const [weather, setWeather] = useState<null | object>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      const message = query.q ? query.q : "current location"
      toast.info("Fetching weather for " + message)
      await getFormattedWeatherData({ ...query, units })
        .then(data => {
          toast.success("Success.")

          setWeather(data)
        })
        .catch((err) => {
          toast.error("Fetching failed... ")
        })
    }

    fetchWeather()
  }, [query, units])

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700"
    const threshold = units === "metric" ? 20 : 60
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700"
    return "from-yellow-700 to-orange-700"
  }

  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}>

      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TemperatureAndDetails weather={weather} />
          <Forecast title="hourly forecast" items={weather.hourly} />
          <Forecast title="daily forecast" items={weather.daily} />
        </>
      )}
      <ToastContainer autoClose={2000} theme='colored' newestOnTop />
    </div>
  )
}

export default App


// https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid=fc7b0ee8508bca3ffb03743fc0cd082f&units=metric&exclude=minutely