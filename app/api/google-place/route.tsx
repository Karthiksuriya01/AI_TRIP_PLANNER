import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { placeName } = await req.json();
        
        if (!placeName) {
            return NextResponse.json(
                { error: "placeName is required" },
                { status: 400 }
            );
        }

        const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
        
        const config = {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": process.env.GOOGLE_PLACE_API_KEY,
                "X-Goog-FieldMask": [
                    "places.photos",
                    "places.displayName",
                    "places.id",
                    "places.rating",
                    "places.userRatingCount",
                    "places.formattedAddress",
                    "places.types",
                    "places.websiteUri",
                    "places.nationalPhoneNumber",
                    "places.businessStatus",
                    "places.reviews"
                ]
            }
        };

        const result = await axios.post(BASE_URL, 
            { textQuery: placeName }, 
            config
        );

        if (!result.data.places || result.data.places.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No places found",
                placeName,
                data: null
            });
        }

        const place = result.data.places[0];
        let photoUrl = null;

        if (place.photos && place.photos.length > 0) {
            const photoRef = place.photos[0].name;
            photoUrl = `https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=1000&maxWidthPx=1000&key=${process.env.GOOGLE_PLACE_API_KEY}`;
        }

        const response = {
            success: true,
            placeName: placeName,
            googleData: {
                name: place.displayName?.text || placeName,
                photoUrl: photoUrl,
                rating: place.rating || null,
                userRatingCount: place.userRatingCount || 0,
                address: place.formattedAddress || "Address not available",
                website: place.websiteUri || null,
                phone: place.nationalPhoneNumber || null,
                businessStatus: place.businessStatus || null,
                types: place.types || [],
                id: place.id || null,
            }
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Google Places API Error:", error.message);
        return NextResponse.json(
            { 
                success: false,
                error: error.message || "Failed to fetch place details"
            },
            { status: 500 }
        );
    }
}
