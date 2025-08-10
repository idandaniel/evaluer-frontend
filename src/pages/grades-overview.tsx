import { Loader2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GradesTreeView } from '@/components/grades-tree'
import { HiveResourceSelect } from '@/components/hive-resource-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCourseStudents } from '@/hooks/use-course-student'
import { useStudentGradesTree } from '@/hooks/use-student-grades-tree'

export const GradesOverviewPage = () => {
  const [studentId, setStudentId] = useState<string>('')
  const studentsQuery = useCourseStudents()
  const {
    data: gradesTree,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useStudentGradesTree(studentId ? parseInt(studentId) : 0)

  useEffect(() => {
    if (studentId) refetch()
  }, [studentId, refetch])

  const showRefresh = !!gradesTree && !!studentId && !error

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
        <HiveResourceSelect
          query={studentsQuery}
          placeholder="Select a student"
          label="Student"
          value={studentId}
          onValueChange={setStudentId}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Grades Overview
            {showRefresh && (
              <Button
                onClick={() => refetch()}
                size="sm"
                variant="ghost"
                disabled={isFetching}
                aria-label="Refresh grades"
              >
                {isFetching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RotateCcw className="size-4" />
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8">
          {!studentId ? (
            <div className="py-8 sm:py-12 text-center text-muted-foreground">
              Please select a student.
            </div>
          ) : isLoading ? (
            <div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="py-8 sm:py-12 text-center text-destructive">
              Error loading grades: {error.message}
            </div>
          ) : gradesTree ? (
            <GradesTreeView data={gradesTree} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
