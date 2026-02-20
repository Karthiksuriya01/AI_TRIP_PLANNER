import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "AIzaSyCrP_tgcUj7KxdJpLhm0nzeMwbpmg0cecM";

export async function POST(req: NextRequest) {
    try {
        const { placeName, hotelName } = await req.json();

        if (!placeName && !hotelName) {
            return NextResponse.json(
                { error: "placeName or hotelName is required" },
                { status: 400 }
            );
        }

        // Use the provided name for searching
        const searchQuery = placeName || hotelName;

        // Step 1: Search for the place using Google Places Text Search API
        const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_API_KEY}`;

        const textSearchResponse = await fetch(textSearchUrl);
        const textSearchData = await textSearchResponse.json();

        if (textSearchData.status !== "OK" || !textSearchData.results || textSearchData.results.length === 0) {
            return NextResponse.json(
                { error: "Place not found", status: textSearchData.status },
                { status: 404 }
            );
        }

        // Get the first result
        const place = textSearchData.results[0];

        // Step 2: Get more details about the place including photos
        const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos,name,formatted_address&key=${GOOGLE_API_KEY}`;

        const placeDetailsResponse = await fetch(placeDetailsUrl);
        const placeDetailsData = await placeDetailsResponse.json();

        if (placeDetailsData.status !== "OK" || !placeDetailsData.result) {
            return NextResponse.json(
                { error: "Could not get place details", status: placeDetailsData.status },
                { status: 404 }
            );
        }

        const placeDetails = placeDetailsData.result;
        const photos = placeDetails.photos || [];

        // Step 3: Get the photo URLs from the photo references
        const photoUrls = photos.slice(0, 5).map((photo: any) => {
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
        });

        // Return the image URLs along with place details
        return NextResponse.json({
            placeName: placeDetails.name || searchQuery,
            address: placeDetails.formatted_address || "",
            imageUrls: photoUrls,
            placeholderImage: photoUrls[0] || null
        });

    } catch (err) {
        console.error("Google Places API Error:", err);
        return NextResponse.json(
            { error: "Failed to fetch place images" },
            { status: 500 }
        );
    }
}

// Also support GET requests for simple image fetching
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const placeName = searchParams.get("placeName") || "";
    const hotelName = searchParams.get("hotelName") || "";

    if (!placeName && !hotelName) {
        return NextResponse.json(
            { error: "placeName or hotelName is required" },
            { status: 400 }
        );
    }

    try {
        const searchQuery = placeName || hotelName;

        const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_API_KEY}`;

        const textSearchResponse = await fetch(textSearchUrl);
        const textSearchData = await textSearchResponse.json();

        if (textSearchData.status !== "OK" || !textSearchData.results || textSearchData.results.length === 0) {
            return NextResponse.json(
                { imageUrls: [], placeholderImage: null },
                { status: 200 }
            );
        }

        const place = textSearchData.results[0];

        const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${GOOGLE_API_KEY}`;

        const placeDetailsResponse = await fetch(placeDetailsUrl);
        const placeDetailsData = await placeDetailsResponse.json();

        const photos = placeDetailsData.result?.photos || [];
        const photoUrls = photos.slice(0, 5).map((photo: any) => {
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
        });

        return NextResponse.json({
            imageUrls: photoUrls,
            placeholderImage: photoUrls[0] || null
        });

    } catch (err) {
        console.error("Google Places API Error:", err);
        return NextResponse.json(
            { error: "Failed to fetch place images", imageUrls: [] },
            { status: 500 }
        );
    }
}
