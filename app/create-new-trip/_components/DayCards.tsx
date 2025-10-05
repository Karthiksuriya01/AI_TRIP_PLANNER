import React from 'react';
import { itinerary } from './Itenary';
import Image from 'next/image';
import { Globe, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
type Props = {
    dayData: itinerary
}

const DayCards = ({ dayData }: Props) => {
    const geo = "https://www.google.com/maps/search/?api=1&query="
    return (
        <div>
            <p>Best Time : {dayData.best_time_to_visit_day}</p>
            <div className="grid grid-cols-2 gap-4">
                {dayData.activities.map((activites, index) => (
                    <div key={index} className="mt-3">
                        <Image src={'/image/image.png'} className="rounded-2xl" width={400} height={200} alt={activites.place_name} />
                        <h2 className="font-bold">{activites.place_name}</h2>
                        <p><Ticket />{activites.ticket_pricing}</p>
                        <strong>Best time to visit</strong>
                        <p>{activites.best_time_to_visit}</p>
                        <Link href={geo + activites.place_name} target="_blank">
                            <Button variant={"default"} className="w-full mt-3 cursor-pointer"><Globe />View in Map </Button>
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default DayCards;
