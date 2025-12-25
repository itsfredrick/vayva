
import React from 'react';
import { ProductServiceItem, ProductServiceType, ProductServiceStatus } from '@vayva/shared';
import { Icon, Button, Badge, cn } from '@vayva/ui';

interface ProductListProps {
    items: ProductServiceItem[];
    onEdit: (item: ProductServiceItem) => void;
    onDelete: (id: string, name: string) => void;
    isLoading: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ items, onEdit, onDelete, isLoading }) => {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading products...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Package" size={32} className="opacity-50" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="text-sm">Try adjusting your search or add a new product.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                        <th className="px-4 py-3 font-medium">Product</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium text-right">Price</th>
                        <th className="px-4 py-3 font-medium">Status / Stock</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {items.map((item) => (
                        <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => onEdit(item)}>
                            {/* Product Info */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                        {item.images?.[0] ? (
                                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <Icon name="Image" size={16} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 line-clamp-1">{item.name}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                                    </div>
                                </div>
                            </td>

                            {/* Type Badge */}
                            <td className="px-4 py-3">
                                <Badge variant={
                                    (item.type === ProductServiceType.RETAIL ? 'default' :
                                        item.type === ProductServiceType.FOOD ? 'warning' : 'secondary') as any
                                } className="uppercase text-[10px] tracking-wider">
                                    {item.type}
                                </Badge>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3 text-right font-mono text-sm text-gray-700">
                                {item.currency} {item.price.toLocaleString()}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                {item.inventory?.enabled ? (
                                    <div className={cn(
                                        "flex items-center gap-2 text-sm",
                                        (item.inventory.quantity <= (item.inventory.lowStockThreshold || 5)) ? "text-orange-600" : "text-gray-600"
                                    )}>
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            item.inventory.quantity === 0 ? "bg-red-500" :
                                                item.inventory.quantity <= (item.inventory.lowStockThreshold || 5) ? "bg-orange-500" : "bg-emerald-500"
                                        )} />
                                        {item.inventory.quantity} in stock
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        {item.type === ProductServiceType.SERVICE ? 'Booking Available' : 'Always in stock'}
                                    </div>
                                )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-black" onClick={() => onEdit(item)}>
                                        <Icon name="Pencil" size={14} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(item.id, item.name)}>
                                        <Icon name="Trash2" size={14} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};
