
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export function useOpsQuery<T>(
    queryKey: string[],
    fetcher: () => Promise<T>,
    options?: Omit<UseQueryOptions<T, Error, T, string[]>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey,
        queryFn: async () => {
            try {
                return await fetcher();
            } catch (error: any) {
                toast.error("Data Fetch Error", {
                    description: error.message || "Something went wrong while fetching data.",
                });
                throw error;
            }
        },
        ...options,
    });
}
