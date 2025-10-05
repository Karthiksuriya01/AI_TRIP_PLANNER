import React, { act } from "react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";
import { Globe, Star, StarHalfIcon, Ticket, Wallet } from "lucide-react";
import { title } from "process";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HotelCards from "./HotelCard";
import DayCards from "./DayCards";


export type TripDetails = {
  destination: string;
  duration: string;
  origin: string;
  budget: string;
  group_size: string;
  hotels: Hotel[];
  itinerary: itinerary[]
};

export type Hotel =
  {
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
  }

export type itinerary =
  {
    day: number;
    day_plan: string;
    best_time_to_visit_day: string;
    activities: {
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
    }[];
  }

const tripdetails = {
  "destination": "Goa, India",
  "duration": "3 days",
  "origin": "Vijayawada, India",
  "budget": "Low",
  "group_size": "2",
  "hotels": [
    {
      "hotel_name": "Seaside Serenity Resort",
      "hotel_address": "Beach Road, Calangute, North Goa, Goa 403516",
      "price_per_night": "₹5,500",
      "hotel_image_url": "pm images/seaside_serenity.jpg",
      "geo_cordinates": {
        "latitude": 15.5483,
        "longitude": 73.7500
      },
      "rating": 4.3,
      "description": "Comfortable mid-range resort with sea views, pool, and complimentary breakfast. Close to Calangute beach and local markets."
    },
    {
      "hotel_name": "Palm Grove Boutique Hotel",
      "hotel_address": "Main Road, Baga, North Goa, Goa 403518",
      "price_per_night": "₹7,200",
      "hotel_image_url": "https://example.com/images/palm_grove.jpg",
      "geo_cordinates": {
        "latitude": 15.5450,
        "longitude": 73.7515
      },
      "rating": 4.6,
      "description": "Stylish boutique hotel offering modern rooms, rooftop lounge, and easy access to Baga Beach and nightlife."
    },
    {
      "hotel_name": "Heritage Villa Panaji",
      "hotel_address": "Altinho, Panaji, Goa 403001",
      "price_per_night": "₹4,000",
      "hotel_image_url": "https://example.com/images/heritage_villa_panaji.jpg",
      "geo_cordinates": {
        "latitude": 15.4909,
        "longitude": 73.8278
      },
      "rating": 4.0,
      "description": "Charming heritage-style guesthouse in Panaji offering local Goan ambiance, close to restaurants and riverfront."
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "day_plan": "Arrival, check-in, relax at the beach, sunset at Fort Aguada",
      "best_time_to_visit_day": "Morning arrival; evening for Fort Aguada sunset",
      "activities": [
        {
          "place_name": "Calangute Beach",
          "place_details": "One of Goa's most popular beaches with water sports, shacks, and lively markets.",
          "place_image_url": "https://example.com/images/calangute_beach.jpg",
          "geo_coordinates": {
            "latitude": 15.5485,
            "longitude": 73.7510
          },
          "place_address": "Calangute, North Goa, Goa 403516",
          "ticket_pricing": "Free (water sports extra: ₹300–₹1500 depending on activity)",
          "time_travel_each_location": "30 mins from hotel (depends on exact hotel location)",
          "best_time_to_visit": "6:00 AM - 9:00 AM for calm morning; 4:00 PM - 6:30 PM for sunset"
        },
        {
          "place_name": "Fort Aguada",
          "place_details": "A 17th-century Portuguese fort with panoramic views of the Arabian Sea and lighthouse.",
          "place_image_url": "https://example.com/images/fort_aguada.jpg",
          "geo_coordinates": {
            "latitude": 15.4975,
            "longitude": 73.7868
          },
          "place_address": "Sinquerim, Bardez, Goa 403515",
          "ticket_pricing": "Free (parking fee may apply)",
          "time_travel_each_location": "25–40 mins from Calangute (by car)",
          "best_time_to_visit": "4:00 PM - 6:30 PM for sunset and cooler weather"
        }
      ]
    },
    {
      "day": 2,
      "day_plan": "Old Goa churches and Panaji riverfront, evening casino or night market",
      "best_time_to_visit_day": "Morning for churches; late afternoon for riverfront and evening for market/casino",
      "activities": [
        {
          "place_name": "Basilica of Bom Jesus",
          "place_details": "UNESCO World Heritage site housing the mortal remains of St. Francis Xavier; classic Portuguese architecture.",
          "place_image_url": "https://example.com/images/basilica_bom_jesus.jpg",
          "geo_coordinates": {
            "latitude": 15.5012,
            "longitude": 73.9137
          },
          "place_address": "Old Goa, North Goa, Goa 403402",
          "ticket_pricing": "Free entry (donations welcome); guided tours may cost ₹200–₹500",
          "time_travel_each_location": "45–60 mins from Panaji (by car)",
          "best_time_to_visit": "9:00 AM - 11:30 AM when it's less crowded and cooler"
        },
        {
          "place_name": "Church of St. Francis of Assisi",
          "place_details": "Historic church beside the Basilica with ornate interiors and frescoes.",
          "place_image_url": "https://example.com/images/st_francis_assisi.jpg",
          "geo_coordinates": {
            "latitude": 15.5008,
            "longitude": 73.9145
          },
          "place_address": "Old Goa, North Goa, Goa 403402",
          "ticket_pricing": "Free",
          "time_travel_each_location": "5–10 mins walk from Basilica",
          "best_time_to_visit": "10:00 AM - 12:00 PM"
        },
        {
          "place_name": "Panaji Riverfront (Mandovi River Walk)",
          "place_details": "Scenic promenade with cafes, boat rides, and views of the Mandovi River.",
          "place_image_url": "https://example.com/images/panaji_riverfront.jpg",
          "geo_coordinates": {
            "latitude": 15.4900,
            "longitude": 73.8275
          },
          "place_address": "Panaji, Goa 403001",
          "ticket_pricing": "Free (boat rides ₹200–₹700)",
          "time_travel_each_location": "10–20 mins from Panaji hotels",
          "best_time_to_visit": "4:30 PM - 7:30 PM"
        }
      ]
    },
    {
      "day": 3,
      "day_plan": "North Goa exploration: Baga, Anjuna, and Anjuna Flea Market (if open). Departure in late evening.",
      "best_time_to_visit_day": "Morning for beaches; late morning to afternoon for Anjuna and markets",
      "activities": [
        {
          "place_name": "Baga Beach",
          "place_details": "Vibrant beach known for water sports, beach shacks, and nightlife.",
          "place_image_url": "https://example.com/images/baga_beach.jpg",
          "geo_coordinates": {
            "latitude": 15.5472,
            "longitude": 73.7516
          },
          "place_address": "Baga, North Goa, Goa 403518",
          "ticket_pricing": "Free (water sports extra)",
          "time_travel_each_location": "10–20 mins from Calangute",
          "best_time_to_visit": "8:00 AM - 11:00 AM for quiet morning; 5:00 PM onwards for sunset"
        },
        {
          "place_name": "Anjuna Beach & Flea Market",
          "place_details": "Popular for its bohemian vibe, rocky shore, beach parties and the Anjuna Flea Market (usually Wednesdays).",
          "place_image_url": "https://example.com/images/anjuna_flea_market.jpg",
          "geo_coordinates": {
            "latitude": 15.5857,
            "longitude": 73.7414
          },
          "place_address": "Anjuna, Bardez, North Goa, Goa 403509",
          "ticket_pricing": "Free (shopping costs vary)",
          "time_travel_each_location": "20–35 mins from Baga depending on traffic",
          "best_time_to_visit": "10:30 AM - 3:00 PM for market; late afternoon for the beach"
        },
        {
          "place_name": "Chapora Fort (Dil Chahta Hai viewpoint)",
          "place_details": "Small fort offering panoramic views of Vagator and Arabian Sea; popular sunset spot and photo-op.",
          "place_image_url": "https://example.com/images/chapora_fort.jpg",
          "geo_coordinates": {
            "latitude": 15.5950,
            "longitude": 73.7080
          },
          "place_address": "Vagator/Chapora, North Goa, Goa 403509",
          "ticket_pricing": "Free",
          "time_travel_each_location": "15–25 mins from Anjuna",
          "best_time_to_visit": "4:30 PM - 6:30 PM for sunset and best photos"
        }
      ]
    }
  ]
}


export function Itenary() {
  const data = [
    {

      title: "Hotels",
      content: (
        <div>

          <p
            className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">

          </p>
          <div className="grid grid-cols-2 gap-4">
            {tripdetails.hotels.map((hotel, index) =>
              <HotelCards hotel={hotel} key={index} />
            )}
          </div>
        </div>
      ),
    },
    ...tripdetails?.itinerary.map((dayData, index) => ({
      title: `Day ${dayData?.day}`,
      content: (
        <DayCards dayData={dayData} key={index} />
      )
    }))


  ];
  return (
    <div className="relative w-full overflow-auto h-[90vh]">
      <Timeline data={data} tripdetail={tripdetails} />
    </div>
  );
}
