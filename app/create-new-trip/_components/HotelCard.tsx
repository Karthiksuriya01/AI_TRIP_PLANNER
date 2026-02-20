"use client";

import React, { useState, useEffect } from 'react';
import { Hotel } from '@/context/TripContext';
import Image from 'next/image';
import { Star, Wallet } from 'lucide-react';
import axios from 'axios';

type Props = {
    hotel: Hotel,
}

const HotelCards = ({ hotel }: Props) => {
    const [imageUrl, setImageUrl] = useState<string>('/image/image.png');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            // Check if the hotel has a valid image URL (not from example.com or similar placeholders)
            const hasValidUrl = hotel.hotel_image_url &&
                !hotel.hotel_image_url.includes('example.com') &&
                hotel.hotel_image_url.startsWith('http');

            if (hasValidUrl) {
                setImageUrl(hotel.hotel_image_url);
                setIsLoading(false);
                return;
            }

            // If no valid URL, fetch from Google Places API
            try {
                const response = await axios.post('/api/google-place', {
                    hotelName: hotel.hotel_name
                });

                if (response.data?.imageUrls && response.data.imageUrls.length > 0) {
                    setImageUrl(response.data.imageUrls[0]);
                }
            } catch (error) {
                console.error('Error fetching hotel image:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImage();
    }, [hotel.hotel_name, hotel.hotel_image_url]);

    return (
        <div>
            <div className="relative rounded-2xl overflow-hidden h-48">
                {isLoading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-400">Loading...</span>
                    </div>
                ) : (
                    <Image
                        src={imageUrl}
                        alt={hotel.hotel_name}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <h2 className="font-bold mt-2">{hotel.hotel_name}</h2>
            <h2 className="text-gray-500 text-sm">{hotel.hotel_address}</h2>
            <div className="flex items-center gap-2 mt-1">
                <Wallet className="w-4 h-4" />
                <span>{hotel.price_per_night}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{hotel.rating}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{hotel.description}</p>
        </div>
    );
}

export default HotelCards;
