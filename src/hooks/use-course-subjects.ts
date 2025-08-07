import { getCourseSubjects } from "@/lib/api/course";
import { useQuery } from "@tanstack/react-query";

export const useCourseSubjects = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["course", "subjects"],
        queryFn: getCourseSubjects,
        enabled: enabled
    });
};