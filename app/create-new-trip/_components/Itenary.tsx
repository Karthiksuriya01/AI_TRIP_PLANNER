"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import HotelCards from "./HotelCard";
import DayCards from "./DayCards";
import { useTrip, TripDetails } from "@/context/TripContext";

export function Itenary() {
  // Use Trip Context to get the dynamic trip data
  const { tripData, isLoading } = useTrip();

  // If there's no trip data yet, show a placeholder message
  if (!tripData) {
    return (
      <div className="relative w-full overflow-auto h-[90vh] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg">No trip plan yet</p>
          <p className="text-sm">Complete the chat to generate your trip plan</p>
        </div>
      </div>
    );
  }

  // Build the data for Timeline component using dynamic trip data
  const data = [
    {
      title: "Hotels",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          </p>
          <div className="grid grid-cols-2 gap-4">
            {tripData.hotels.map((hotel, index) =>
              <HotelCards hotel={hotel} key={index} />
            )}
          </div>
        </div>
      ),
    },
    ...tripData.itinerary.map((dayData, index) => ({
      title: `Day ${dayData.day}`,
      content: (
        <DayCards dayData={dayData} key={index} />
      )
    }))
  ];

  return (
    <div className="relative w-full overflow-auto h-[90vh]">
      <Timeline data={data} tripdetail={tripData} />
    </div>
  );
}
