import React from 'react';
import { Users, User, UsersRound, Users2 } from 'lucide-react';



const groupSizes = [
    {
        id: 1,
        title: "Solo Travel",
        desc: "Perfect for independent adventurers ",
        people: 1,
        icon: <User className="w-6 h-6 text-primary" />
    },
    {
        id: 2,
        title: "Couple",
        desc: "Ideal for romantic getaways",
        people: 2,
        icon: <UsersRound className="w-6 h-6 text-primary" />
    },
    {
        id: 3,
        title: "Family",
        desc: "Great for families or small friend groups",
        people: "3-5",
        icon: <Users className="w-6 h-6 text-primary" />
    },
    {
        id: 4,
        title: "Friends",
        desc: "Perfect for bigger gatherings",
        people: "6+",
        icon: <Users2 className="w-6 h-6 text-primary" />
    }
];

const GroupSizeUi = ({onSelecteOption} : any) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {groupSizes.map((size) => (
                <div
                    key={size.id}
                    className="p-4 border rounded-lg hover:shadow-md bg-accent transition-shadow cursor-pointer"
                    onClick={() => onSelecteOption(size.title + ":" + size.people)}
                >
                    <div className="flex items-center gap-3 mb-2">
                        {size.icon}
                        <h3 className="font-semibold text-lg">{size.title}</h3>
                    </div>
                    {/* <p className="text-gray-600 text-sm">{size.desc}</p> */}
                    <p className="text-sm mt-2 text-gray-500">
                        {typeof size.people === 'number' 
                            ? `${size.people} person`
                            : `${size.people} people`}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default GroupSizeUi;