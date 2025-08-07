import { useQueries, useQuery } from '@tanstack/react-query'
import type {
  AssignmentResponse,
  AssignmentResponseFiles,
  CourseAssignment,
} from '@/types/api'
import {
  getAssignmentResponseFiles,
  getCourseAssignmentResponses,
  getCourseAssignments,
} from '@/lib/api/course'
import { getStudentAssignmentGrade } from '@/lib/api/grades'

interface UseStudentAssignmentReturn {
  assignment: CourseAssignment | undefined
  assignmentResponses: Array<AssignmentResponse>
  assignmentResponsesFiles: Array<AssignmentResponseFiles>
  assignmentGrade: number | undefined
  isLoading: boolean
  error: Error | null
}

export const useStudentAssignment = (
  exerciseId: number,
  studentId: number,
): UseStudentAssignmentReturn => {
  const assignmentQuery = useQuery({
    queryKey: ['assignments', exerciseId, studentId] as const,
    queryFn: () =>
      getCourseAssignments({
        exercise_id: exerciseId,
        student_id: studentId,
      }),
  })

  const assignmentId = assignmentQuery.data?.id

  const assignmentResponsesQuery = useQuery({
    queryKey: ['assignment', 'responses', assignmentId] as const,
    queryFn: async (): Promise<Array<AssignmentResponse>> => {
      if (assignmentId === undefined) return []
      return getCourseAssignmentResponses(assignmentId)
    },
    enabled: !!assignmentId,
  })

  const assignmentResponsesFilesQuery = useQueries({
    queries: (assignmentResponsesQuery.data ?? []).map((response) => ({
      queryKey: ['assignment', 'response', 'files', response.id] as const,
      queryFn: async (): Promise<AssignmentResponseFiles | null> => {
        if (assignmentId === undefined) return null
        return getAssignmentResponseFiles(assignmentId, response.id)
      },
      enabled: !!assignmentId && !!response.id,
    })),
  })

  const assignmentGradeQuery = useQuery({
    queryKey: ['grades', 'assignment', assignmentId, studentId] as const,
    queryFn: async (): Promise<number | undefined> => {
      if (assignmentId === undefined) return undefined
      return getStudentAssignmentGrade({
        assignment_id: assignmentId,
        student_id: studentId,
      })
    },
    enabled: !!assignmentId && !!studentId,
  })

  const assignmentResponsesFiles = assignmentResponsesFilesQuery
    .map((query) => query.data)
    .filter(
      (data): data is AssignmentResponseFiles =>
        data !== null && data !== undefined,
    )

  const isAnyFileQueryLoading = assignmentResponsesFilesQuery.some(
    (q) => q.isLoading,
  )
  const fileQueryError = assignmentResponsesFilesQuery.find(
    (q) => q.error,
  )?.error

  return {
    assignment: assignmentQuery.data,
    assignmentResponses: assignmentResponsesQuery.data ?? [],
    assignmentResponsesFiles,
    assignmentGrade: assignmentGradeQuery.data,
    isLoading:
      assignmentQuery.isLoading ||
      (assignmentQuery.isSuccess && assignmentResponsesQuery.isLoading) ||
      (assignmentResponsesQuery.isSuccess && isAnyFileQueryLoading) ||
      (assignmentQuery.isSuccess && assignmentGradeQuery.isLoading),
    error:
      assignmentQuery.error ||
      assignmentResponsesQuery.error ||
      assignmentGradeQuery.error ||
      fileQueryError ||
      null,
  }
}
