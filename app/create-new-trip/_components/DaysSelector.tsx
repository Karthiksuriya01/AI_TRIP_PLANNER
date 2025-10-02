import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Minus, Plus } from 'lucide-react';

interface DaysSelectorProps {
    onSelecteOption: (value: string) => void;
}

const DaysSelector = ({ onSelecteOption }: DaysSelectorProps) => {
    const [days, setDays] = useState(7); // Default to 7 days

    const increment = () => {
        if (days < 30) { // Maximum 30 days
            setDays(prev => prev + 1);
        }
    };

    const decrement = () => {
        if (days > 1) { // Minimum 1 day
            setDays(prev => prev - 1);
        }
    };

    const handleSelect = () => {
        onSelecteOption(`Duration:${days} ${days === 1 ? 'day' : 'days'}`);
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-lg">Trip Duration</h3>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
                <div className="flex items-center justify-center space-x-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={decrement}
                        disabled={days <= 1}
                        className="rounded-full h-10 w-10"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>

                    <div className="text-4xl font-semibold min-w-[100px] text-center">
                        {days}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={increment}
                        disabled={days >= 30}
                        className="rounded-full h-10 w-10"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="text-sm text-gray-500">
                    {days === 1 ? 'DAY' : 'DAYS'}
                </div>

                <Button
                    className="w-full max-w-[200px]"
                    onClick={handleSelect}
                >
                    Confirm Duration
                </Button>
            </div>
        </div>
    );
};

export default DaysSelector;