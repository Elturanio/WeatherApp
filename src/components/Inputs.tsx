import { UilSearch, UilLocationPoint } from '@iconscout/react-unicons';
import { useState } from "react"
import { toast } from 'react-toastify';

type PropTypes = {
   setQuery: any,
   setUnits: any,
   units: any
}

function Inputs({ setQuery, setUnits, units }: PropTypes) {

   const [inputValue, setInputValue] = useState("")
   const handleInput = (e) => {
      setInputValue(e.target.value)
   }
   const handleLocation = () => {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude
            let lon = position.coords.longitude
            setQuery({
               lat,
               lon
            })
         })
      }
   }
   const handleUnits = (e) => { if (e.currentTarget.name !== units) setUnits(e.currentTarget.name) }

   return (
      <div className='flex flex-row justify-center my-6'>
         <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
            <input
               value={inputValue}
               type="text"
               className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase"
               placeholder='Search for city...'
               onChange={handleInput}
            />
            <UilSearch onClick={() => setQuery({ q: inputValue })} size={25} className="text-white cursor-pointer transition ease-out hover:scale-125" />
            <UilLocationPoint onClick={handleLocation} size={25} className="text-white cursor-pointer transition ease-out hover:scale-125" />
         </div>
         <div className="flex flex-row w-1/4 items-center justify-center">
            <button name='metric' onClick={handleUnits} className="text-xl text-white font-light cursor-pointer transition ease-out hover:scale-125 hover:font-medium">°C</button>
            <p className='text-xl text-white mx-1'>|</p>
            <button name='imperial' onClick={handleUnits} className="text-xl text-white font-light cursor-pointer transition ease-out hover:scale-125 hover:font-medium">°F</button>
         </div>
      </div>
   )
}

export default Inputs