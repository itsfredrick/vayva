import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
export function useOpsQuery(queryKey, fetcher, options) {
    return useQuery({
        queryKey,
        queryFn: async () => {
            try {
                return await fetcher();
            }
            catch (error) {
                toast.error("Data Fetch Error", {
                    description: error.message || "Something went wrong while fetching data.",
                });
                throw error;
            }
        },
        ...options,
    });
}
