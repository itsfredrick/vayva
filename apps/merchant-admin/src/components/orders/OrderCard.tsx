
import React from 'react';
import { UnifiedOrder, UnifiedOrderStatus, OrderType } from '@vayva/shared';
import { Icon, cn } from '@vayva/ui';

interface OrderCardProps {
    order: UnifiedOrder;
    onClick: (order: UnifiedOrder) => void;
    variant?: 'list' | 'kanban';
}

export const OrderCard = ({ order, onClick, variant = 'list' }: OrderCardProps) => {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    const getStatusColor = (status: UnifiedOrderStatus) => {
        switch (status) {
            case UnifiedOrderStatus.NEW:
            case UnifiedOrderStatus.REQUESTED:
                return "bg-blue-50 text-blue-700 border-blue-100";
            case UnifiedOrderStatus.PROCESSING:
                return "bg-orange-50 text-orange-700 border-orange-100";
            case UnifiedOrderStatus.READY:
            case UnifiedOrderStatus.CONFIRMED:
                return "bg-purple-50 text-purple-700 border-purple-100";
            case UnifiedOrderStatus.COMPLETED:
                return "bg-green-50 text-green-700 border-green-100";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    if (variant === 'kanban') {
        // Compact card for columns
        return (
            <div
                onClick={() => onClick(order)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all mb-3"
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500">#{order.id.split('_')[1]}</span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded uppercase">{order.timestamps?.createdAt ? new Date(order.timestamps.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                </div>

                <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </h4>

                {order.items.some(i => i.modifiers) && (
                    <div className="mb-3 flex flex-wrap gap-1">
                        {order.items.flatMap(i => i.modifiers || []).map((mod, idx) => (
                            <span key={idx} className="text-[10px] bg-red-50 text-red-600 px-1.5 rounded border border-red-100">
                                {mod}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                        <div className={cn("w-2 h-2 rounded-full", order.fulfillmentType === 'pickup' ? "bg-orange-400" : "bg-blue-400")} />
                        <span className="text-xs font-medium text-gray-600 uppercase">{order.fulfillmentType}</span>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(order.totalAmount)}</span>
                </div>
            </div>
        );
    }

    // Default List / Agenda View
    return (
        <div
            onClick={() => onClick(order)}
            className="group bg-white p-5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all flex flex-col md:flex-row md:items-center gap-4"
        >
            {/* Left: Icon & ID */}
            <div className="flex items-center gap-4 min-w-[180px]">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl",
                    order.type === OrderType.FOOD ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-700"
                )}>
                    <Icon name={order.type === OrderType.RETAIL ? "ShoppingBag" : order.type === OrderType.FOOD ? "Utensils" : "Calendar"} size={20} />
                </div>
                <div>
                    <p className="font-mono text-xs text-gray-400 mb-1">Ref: #{order.id.split('_')[1]}</p>
                    <h4 className="font-bold text-gray-900">{order.customer.name}</h4>
                </div>
            </div>

            {/* Middle: Details */}
            <div className="flex-1 md:border-l md:border-gray-100 md:pl-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Items</p>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]" title={order.items.map(i => i.name).join(', ')}>
                        {order.items.length} items &bull; {order.items[0]?.name} {order.items.length > 1 && `+${order.items.length - 1} more`}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total</p>
                    <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                </div>
            </div>

            {/* Right: Status & Action */}
            <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
                <div className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border capitalize", getStatusColor(order.status))}>
                    {order.status.replace('_', ' ')}
                </div>

                <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon name="ChevronRight" size={16} />
                </button>
            </div>
        </div>
    );
};
