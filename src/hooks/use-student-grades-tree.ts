import { useQuery } from '@tanstack/react-query'
import type { CourseExercise, CourseModule, CourseSubject } from '@/types/api'
import {
  getCourseAssignments,
  getCourseExercises,
  getCourseModules,
  getCourseSubjects,
} from '@/lib/api/course'
import {
  getStudentAssignmentGrade,
  getStudentModuleGrade,
} from '@/lib/api/grades'

export type GradesExercise = {
  id: number
  name: string
  grade: number
}

export type GradesModule = {
  id: number
  name: string
  grade: number
  exercises: Array<GradesExercise>
}

export type GradesSubject = {
  id: number
  name: string
  grade: number
  modules: Array<GradesModule>
}

export type GradesTree = {
  overall: number
  subjects: Array<GradesSubject>
}

export const useStudentGradesTree = (studentId: number) => {
  return useQuery<GradesTree>({
    queryKey: ['grades', 'tree', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const subjects: Array<CourseSubject> = await getCourseSubjects()

      const subjectsWithGrades: Array<GradesSubject> = await Promise.all(
        subjects.map(async (subject) => {
          const modules: Array<CourseModule> = await getCourseModules({
            subject_id: subject.id,
          })

          const modulesWithGrades: Array<GradesModule> = await Promise.all(
            modules.map(async (module) => {
              const exercises: Array<CourseExercise> = await getCourseExercises(
                { module_id: module.id },
              )

              const exercisesWithGrades: Array<GradesExercise> =
                await Promise.all(
                  exercises.map(async (exercise) => {
                    try {
                      const assignment = await getCourseAssignments({
                        exercise_id: exercise.id,
                        student_id: studentId,
                      })
                      if (assignment.id) {
                        const exerciseGrade = await getStudentAssignmentGrade({
                          assignment_id: assignment.id,
                          student_id: studentId,
                        })
                        return {
                          id: exercise.id,
                          name: exercise.name,
                          grade: exerciseGrade || 0,
                        }
                      }
                      return { id: exercise.id, name: exercise.name, grade: 0 }
                    } catch {
                      return { id: exercise.id, name: exercise.name, grade: 0 }
                    }
                  }),
                )

              let moduleGrade = 0
              try {
                moduleGrade = await getStudentModuleGrade({
                  student_id: studentId,
                  module_id: module.id,
                })
              } catch {
                moduleGrade = 0
              }

              return {
                id: module.id,
                name: module.name,
                grade: moduleGrade || 0,
                exercises: exercisesWithGrades,
              }
            }),
          )

          const validModules = modulesWithGrades.filter((m) => m.grade > 0)
          const subjectGrade =
            validModules.length > 0
              ? validModules.reduce((sum, m) => sum + m.grade, 0) /
                validModules.length
              : 0

          return {
            id: subject.id,
            name: subject.name,
            grade: subjectGrade,
            modules: modulesWithGrades,
          }
        }),
      )

      const validSubjects = subjectsWithGrades.filter((s) => s.grade > 0)
      const overall =
        validSubjects.length > 0
          ? (validSubjects.reduce((sum, s) => sum + s.grade, 0) /
              validSubjects.length) *
            10
          : 0

      return { overall, subjects: subjectsWithGrades }
    },
  })
}
