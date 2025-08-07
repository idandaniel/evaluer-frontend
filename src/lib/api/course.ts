import type {
  AssignmentResponse,
  AssignmentResponseFiles,
  CourseAssignment,
  CourseAssignmentsParams,
  CourseExercise,
  CourseExercisesParams,
  CourseModule,
  CourseModulesParams,
  CourseStudent,
  CourseSubject,
} from '@/types/api'
import { apiRequest, buildQueryString } from '@/lib/api/client'

export async function getCourseSubjects(): Promise<Array<CourseSubject>> {
  return apiRequest<Array<CourseSubject>>('/course/subjects')
}

export async function getCourseStudents(): Promise<Array<CourseStudent>> {
  return apiRequest<Array<CourseStudent>>('/course/students')
}

export async function getCourseModules(
  params: CourseModulesParams,
): Promise<Array<CourseModule>> {
  const queryString = buildQueryString(params)
  return apiRequest<Array<CourseModule>>(`/course/modules?${queryString}`)
}

export async function getCourseExercises(
  params: CourseExercisesParams,
): Promise<Array<CourseExercise>> {
  const queryString = buildQueryString(params)
  return apiRequest<Array<CourseExercise>>(`/course/exercises?${queryString}`)
}

export async function getCourseAssignments(
  params: CourseAssignmentsParams,
): Promise<CourseAssignment> {
  const queryString = buildQueryString(params)
  return apiRequest<CourseAssignment>(`/course/assignments?${queryString}`)
}

export async function getCourseAssignmentResponses(
  assignmentId: number,
): Promise<Array<AssignmentResponse>> {
  return apiRequest<Array<AssignmentResponse>>(
    `/course/assignments/${assignmentId}/responses`,
  )
}

export async function getAssignmentResponseFiles(
  assignmentId: number,
  responseId: number,
): Promise<AssignmentResponseFiles> {
  return apiRequest<AssignmentResponseFiles>(
    `/course/assignments/${assignmentId}/responses/${responseId}/files`,
  )
}
