import { getCourseExercises } from "@/lib/api/course";
import { useQuery } from "@tanstack/react-query";

export const useCourseExercises = (module_id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["course", module_id, "exercises"],
        queryFn: () => getCourseExercises({ module_id }),
        enabled: enabled && !!module_id
    });
};