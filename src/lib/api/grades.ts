import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  StudentAssignmentGradeParams,
  StudentAssignmentResponseGradeParams,
  StudentModuleGradeParams,
  StudentOverallGradeParams,
  UpdateAssignmentGradeRequest,
} from '@/types/api'
import { apiRequest, buildQueryString } from '@/lib/api/client'

export async function getStudentAssignmentResponseGrade(
  params: StudentAssignmentResponseGradeParams,
): Promise<number> {
  const { assignment_id, response_id, student_id } = params
  const queryString = buildQueryString({ student_id })
  return apiRequest<number>(
    `/grades/assignments/${assignment_id}/responses/${response_id}?${queryString}`,
  )
}

export async function getStudentAssignmentGrade(
  params: StudentAssignmentGradeParams,
): Promise<number> {
  const { assignment_id, student_id } = params
  const queryString = buildQueryString({ student_id })
  return apiRequest<number>(
    `/grades/assignments/${assignment_id}?${queryString}`,
  )
}

export async function getStudentModuleGrade(
  params: StudentModuleGradeParams,
): Promise<number> {
  const queryString = buildQueryString(params)
  return apiRequest<number>(`/grades/modules?${queryString}`)
}

export async function getStudentOverallGrade(
  params: StudentOverallGradeParams,
): Promise<number> {
  const queryString = buildQueryString(params)
  return apiRequest<number>(`/grades/overall?${queryString}`)
}

export async function updateStudentAssignmentResponseGrade(
  request: UpdateAssignmentGradeRequest,
): Promise<void> {
  return apiRequest<void>('/grades/assignment', {
    method: 'PUT',
    body: JSON.stringify(request),
  })
}

export function useStudentAssignmentResponseGrade(
  params: StudentAssignmentResponseGradeParams,
) {
  return useQuery({
    queryKey: [
      'grades',
      'assignment-response',
      params.assignment_id,
      params.response_id,
      params.student_id,
    ],
    queryFn: () => getStudentAssignmentResponseGrade(params),
    enabled:
      !!params.assignment_id && !!params.response_id && !!params.student_id,
  })
}

export function useStudentAssignmentGrade(
  params: StudentAssignmentGradeParams,
) {
  return useQuery({
    queryKey: ['grades', 'assignment', params.assignment_id, params.student_id],
    queryFn: () => getStudentAssignmentGrade(params),
    enabled: !!params.assignment_id && !!params.student_id,
  })
}

export function useStudentModuleGrade(params: StudentModuleGradeParams) {
  return useQuery({
    queryKey: ['grades', 'module', params.module_id, params.student_id],
    queryFn: () => getStudentModuleGrade(params),
    enabled: !!params.module_id && !!params.student_id,
  })
}

export function useStudentOverallGrade(params: StudentOverallGradeParams) {
  return useQuery({
    queryKey: ['grades', 'overall', params.student_id],
    queryFn: () => getStudentOverallGrade(params),
    enabled: !!params.student_id,
  })
}

export function useUpdateAssignmentGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStudentAssignmentResponseGrade,
    onSuccess: (_, variables) => {
      // Invalidate related queries when grade is updated
      queryClient.invalidateQueries({
        queryKey: [
          'grades',
          'assignment-response',
          variables.assignment_id,
          variables.response_id,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: ['grades', 'assignment', variables.assignment_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['grades', 'module', variables.module_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['grades', 'overall', variables.student_id],
      })
    },
  })
}
