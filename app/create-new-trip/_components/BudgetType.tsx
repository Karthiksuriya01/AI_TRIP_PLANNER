import { Wallet, BadgeDollarSign, CircleDollarSign } from 'lucide-react';

export const budgetTypes = [
    {
        id: "low",
        label: "Budget Friendly",
        description: "Ideal for backpackers and budget-conscious travelers",
        range: "",
        icon: <Wallet className="w-6 h-6 text-primary" />
    },
    {
        id: "medium",
        label: "Moderate",
        description: "Comfortable travel with mid-range accommodations",
        range: "",
        icon: <CircleDollarSign className="w-6 h-6 text-primary" />
    },
    {
        id: "high",
        label: "High",
        description: "Premium experience with high-end amenities",
        range: "",
        icon: <BadgeDollarSign className="w-6 h-6 text-primary" />
    }
];

interface BudgetTypeProps {
    onSelecteOption: (value: string) => void;
}

const BudgetType = ({ onSelecteOption }: BudgetTypeProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {budgetTypes.map((budget) => (
                <div
                    key={budget.id}
                    className="p-4 border rounded-lg hover:shadow-md bg-accent transition-shadow cursor-pointer"
                    onClick={() => onSelecteOption(budget.label)}
                >
                    <div className="flex items-center gap-3 mb-2">
                        {budget.icon}
                        <h3 className="font-semibold text-lg">{budget.label}</h3>
                    </div>
                    <p className="text-sm mt-2 text-gray-500">
                        {budget.range}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default BudgetType;