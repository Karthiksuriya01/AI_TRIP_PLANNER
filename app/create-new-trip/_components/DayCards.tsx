"use client"
import React, { useEffect, useState } from 'react';
import { itinerary } from './Itenary';
import Image from 'next/image';
import { Globe, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';

type Props = {
    dayData: itinerary
}

const DayCards = ({ dayData }: Props) => {
    const [photoUrls, setPhotoUrls] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (dayData && dayData.activities) {
            console.log('Activities to fetch:', dayData.activities.map(a => a.place_name));
            // Fetch data for all activities
            dayData.activities.forEach(activity => {
                GetGooglePlaceData(activity.place_name, activity.place_address);
            });
        }
    }, [dayData]);

    const GetGooglePlaceData = async (placeName: string, placeAddress: string) => {
        try {
            console.log('Fetching data for:', placeName);
            const result = await axios.post('/api/google-place', {
                placeName: `${placeName}:${placeAddress}`
            });

            console.log('API Response for', placeName, ':', result.data);

            if (result.data) {
                setPhotoUrls(prev => {
                    const newUrls = {
                        ...prev,
                        [placeName]: result.data
                    };
                    console.log('Updated photo URLs:', newUrls);
                    return newUrls;
                });
            }
        } catch (error) {
            console.error('Error fetching place data for', placeName, ':', error);
        }
    };

    // Log whenever photoUrls changes
    useEffect(() => {
        console.log('Current photo URLs state:', photoUrls);
    }, [photoUrls]);

    const geo = "https://www.google.com/maps/search/?api=1&query=";

    return (
        <div>
            <p>Best Time : {dayData.best_time_to_visit_day}</p>
            <div className="grid grid-cols-2 gap-4">
                {dayData.activities.map((activity, index) => {
                    const photoUrl = photoUrls[activity.place_name];
                    console.log(`Rendering ${activity.place_name} with URL:`, photoUrl);
                    return (
                        <div key={index} className="mt-3">
                            <Image
                                src={ '/image/image.png'}
                                className="rounded-2xl"
                                width={400}
                                height={200}
                                alt={activity.place_name}
                            />
                            <h2 className="font-bold">{activity.place_name}</h2>
                            <p className="flex items-center gap-2">
                                <Ticket className="w-4 h-4" />
                                {activity.ticket_pricing}
                            </p>
                            <strong>Best time to visit</strong>
                            <p>{activity.best_time_to_visit}</p>
                            <Link href={`${geo}${encodeURIComponent(activity.place_name)}`} target="_blank">
                                <Button variant={"default"} className="w-full mt-3 cursor-pointer">
                                    <Globe className="mr-2" />View in Map
                                </Button>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DayCards;
