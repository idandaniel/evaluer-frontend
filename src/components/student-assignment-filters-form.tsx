import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCourseExercises } from "@/hooks/use-course-exercises";
import { useCourseModules } from "@/hooks/use-course-modules";
import { useCourseStudents } from "@/hooks/use-course-student";
import { useCourseSubjects } from "@/hooks/use-course-subjects";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HiveResourceSelect } from "./hive-resource-select";

const formSchema = z.object({
    subjectId: z.string().min(1, "Please select a subject"),
    moduleId: z.string().min(1, "Please select a module"),
    exerciseId: z.string().min(1, "Please select an exercise"),
    studentId: z.string().min(1, "Please select a student"),
});

export type GetStudentAssignmentFormData = z.infer<typeof formSchema>;

interface StudentAssignmentFiltersFormProps {
    onSubmit: (data: GetStudentAssignmentFormData) => void;
}

export const StudentAssignmentFiltersForm = ({ onSubmit }: StudentAssignmentFiltersFormProps) => {
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
    const [selectedModuleId, setSelectedModuleId] = useState<string>("");

    const form = useForm<GetStudentAssignmentFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subjectId: "",
            moduleId: "",
            exerciseId: "",
            studentId: "",
        },
    });

    const subjectsQuery = useCourseSubjects();
    const modulesQuery = useCourseModules(
        selectedSubjectId ? parseInt(selectedSubjectId) : 0,
        !!selectedSubjectId
    );
    const exercisesQuery = useCourseExercises(
        selectedModuleId ? parseInt(selectedModuleId) : 0,
        !!selectedSubjectId
    );
    const studentsQuery = useCourseStudents();

    const handleSubjectChange = (value: string) => {
        setSelectedSubjectId(value);
        form.setValue("subjectId", value);
        form.setValue("moduleId", "");
        form.setValue("exerciseId", "");
    };

    const handleModuleChange = (value: string) => {
        setSelectedModuleId(value);
        form.setValue("moduleId", value);
        form.setValue("exerciseId", "");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
                <FormField
                    control={form.control}
                    name="subjectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <HiveResourceSelect
                                    query={subjectsQuery}
                                    placeholder="Select a subject"
                                    label="Subject"
                                    value={field.value}
                                    onValueChange={handleSubjectChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="moduleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <HiveResourceSelect
                                    query={modulesQuery}
                                    placeholder="Select a module"
                                    label="Module"
                                    value={field.value}
                                    onValueChange={handleModuleChange}
                                    disabled={!selectedSubjectId}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="exerciseId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <HiveResourceSelect
                                    query={exercisesQuery}
                                    placeholder="Select an exercise"
                                    label="Exercise"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!selectedModuleId}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <HiveResourceSelect
                                    query={studentsQuery}
                                    placeholder="Select a student"
                                    label="Student"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={!form.formState.isValid} className="my-2">
                    Load Assignment
                </Button>
            </form>
        </Form>
    )
};
