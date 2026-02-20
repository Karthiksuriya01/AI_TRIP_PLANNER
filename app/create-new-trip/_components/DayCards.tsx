"use client";

import React, { useState, useEffect } from 'react';
import { Activity } from '@/context/TripContext';
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
    const geo = "https://www.google.com/maps/search/?api=1&query="

    return (
        <div>
            <p className="font-medium">Best Time : {dayData.best_time_to_visit_day}</p>
            <div className="grid grid-cols-2 gap-4">
                {dayData.activities.map((activity, index) => (
                    <ActivityCard key={index} activity={activity} />
                ))}
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
