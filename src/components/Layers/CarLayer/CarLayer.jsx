import { useEffect, useRef } from "react";
import { useMapContext } from '../../../context/MapContext';
import { Threebox } from 'threebox-plugin';

const CarLayer = ({map}) => {
    
    const initializedRef = useRef(false);
    const carModelRef = useRef(null);

    const { 
      parkingSpaceAnchors,
      occupiedParkingSpaces,
      setIsLoading
    } = useMapContext();

    useEffect(() => {
      const occupiedLocations = normalizeModelLocations()
      if(!carModelRef.current) { return }
      deleteModels()
      displayModels(occupiedLocations)
    }, [occupiedParkingSpaces])

    useEffect(() => {
      if (!map || initializedRef.current) return;
      console.info("The map object has been passed and is ready for use in the Car Layer component")
      initializedRef.current = true;
      initializeLayer();
    }, [])

    const initializeLayer = () => {
      map.addLayer({
        "id": "car-model-lyr",
        "type": "custom",
        "renderingMode": "3d",
        "onAdd": function () {
          window.tb = new Threebox(
            map,
            map.getCanvas().getContext('webgl'),
            { defaultLights: true }
          );
          const scale = 1;
          const options = {
            "obj": import.meta.env.VITE_CAR_MODEL_URL,
            "type": "gltf",
            "scale": { "x": scale, "y": scale, "z": 1 },
            "units": 'meters',
            "rotation": { "x": 90, "y": 15, "z": 0 },
            "anchor": "center"
          };
      
          window.tb.loadObj(options, (model) => {
            model.userData.carModel = true
            carModelRef.current = model
            console.log(normalizeModelLocations())
            displayModels([])
          });
        },
        "render": function () {
          window.tb.update();
        }
      });        
    }
    const normalizeModelLocations = () => {
      const occupiedLocations = Object.entries(parkingSpaceAnchors).filter(key => occupiedParkingSpaces.includes(Number(key[0]))).map(item => item[1])        
      return occupiedLocations
    }
    const deleteModels = () => {
      window.tb.clear()        
    }
    const displayModels = (positions) => {

        if( positions.length === 0) {
        console.info("No car models are to be placed. All parking spaces are free.")
        //setIsLoading(false);
        return
      }

      positions.forEach((pos) => {
        const clone = carModelRef.current.clone();
        clone.traverse(child => {
          if (child.isMesh) {
            child.material = child.material.clone();
            child.geometry = child.geometry.clone();
          }
        });
        const worldPos = window.tb.projectToWorld([pos[0], pos[1], 0])
        clone.position.set(worldPos.x, worldPos.y, worldPos.z);
        clone.scale.set(0.030, 0.030, 0.030);
        clone.rotation.set(0, 0, -120 * (Math.PI / 180));
        window.tb.add(clone);          
      })

      //setIsLoading(false);
    }

    return ('')
}
export default CarLayer