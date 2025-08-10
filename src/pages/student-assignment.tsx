import { useState } from 'react'
import type { GetStudentAssignmentFormData } from '@/components/student-assignment-filters-form'
import {
  StudentAssignmentDisplay,
  StudentAssignmentDisplaySkeleton,
} from '@/components/student-assignment-display'
import { StudentAssignmentFiltersForm } from '@/components/student-assignment-filters-form'
import { Card, CardContent } from '@/components/ui/card'
import { useStudentAssignment } from '@/hooks/use-student-assignment'

export const StudentAssignmentPage = () => {
  const [exerciseId, setExerciseId] = useState<number | null>(null)
  const [studentId, setStudentId] = useState<number | null>(null)
  const [moduleId, setModuleId] = useState<number | null>(null)
  const [subjectId, setSubjectId] = useState<number | null>(null)

  const {
    assignment,
    assignmentGrade,
    assignmentResponses,
    assignmentResponsesFiles,
    isLoading,
    error,
  } = useStudentAssignment(exerciseId ?? 0, studentId ?? 0)

  const handleFormSubmit = (filters: GetStudentAssignmentFormData) => {
    try {
      setExerciseId(parseInt(filters.exerciseId))
      setStudentId(parseInt(filters.studentId))
      setModuleId(parseInt(filters.moduleId))
      setSubjectId(parseInt(filters.subjectId))
    } catch (e) {
      console.error('Failed to fetch assignment:', e)
    }
  }
  return (
    <div className="space-y-6 sm:space-y-8">
      <StudentAssignmentFiltersForm onSubmit={handleFormSubmit} />
      <div className="w-full">
        {!(exerciseId && studentId) ? (
          <Card>
            <CardContent className="py-8 sm:py-12">
              <div className="text-center text-muted-foreground">
                Please select an exercise and a student to view the assignment.
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <StudentAssignmentDisplaySkeleton />
        ) : error ? (
          <Card>
            <CardContent className="py-8 sm:py-12 text-center">
              <div className="text-destructive">
                Error loading assignment: {error.message}
              </div>
            </CardContent>
          </Card>
        ) : assignment && assignmentGrade !== undefined ? (
          <StudentAssignmentDisplay
            assignment={assignment}
            assignmentGrade={assignmentGrade}
            assignmentResponses={assignmentResponses}
            assignmentResponsesFiles={assignmentResponsesFiles}
            studentId={studentId}
            moduleId={moduleId ?? 0}
            subjectId={subjectId ?? 0}
          />
        ) : (
          <Card>
            <CardContent className="py-8 sm:py-12">
              <div className="text-center text-muted-foreground">
                No assignment found
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
