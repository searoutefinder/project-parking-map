import { useEffect, useRef } from "react";
import { useMapContext } from '../../../context/MapContext';

const ParkingSpaceLayer = ({map}) => {
    
    const initializedRef = useRef(false);
    const lastHoveredId = useRef(null);

    const { 
        parkingSpaceIds,
        setSelectedSpaceId, 
        setPopupData,
        setIsPopupVisible,
        occupiedParkingSpaces,
        setIsLoading
    } = useMapContext();

    useEffect(() => {
      if (!map || initializedRef.current) return;
      //console.info("The map object has been passed and is ready for use in the Parking Space Layer component")
      initializedRef.current = true;
      initializeLayer();

      return () => {
        if (map && map.isStyleLoaded()) {
          map.off("click", "ACTIVE_LOTS", activeLotClickHandler);
          map.off("mousemove", "ACTIVE_LOTS", activeLotHoverHandler);
          map.off("mouseout", "ACTIVE_LOTS", activeLotMouseOutHandler);
          map.off("mousemove", "HOVERED_LOT_AREA", hoveredLotHoverHandler);
          map.off("mouseout", "HOVERED_LOT_AREA", hoveredLotMouseOutHandler);        
        }
      }

    }, [])

    useEffect(() => {
      //console.info("Parking layer update called")
      //console.log(occupiedParkingSpaces)
      highlightOccupiedParkingSpaces(occupiedParkingSpaces)
    }, [occupiedParkingSpaces])

    const initializeLayer = () => {
      
        // Define value based styling rules
      map.setPaintProperty('ACTIVE_LOTS', 'fill-color',
        ['case', 
          ["all", 
            ["==", ['feature-state', 'occupied'], true],
            ["==", ['get', 'TYPE'], 'handicapped']
          ],
          "#D26870",
          ["all", 
            ["==", ['feature-state', 'occupied'], true],
            ["==", ['get', 'TYPE'], 'normal']
          ],
          "#D26870",
          ["==", ['get', 'TYPE'], 'handicapped'],
          "#3DBEFF",
          "#85DCB1"              
        ]
      )         

      // Define events
      map.on("click", "ACTIVE_LOTS", activeLotClickHandler)

      map.on("mousemove", "ACTIVE_LOTS", activeLotHoverHandler)
  
      map.on("mouseout", "ACTIVE_LOTS", activeLotMouseOutHandler)      

      map.on("mousemove", "HOVERED_LOT_AREA", hoveredLotHoverHandler)
  
      map.on("mouseout", "HOVERED_LOT_AREA", hoveredLotMouseOutHandler)        
    }

    const activeLotClickHandler = (e) => {
      e.originalEvent.preventDefault()

      const clickedId = e.features[0].properties.ID
      map.setFilter('CLICKED_LOT_AREA', ['==', 'ID', clickedId]);
      map.setFilter('CLICKED_LOT_LINE', ['==', 'ID', clickedId]);
      map.setLayoutProperty('CLICKED_LOT_AREA', 'visibility', 'visible');      
      map.setLayoutProperty('CLICKED_LOT_LINE', 'visibility', 'visible');        

      // Set context values so that the InfoBox could show
      setSelectedSpaceId(clickedId)
      setPopupData({available: (Object.keys(e.features[0].state).length > 0) ? !e.features[0].state.occupied : true})
      setIsPopupVisible(true)
    }

    const activeLotHoverHandler = (e) => {
      map.getCanvas().style.cursor = 'pointer';
      const hoveredId = e.features[0].properties.ID

      if (hoveredId !== lastHoveredId.current) {
        lastHoveredId.current = hoveredId;
        map.setLayoutProperty('HOVERED_LOT', 'visibility', 'visible');
        map.setLayoutProperty('HOVERED_LOT_AREA', 'visibility', 'visible');        
        map.setFilter('HOVERED_LOT', ['==', 'ID', hoveredId]);
        map.setFilter('HOVERED_LOT_AREA', ['==', 'ID', hoveredId]);        
      }
    }

    const activeLotMouseOutHandler = () => {
      //map.getCanvas().style.cursor = '';
      
      lastHoveredId.current = null

      // Reset the hovered_lots and active_lots filters
      map.setLayoutProperty('HOVERED_LOT', 'visibility', 'none');
      map.setLayoutProperty('HOVERED_LOT_AREA', 'visibility', 'none');
    }

    const hoveredLotHoverHandler = () => {
      map.getCanvas().style.cursor = 'pointer';   
    }

    const hoveredLotMouseOutHandler = () => {
      //map.getCanvas().style.cursor = '';   
    }    

    const highlightOccupiedParkingSpaces = (occupiedParkingSpaceIds) => {
      if(!Array.isArray(occupiedParkingSpaceIds) || occupiedParkingSpaceIds.length === 0) { return } 
      
      const freeParkingSpaceIds = parkingSpaceIds.filter((id) => {
        return !occupiedParkingSpaceIds.includes(id)
      })

      freeParkingSpaceIds.forEach((id) => {
        map.setFeatureState(
          {
            "source": "composite",
            "sourceLayer": import.meta.env.VITE_MAP_SRC_LYR_LOTS,
            "id": id + 1
          },
          {occupied: undefined}
        );        
      })

      for(let i = 0; i < occupiedParkingSpaceIds.length; i++) {
        map.setFeatureState(
          {
            "source": "composite",
            "sourceLayer": import.meta.env.VITE_MAP_SRC_LYR_LOTS,
            "id": occupiedParkingSpaceIds[i] + 1
          },
          { "occupied": true }
        );
      }

      setIsLoading(false)
    }

    return (null)
}
export default ParkingSpaceLayer