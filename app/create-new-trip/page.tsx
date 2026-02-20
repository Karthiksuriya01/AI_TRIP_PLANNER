import React from 'react';
import ChatBox from './_components/ChatBox';
import { Itenary } from './_components/Itenary';
import { TripProvider } from '@/context/TripContext';


const CreateNewTrip = () => {
  return (
    <TripProvider>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 p-10'>
        <div>
          <ChatBox />
        </div>
        <div className='col-span-2'>
          <Itenary />
        </div>
      </div>
    </TripProvider>
  );
}

export default CreateNewTrip;
