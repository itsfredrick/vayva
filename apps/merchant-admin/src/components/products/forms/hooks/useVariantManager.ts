import { useState, useEffect } from "react";

export interface GeneratedVariant {
    id: string; // internal temp id
    title: string;
    options: Record<string, string>;
    price: number;
    sku: string;
    stock: number;
}

export interface ProductOption {
    id: string;
    name: string;
    values: string[];
}

export function useVariantManager(initialVariants: GeneratedVariant[] = []) {
    const [options, setOptions] = useState<ProductOption[]>([]);
    const [variants, setVariants] = useState<GeneratedVariant[]>(initialVariants);

    // Cartesian Product Helper
    const generateCartesianProduct = (args: ProductOption[]): Record<string, string>[][] => {
        const r: Record<string, string>[][] = [];
        const max = args.length - 1;
        function helper(arr: Record<string, string>[], i: number) {
            for (let j = 0, l = args[i].values.length; j < l; j++) {
                const a = arr.slice(0); // clone arr
                a.push({ [args[i].name]: args[i].values[j] });
                if (i === max) r.push(a);
                else helper(a, i + 1);
            }
        }
        helper([], 0);
        return r;
    };

    // Auto-generate variants when options change
    useEffect(() => {
        if (options.length === 0) {
            setVariants([]);
            return;
        }

        // Filter out incomplete options
        const validOptions = options.filter(o => o.name && o.values.length > 0);
        if (validOptions.length === 0) {
            setVariants([]);
            return;
        }

        const combinations = generateCartesianProduct(validOptions);

        // Map combinations to flat variant objects
        const newVariants = combinations.map((combo: any) => {
            // Merge array of objects into single object: [{Color: Red}, {Size: L}] -> {Color: Red, Size: L}
            const optionsMap = combo.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});
            const title = Object.values(optionsMap).join(" / ");

            // Try to preserve existing variant data (sku/stock) if title matches
            const existing = variants.find(v => v.title === title);

            return {
                id: existing?.id || crypto.randomUUID(),
                title,
                options: optionsMap,
                price: existing?.price || 0,
                sku: existing?.sku || "",
                stock: existing?.stock || 0
            };
        });

        setVariants(newVariants);
    }, [options]);

    // Actions
    const addOption = () => {
        setOptions([...options, { id: crypto.randomUUID(), name: "", values: [] }]);
    };

    const removeOption = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const updateOptionName = (index: number, name: string) => {
        const newOptions = [...options];
        newOptions[index].name = name;
        setOptions(newOptions);
    };

    const addValueToOption = (index: number, value: string) => {
        if (!value.trim()) return;
        const newOptions = [...options];
        if (!newOptions[index].values.includes(value)) {
            newOptions[index].values.push(value);
            setOptions(newOptions);
        }
    };

    const removeValueFromOption = (optionIndex: number, valueIndex: number) => {
        const newOptions = [...options];
        newOptions[optionIndex].values.splice(valueIndex, 1);
        setOptions(newOptions);
    };

    const updateVariantField = <K extends keyof GeneratedVariant>(index: number, field: K, value: GeneratedVariant[K]) => {
        const newVariants = [...variants];
        if (field === 'options' || field === 'id' || field === 'title') return; // protect readonly/structural fields

        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    return {
        options,
        variants,
        addOption,
        removeOption,
        updateOptionName,
        addValueToOption,
        removeValueFromOption,
        updateVariantField
    };
}
