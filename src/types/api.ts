export type AssignmentResponseType =
  | 'Comment'
  | 'Work In Progress'
  | 'Submission'
  | 'AutoCheck'
  | 'Redo'
  | 'Done'

export interface AssignmentResponseContent {
  content: string
  field: number
}

export interface AssignmentResponse {
  id: number
  user: number
  assignment_id: number
  contents: Array<AssignmentResponseContent>
  file_name?: string | null
  date: string
  response_type: AssignmentResponseType
  autocheck_statuses?: Array<unknown> | null
}

export interface FileInfo {
  name: string
  size: number
  content: string
  mime_type: string
}

export interface AssignmentResponseFiles {
  response_id: number
  files: Array<FileInfo>
  has_files: boolean
  total_size: number
}

export interface UpdateAssignmentGradeRequest {
  student_id: number
  response_id: number
  assignment_id: number
  module_id: number
  subject_id: number
  new_grade: number // Between 1 and 10
}

export interface ValidationError {
  loc: Array<string | number>
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: Array<ValidationError>
}

export interface CourseModulesParams {
  subject_id: number
}

export interface CourseExercisesParams {
  module_id: number
}

export interface CourseAssignmentsParams {
  exercise_id: number
  student_id: number
}

export interface StudentAssignmentResponseGradeParams {
  assignment_id: number
  response_id: number
  student_id: number
}

export interface StudentAssignmentGradeParams {
  assignment_id: number
  student_id: number
}

export interface StudentModuleGradeParams {
  student_id: number
  module_id: number
}

export interface StudentOverallGradeParams {
  student_id: number
}

export interface HiveResource {
  id: number
  name: string
}

export interface CourseSubject extends HiveResource {
  id: number
  name: string
}

export interface CourseStudent extends HiveResource {
  username: string
  first_name: string
  last_name: string
}

export interface CourseModule extends HiveResource {
  subject_id: number
}

export interface CourseExercise extends HiveResource {
  module_id: number
}

export interface CourseAssignment extends HiveResource {
  exercise_id: number
}
