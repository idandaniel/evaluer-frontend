import { getCourseModules } from "@/lib/api/course";
import { useQuery } from "@tanstack/react-query";

export const useCourseModules = (subject_id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["course", subject_id, "modules"],
        queryFn: () => getCourseModules({ subject_id }),
        enabled: enabled && !!subject_id
    });
};