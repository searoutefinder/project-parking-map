import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if(!mapContainerRef.current) { return }
    if(mapRef.current) { return }
      
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/tamh/cmcdht3kr005f01r1h1od8a4w',
        center: [23.322201151614678, 42.69500142962019],
        zoom: 17,
        pitch: 61.99999999999999,
        bearing: 55.200000000000045,
        maxZoom: 20,
        minZoom:17,
        maxBounds: [[23.318797451788214, 42.692418869414155], [23.337414976994097, 42.70616336450993]]
      })
      
      mapRef.current.on("load", () => { 

        mapRef.current.setPaintProperty("HOVERED_LOTS", "line-width", 4)
        mapRef.current.setPaintProperty("HOVERED_LOTS", "line-color", "#1D1D1D")

        mapRef.current.on("click", "ACTIVE_LOTS", (e) => {
          const clickedId = e.features[0].properties.ID
          alert(`The clicked ID is ${clickedId}`)
        })        

        mapRef.current.on("mousemove", "ACTIVE_LOTS", (e) => {
          mapRef.current.getCanvas().style.cursor = 'pointer';
          const hoveredId = e.features[0].properties.ID
          mapRef.current.setFilter('HOVERED_LOTS', ['==', 'ID', hoveredId]);
        })

        mapRef.current.on("mouseout", "ACTIVE_LOTS", () => {
          mapRef.current.getCanvas().style.cursor = 'pointer';
          mapRef.current.setFilter('HOVERED_LOTS', [
            "all",
            [
              "match",
              ["get", "ID"],
              ["''"],
              true,
              false
            ],
            [
              "match",
              ["get", "ID"],
              [""],
              false,
              true
            ]
          ]);
        })

        mapRef.current.setPaintProperty('ACTIVE_LOTS', 'fill-color',
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
            ])

        mapRef.current.addSource('clipper-src', {'type': 'geojson', 'data': {
            "type": "FeatureCollection",
            "features": [
            { "type": "Feature", "properties": { "PERIMETER": "49.265 km", "ENCLOSED_AREA": "148.99 sq km", "LENGTH": "13.847 km", "WIDTH": "10.775 km", "ISLAND_AREA": "0.1724 sq km" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 23.257839, 42.754379 ], [ 23.389453, 42.754379 ], [ 23.389453, 42.629728 ], [ 23.257839, 42.629728 ], [ 23.257839, 42.754379 ] ], [ [ 23.323676, 42.694439 ], [ 23.324897, 42.695592 ], [ 23.325867, 42.696535 ], [ 23.325656, 42.696642 ], [ 23.325725, 42.696732 ], [ 23.326066, 42.697191 ], [ 23.326194, 42.697377 ], [ 23.326002, 42.697534 ], [ 23.325955, 42.697815 ], [ 23.324850, 42.697719 ], [ 23.324663, 42.698674 ], [ 23.323956, 42.698809 ], [ 23.323139, 42.698969 ], [ 23.322147, 42.699133 ], [ 23.321842, 42.698048 ], [ 23.321746, 42.697707 ], [ 23.321719, 42.697626 ], [ 23.321681, 42.697564 ], [ 23.321604, 42.697491 ], [ 23.321561, 42.697451 ], [ 23.321353, 42.697312 ], [ 23.321085, 42.697132 ], [ 23.320971, 42.697050 ], [ 23.320922, 42.696985 ], [ 23.320866, 42.696886 ], [ 23.320838, 42.696787 ], [ 23.320834, 42.696703 ], [ 23.320849, 42.696623 ], [ 23.320989, 42.696378 ], [ 23.321106, 42.696156 ], [ 23.321128, 42.696018 ], [ 23.321132, 42.695965 ], [ 23.321123, 42.695889 ], [ 23.321035, 42.695592 ], [ 23.320965, 42.695383 ], [ 23.320882, 42.695128 ], [ 23.320821, 42.694877 ], [ 23.320555, 42.694006 ], [ 23.320514, 42.693877 ], [ 23.320694, 42.693850 ], [ 23.321593, 42.693748 ], [ 23.322788, 42.693647 ], [ 23.322851, 42.693680 ], [ 23.322888, 42.693714 ], [ 23.323676, 42.694439 ] ] ] } }
            
            ]
            }
        })
        
        mapRef.current.addLayer({
          id: 'clipper-lyr',
          type: 'clip',
          source: 'clipper-src',
          layout: {
            'clip-layer-types': ['symbol', 'model']
          },
          maxzoom: 21
        });
        
        setTimeout(() => {
          //mapRef.current.setPaintProperty('ROAD_MARKINGS', 'line-emissive-strength', 1)
          //mapRef.current.setConfigProperty('basemap', 'lightPreset', 'night');
          
          mapRef.current.setFeatureState(
            {
              source: 'composite',
              sourceLayer: 'lots-2fqnu6',
              id: 3
            },
            { occupied: true }
          );
          mapRef.current.setFeatureState(
            {
              source: 'composite',
              sourceLayer: 'lots-2fqnu6',
              id: 25
            },
            { occupied: true }
          );          
          
        }, 5000)      
      })

    return () => {
        //console.log("Outside mapref check")
      if(mapRef.current) {
        //console.log("Inside mapref check")
        mapRef.current.remove();
        mapRef.current = null
      }
    }

  }, [])

  return (
    <>
      <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }}></div>
    </>
  )
}

export default Map;