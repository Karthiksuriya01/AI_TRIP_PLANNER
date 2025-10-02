import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY, // Make sure this is in .env.local
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Replace with your site URL in production
        "X-Title": "Trip Planner App",
    },
});

const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.

Only ask questions about the following details, in order, and wait for the user's answer before asking the next:

Starting location (source)
Destination city or country
Group size (Solo, Couple, Family, Friends)
Budget (Low, Medium, High)
Trip duration (number of days)
Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)
Special requirements or preferences (if any)

Do not ask multiple questions at once, and never ask irrelevant questions.
If any answer is missing or unclear, politely ask the user to clarify before proceeding.
Always maintain a conversational, interactive style while asking questions.

Along with response also send which ui component to display for generative UI for example budget/groupSize/tripDuration/final, where Final means generating or showing final plan.

Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with following JSON schema:
{
  "resp": "Text Resp",
  "ui": "budget/groupSize/tripDuration/final"
}`;

const FINAL_PROMPT = `Generate Travel Plan with give details,give me Hotels options list with HotelName,Hotel address, Price, hotel image url, geo coordinates, rating, description and suggest itenary with placename, Place Details, Place Image Url, Geo Cordinates, Place address, ticket Pricing, Time travel each of the location , with each day plan with best time to visit in JSON Format
Output Schema:
{
  "trip_plan":{
     "destination":"string",
     "duration":"string",
     "origin":"string",
     "budget":"string",
     "group_size":"string",
     "hotels":[
       
      {
         "hotel_name":"string",
         "hotel_address":"string",
         "price_per_night":"string",
         "hotel_image_url":"string",
         "geo_cordinates":{
           "latitude":"number",
           "longitude":"number",
           }
          "rating":"number",
          "description":"string"

       }


      ],
     "itinerary":[
       {
          "day":"number",
          "day_plan":"string",
          "best_time_to_visit_day":"string",
          "activities":[
           {
	    "place_name":"string",
            "place_details":"string",
            "place_image_url":"string",
            "geo_coordinates":{
               "latitude":"number",
               "longitude":"number',
             },
             "place_address":"string",
             "ticket_pricing":"string",
	     "time_travel_each_location":"string",
	     "best_time_to_visit":"string" 
            }            
           ]
        }
     ]		
   
   }

}
`


export async function POST(req: NextRequest) {
    try {
        const { messages,isFinal} = await req.json(); // ✅ fixed spelling (was messaages)

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-lite-preview-09-2025",
            response_format: { type: "json_object" }, // force JSON
            messages: [
                { role: "user", content: isFinal? FINAL_PROMPT : PROMPT },
                ...messages,
            ],
        });

        const message = completion.choices[0].message?.content;

        if (!message) {
            return NextResponse.json(
                { error: "No response from AI" },
                { status: 500 }
            );
        }

        // message is already valid JSON string
        return NextResponse.json(JSON.parse(message));
    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
