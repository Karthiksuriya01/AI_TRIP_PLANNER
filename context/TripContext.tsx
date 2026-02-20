"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for trip data
export type TripDetails = {
  destination: string;
  duration: string;
  origin: string;
  budget: string;
  group_size: string;
  hotels: Hotel[];
  itinerary: Itinerary[];
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_cordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

type TripContextType = {
  tripData: TripDetails | null;
  setTripData: (data: TripDetails | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [tripData, setTripData] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TripContext.Provider value={{ tripData, setTripData, isLoading, setIsLoading }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
