import { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export function MapProvider({ children }) {
  const [map, setMap] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapMode, setMapMode] = useState('day');
  const [isLoading, setIsLoading] = useState(true);
  const [modelCount, setModelCount] = useState(3);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null) 
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupData, setPopupData] = useState({})
  const [parkingSpaceIds, setParkingSpaceIds] = useState([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
  const [occupiedParkingSpaces, setOccupiedParkingSpaces] = useState([])
  const [parkingSpaceAnchors, setParkingSpaceAnchors] = useState({
    "0": [ 23.322688, 42.695378 ],
    "1": [ 23.322717, 42.695373 ],
    "2": [ 23.322743, 42.695368 ],
    "3": [ 23.322770, 42.695364 ],
    "4": [ 23.322800, 42.695358 ],
    "5": [ 23.322831, 42.695353 ],
    "6": [ 23.322861, 42.695348 ],
    "7": [ 23.322890, 42.695343 ],
    "8": [ 23.322920, 42.695338 ],
    "9": [ 23.322949, 42.695333 ],
    "10": [ 23.322978, 42.695328 ],
    "11": [ 23.323008, 42.695323 ],
    "12": [ 23.323039, 42.695318 ],
    "13": [ 23.323070, 42.695313 ],
    "14": [ 23.323102, 42.695307 ],
    "15": [ 23.323133, 42.695302 ],
    "16": [ 23.323163, 42.695297 ],
    "17": [ 23.323192, 42.695292 ],
    "18": [ 23.323223, 42.695286 ],
    "19": [ 23.323252, 42.695282 ],
    "20": [ 23.323283, 42.695277 ],
    "21": [ 23.323312, 42.695272 ],
    "22": [ 23.323342, 42.695266 ],
    "23": [ 23.323373, 42.695261 ],
    "24": [ 23.323406, 42.695255 ]    
  });

  return (
    <MapContext.Provider value={{ isLoading, setIsLoading, map, setMap, mapReady, setMapReady, mapMode, setMapMode, modelCount, setModelCount, selectedSpaceId, setSelectedSpaceId, isPopupVisible, setIsPopupVisible, popupData, setPopupData, occupiedParkingSpaces, setOccupiedParkingSpaces, parkingSpaceIds, setParkingSpaceIds, parkingSpaceAnchors }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  return useContext(MapContext);
}
