import React from 'react';
import { Hotel } from './Itenary';
import Image from 'next/image';
import { Star, Wallet } from 'lucide-react';

type Props = {
    hotel: Hotel,
}
const HotelCards = ({ hotel }: Props) => {
    return (
        <div>
            <Image src={'/image/image.png'} alt={hotel.hotel_name} width={400} height={400} className="rounded-2xl" />
            <h2>{hotel.hotel_name}</h2>
            <h2 className="text-gray-500 ">{hotel.hotel_address}</h2>
            <p><Wallet /> {hotel.price_per_night}</p>
            <p><Star color="yellow" />{hotel.rating}</p>
        </div>
    );
}

export default HotelCards;
