<<<<<<< HEAD
"use client";

import React, { useState, useEffect } from 'react';
import { Activity } from '@/context/TripContext';
=======
"use client"
import React, { useEffect, useState } from 'react';
import { itinerary } from './Itenary';
>>>>>>> 859f68c18c38d873d696e9b32112aae9199f7f2f
import Image from 'next/image';
import { Globe, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';

type Props = {
    dayData: {
        day: number;
        day_plan: string;
        best_time_to_visit_day: string;
        activities: Activity[];
    }
}

const DayCards = ({ dayData }: Props) => {
<<<<<<< HEAD
    const geo = "https://www.google.com/maps/search/?api=1&query="
=======
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
>>>>>>> 859f68c18c38d873d696e9b32112aae9199f7f2f

    return (
        <div>
            <p className="font-medium">Best Time : {dayData.best_time_to_visit_day}</p>
            <div className="grid grid-cols-2 gap-4">
<<<<<<< HEAD
                {dayData.activities.map((activity, index) => (
                    <ActivityCard key={index} activity={activity} />
                ))}
=======
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
>>>>>>> 859f68c18c38d873d696e9b32112aae9199f7f2f
            </div>
        </div>
    );
};

const ActivityCard = ({ activity }: { activity: Activity }) => {
    const [imageUrl, setImageUrl] = useState<string>('/image/image.png');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            // Check if the activity has a valid image URL
            const hasValidUrl = activity.place_image_url &&
                !activity.place_image_url.includes('example.com') &&
                activity.place_image_url.startsWith('http');

            if (hasValidUrl) {
                setImageUrl(activity.place_image_url);
                setIsLoading(false);
                return;
            }

            // If no valid URL, fetch from Google Places API
            try {
                const response = await axios.post('/api/google-place', {
                    placeName: activity.place_name
                });

                if (response.data?.imageUrls && response.data.imageUrls.length > 0) {
                    setImageUrl(response.data.imageUrls[0]);
                }
            } catch (error) {
                console.error('Error fetching activity image:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImage();
    }, [activity.place_name, activity.place_image_url]);

    const geo = "https://www.google.com/maps/search/?api=1&query=";

    return (
        <div className="mt-3">
            <div className="relative rounded-2xl overflow-hidden h-40">
                {isLoading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-400">Loading...</span>
                    </div>
                ) : (
                    <Image
                        src={imageUrl}
                        className="rounded-2xl object-cover"
                        fill
                        alt={activity.place_name}
                    />
                )}
            </div>
            <h2 className="font-bold mt-2">{activity.place_name}</h2>
            <p className="text-sm text-gray-600 mt-1">{activity.place_details}</p>
            <div className="flex items-center gap-1 mt-2">
                <Ticket className="w-4 h-4" />
                <span className="text-sm">{activity.ticket_pricing}</span>
            </div>
            <div className="mt-2">
                <strong className="text-sm">Best time to visit:</strong>
                <p className="text-sm text-gray-600">{activity.best_time_to_visit}</p>
            </div>
            <Link href={geo + activity.place_name} target="_blank">
                <Button variant={"default"} className="w-full mt-3 cursor-pointer">
                    <Globe className="w-4 h-4 mr-2" />
                    View in Map
                </Button>
            </Link>
        </div>
    );
};

export default DayCards;
