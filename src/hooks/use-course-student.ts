import { getCourseStudents } from "@/lib/api/course";
import { useQuery } from "@tanstack/react-query";

export const useCourseStudents = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["course", "students"],
        queryFn: getCourseStudents,
        enabled: enabled
    });
};