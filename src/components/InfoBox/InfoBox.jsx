import React from 'react';
import { useMapContext } from '../../context/MapContext';

const InfoBox = ({onClose, parkingSpaceData}) => {
  
  const { isPopupVisible } = useMapContext(); 

  if (!parkingSpaceData || Object.keys(parkingSpaceData).length === 0) {
    return '';
  }   

  const closeClickHandler = () => {
    onClose(false)
  }

  return (
      <div className={`rounded-t-xl lg:rounded-none absolute flex flex-col p-5 left-0 bottom-0 lg:bottom-auto lg:left-1/8 lg:top-1/2  lg:transform lg:-translate-y-1/2 w-full lg:w-1/4 bg-[rgba(29,29,29,0.8)] ${!isPopupVisible ? 'hidden' : ''}`}>

        <div className="flex flex-row w-full border-b-2 border-[#3dbeff]/50 pb-5">
          <h2 className="w-4/5 flex flex-col">
            <span className={`flex text-md lg:text-xl sofia-sans-semibold ${parkingSpaceData.available === true ? `text-[#3dbeff]/100` : `text-[#D04D4F]/80`}`}>{parkingSpaceData.available === true ? `Available` : `Occupied`}</span>
            <span className='flex text-[#e2e2e2]/70 text-md lg:text-xl sofia-sans-semibold'>Parking Spot</span>
          </h2>
          <div className="w-1/5 flex justify-end cursor-pointer" onClick={closeClickHandler}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#3dbeff" strokeOpacity="0.5" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <div className="flex flex-row w-full border-b-2 border-[#3dbeff]/50 py-5 items-center">
          <h3 className="w-1/2 uppercase text-xs items-center">
            <span className="text-[#e2e2e2] mr-1">Time</span>
            <span className={`${parkingSpaceData.available === true ? `text-[#3dbeff]/100` : `text-[#D04D4F]/80`}`}>{parkingSpaceData.available ? `Available` : `Occupied`}</span>
          </h3>
          <div className="w-1/2 uppercase text-white justify-end flex flex-row items-baseline gap-2">
            <span className="text-xl lg:text-3xl leading-none">01</span>
            <span className="text-xs leading-none">hours</span>
            <span className="text-xl lg:text-3xl leading-none">37</span>
            <span className="text-xs leading-none">minutes</span>
          </div>
        </div>

        {parkingSpaceData.available === false ? 
          <div className="flex flex-row w-full border-b-2 border-[#3dbeff]/50 py-5 items-center">
            <h3 className="w-1/2 uppercase text-xs text-[#E2E2E2]">License plate</h3>
            <p className="w-1/2 text-[#FFFFFF] uppercase  justify-end flex text-xl lg:text-3xl">CA 1234 AB</p>
          </div>       
          : ''
        }

      </div>
  )
}
export default InfoBox;