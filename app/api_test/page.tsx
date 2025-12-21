"use client";

import React, { useState } from "react";
import ChatBox from "../create-new-trip/_components/ChatBox";
import axios from "axios";
import Image from "next/image";

interface PlaceData {
    success: boolean;
    placeName: string;
    googleData?: {
        name: string;
        photoUrl: string | null;
        rating: number | null;
        userRatingCount: number;
        address: string;
        website: string | null;
        phone: string | null;
        businessStatus: string | null;
        types: string[];
        id: string | null;
    };
    message?: string;
    error?: string;
}

interface TripResponse {
    trip_plan?: {
        destination: string;
        duration: string;
        itinerary: Array<{
            activities: Array<{
                place_name: string;
            }>;
        }>;
    };
}

const APITestPage = () => {
    const [tripData, setTripData] = useState<TripResponse | null>(null);
    const [placesData, setPlacesData] = useState<PlaceData[]>([]);
    const [loading, setLoading] = useState(false);
    const [jsonOutput, setJsonOutput] = useState("");

    const extractPlaceNames = (data: any): string[] => {
        const places = new Set<string>();
        
        try {
            if (data?.trip_plan?.itinerary) {
                data.trip_plan.itinerary.forEach((day: any) => {
                    if (day.activities) {
                        day.activities.forEach((activity: any) => {
                            if (activity.place_name) {
                                places.add(activity.place_name);
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Error extracting places:", error);
        }
        
        return Array.from(places);
    };

    const fetchPlaceDetails = async (placeNames: string[]) => {
        setLoading(true);
        const results: PlaceData[] = [];
        
        for (const placeName of placeNames) {
            try {
                const response = await axios.post("/api/google-place", { placeName });
                results.push(response.data);
            } catch (error) {
                console.error(`Error fetching ${placeName}:`, error);
                results.push({
                    success: false,
                    placeName,
                    message: "Failed to fetch place details"
                });
            }
        }
        
        setPlacesData(results);
        setJsonOutput(JSON.stringify(results, null, 2));
        setLoading(false);
    };

    const handleFinalResponse = async (data: TripResponse) => {
        setTripData(data);
        const placeNames = extractPlaceNames(data);
        console.log("Extracted places:", placeNames);
        
        if (placeNames.length > 0) {
            await fetchPlaceDetails(placeNames);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 min-h-screen bg-gray-100">
            {/* Chat Section */}
            <div className="h-screen sticky top-0">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
                    <ChatBox onFinalResponse={handleFinalResponse} />
                </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
                {/* Trip Info */}
                {tripData?.trip_plan && (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">
                            🏕️ Trip Plan
                        </h2>
                        <div className="space-y-2 text-sm">
                            <p>
                                <strong>Destination:</strong>{" "}
                                {tripData.trip_plan.destination}
                            </p>
                            <p>
                                <strong>Duration:</strong>{" "}
                                {tripData.trip_plan.duration}
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <p className="text-gray-600">
                            ⏳ Fetching place details from Google Places API...
                        </p>
                    </div>
                )}

                {/* Places Display */}
                {placesData.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            📍 Places (Google Places API Response)
                        </h2>

                        {placesData.map((place, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500"
                            >
                                {place.success && place.googleData ? (
                                    <>
                                        {/* Image */}
                                        {place.googleData.photoUrl && (
                                            <div className="mb-4 relative h-48 rounded-lg overflow-hidden bg-gray-200">
                                                <Image
                                                    src={place.googleData.photoUrl}
                                                    alt={place.googleData.name}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {place.googleData.name}
                                            </h3>

                                            {place.googleData.rating && (
                                                <p className="text-sm">
                                                    <strong>⭐ Rating:</strong>{" "}
                                                    {place.googleData.rating} (
                                                    {place.googleData.userRatingCount} reviews)
                                                </p>
                                            )}

                                            <p className="text-sm">
                                                <strong>📍 Address:</strong>{" "}
                                                {place.googleData.address}
                                            </p>

                                            {place.googleData.phone && (
                                                <p className="text-sm">
                                                    <strong>📞 Phone:</strong>{" "}
                                                    {place.googleData.phone}
                                                </p>
                                            )}

                                            {place.googleData.website && (
                                                <p className="text-sm">
                                                    <strong>🌐 Website:</strong>{" "}
                                                    <a
                                                        href={place.googleData.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Visit
                                                    </a>
                                                </p>
                                            )}

                                            {place.googleData.businessStatus && (
                                                <p className="text-sm">
                                                    <strong>Status:</strong>{" "}
                                                    {place.googleData.businessStatus}
                                                </p>
                                            )}

                                            {place.googleData.types.length > 0 && (
                                                <p className="text-sm">
                                                    <strong>Types:</strong>{" "}
                                                    {place.googleData.types.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-red-600">
                                        ❌ {place.message || place.error}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* JSON Output */}
                {jsonOutput && (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-3">
                            📋 JSON Response
                        </h2>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                            {jsonOutput}
                        </pre>
                    </div>
                )}

                {/* Empty State */}
                {!tripData && (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <p className="text-gray-600 text-lg">
                            💬 Chat on the left to get started!
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Answer the AI questions and we'll fetch place details
                            from Google Places API for testing.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default APITestPage;
