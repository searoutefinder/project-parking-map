// Core
import React, { useEffect, useRef, useCallback } from 'react';

// Packages
import mapboxgl from 'mapbox-gl';

// Utilities
import { getTimePeriod } from '../../utils/utils'

// Context
import { useMapContext } from '../../context/MapContext';

// Child components
import InfoBox from '../../components/InfoBox/InfoBox'
import CarLayer from '../../components/Layers/CarLayer/CarLayer'
import ClipperLayer from '../../components/Layers/ClipperLayer/ClipperLayer'
import ParkingSpaceLayer from '../../components/Layers/ParkingSpaceLayer/ParkingSpaceLayer'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'


// Style declarations
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = () => {

  // References
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const {
    isLoading, 
    map,
    setMap,
    mapReady, 
    setMapReady,
    mapMode,
    setMapMode,
    setSelectedSpaceId,
    setPopupData, 
    popupData, 
    isPopupVisible,
    setIsPopupVisible, 
    setOccupiedParkingSpaces } = useMapContext();


  // Event handler methods
  const mapClickHandler = useCallback((e) => {
    if(!e.originalEvent.defaultPrevented) {
      e.originalEvent.preventDefault();
      // Hide the highlight layers when the user click on the map
      // This way we can save resources on resetting the filter
      mapRef.current.setLayoutProperty('CLICKED_LOT_AREA', 'visibility', 'none');      
      mapRef.current.setLayoutProperty('CLICKED_LOT_LINE', 'visibility', 'none');      

      setSelectedSpaceId(null)
      setPopupData({})
      setIsPopupVisible(false)
    }    
  }, [setSelectedSpaceId, setPopupData, setIsPopupVisible])

  const onLoadHandler = async () => {

    // Get the current lightPreset(mapMode) based on the information on sunrise/sunset etc on the given location at the given time
    const currentTimeUnix = Math.floor(Date.now() / 1000)
    const mapModeResult = await getTimePeriod(currentTimeUnix)  

    setMapMode(mapModeResult)
    setMapReady(true);

    // Set the map's lightPreset based on the calculated time of the day (dawn, day, dusk, night)
    mapRef.current.setConfigProperty('basemap', 'lightPreset', mapMode);   

    setMap(mapRef.current)

    mapRef.current.on("click", mapClickHandler)

    setTimeout(() => {
      setOccupiedParkingSpaces((prev) => [7,13,20])  
    }, 4000)
  }

  const popupClosedHandler = useCallback(() => {
    mapRef.current.setLayoutProperty('CLICKED_LOT_AREA', 'visibility', 'none');      
    mapRef.current.setLayoutProperty('CLICKED_LOT_LINE', 'visibility', 'none');      

    setSelectedSpaceId(null)
    setPopupData({})
    setIsPopupVisible(false)
  }, [isPopupVisible])

  useEffect(() => {
    if(!mapContainerRef.current) { return }
    if(mapRef.current) { return }
      
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: import.meta.env.VITE_MAP_STYLE,
        center: [
          import.meta.env.VITE_MAP_DESKTOP_LNG,
          import.meta.env.VITE_MAP_DESKTOP_LAT
        ],
        zoom: import.meta.env.VITE_MAP_ZOOM,
        pitch: import.meta.env.VITE_MAP_DESKTOP_PITCH,
        bearing: import.meta.env.VITE_MAP_DESKTOP_BEARING,
        maxZoom: import.meta.env.VITE_MAP_MAXZOOM,
        minZoom:import.meta.env.VITE_MAP_MINZOOM,
        maxBounds: [
          [23.318797451788214, 42.692418869414155],
          [23.337414976994097, 42.70616336450993]
        ]
      })
      
      mapRef.current.on("load", onLoadHandler)

    return () => {
      if(mapRef.current) {
        mapRef.current.off("click", mapClickHandler);
        mapRef.current.remove();
        mapRef.current = null
      }
    }

  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute w-full h-full">
        {map && mapReady && <CarLayer map={map} />}
        {map && mapReady && <ClipperLayer map={map} />}
        {map && mapReady && <ParkingSpaceLayer map={map} />}
      </div>
      <InfoBox onClose={popupClosedHandler} parkingSpaceData={popupData}/>
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export default Map;