import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState()
  const [availablePlaces, setAvailablePlaces] = useState([])

  useEffect(()=>{
    async function fetchPlances() {
      setIsFetching(true)
      try{
        const places = await fetchAvailablePlaces()
        navigator.geolocation.getCurrentPosition((position)=>{
          const sortPosition = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)
          setAvailablePlaces(sortPosition)
          setIsFetching(false)
        })
      } catch(error){
        setError({message: error.message || 'Could not fetch the places, please try again later.'})
        setIsFetching(false)
      }
    }
    fetchPlances()
  },[]
  )

  if(error){
    return <Error title='Error occured!' message={error.message} />
  }
 
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading = {isFetching}
      loadingText="Fetching place data...."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
