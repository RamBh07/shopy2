import { CheckCircle, Truck, Package, Clock } from "lucide-react";

const OrderStatusTracker = ({ status }: { status: string }) => {
    // Define order steps in sequence
    const steps = [
        { id: "placed", label: "Placed", icon: CheckCircle },
        { id: "shipped", label: "Shipped", icon: Truck },
        { id: "arriving", label: "Arriving", icon: Clock },
        { id: "delivered", label: "Delivered", icon: Package },
    ];

    // Get index of current status
    const currentStepIndex = steps.findIndex((s) => s.id === status);

    return (
        <div className="flex items-center justify-between mt-6">
            {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative">
                        {/* Connecting line */}
                        {idx < steps.length - 1 && (
                            <div
                                className={`absolute top-3 left-1/2 w-full h-1 -translate-x-1/2 ${idx < currentStepIndex ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                            />
                        )}

                        {/* Step circle */}
                        <div
                            className={`z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 ${isCompleted
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : isCurrent
                                        ? "bg-blue-100 border-blue-500 text-blue-700"
                                        : "bg-gray-100 border-gray-300 text-gray-400"
                                }`}
                        >
                            <Icon size={18} />
                        </div>

                        {/* Label */}
                        <span
                            className={`mt-2 text-xs font-medium text-center ${isCompleted
                                    ? "text-blue-500"
                                    : isCurrent
                                        ? "text-blue-700"
                                        : "text-gray-400"
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderStatusTracker;
