import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { GradesTree as GradesTreeData } from '@/hooks/use-student-grades-tree'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GradesTreeProps {
  data: GradesTreeData
}

export const GradesTreeView = ({ data }: GradesTreeProps) => {
  const [openSubjects, setOpenSubjects] = useState<
    Partial<Record<number, boolean>>
  >({})
  const [openModules, setOpenModules] = useState<
    Partial<Record<number, boolean>>
  >({})

  const subjectIds = useMemo(() => data.subjects.map((s) => s.id), [data])
  const moduleIds = useMemo(
    () => data.subjects.flatMap((s) => s.modules.map((m) => m.id)),
    [data],
  )

  useEffect(() => {
    setOpenSubjects((prev) => {
      const next: Partial<Record<number, boolean>> = { ...prev }
      data.subjects.forEach((s) => {
        if (next[s.id] === undefined) next[s.id] = true
      })
      return next
    })
    setOpenModules((prev) => {
      const next: Partial<Record<number, boolean>> = { ...prev }
      data.subjects.forEach((s) => {
        s.modules.forEach((m) => {
          if (next[m.id] === undefined) next[m.id] = true
        })
      })
      return next
    })
  }, [data])

  const expandAll = () => {
    const allSubjects: Record<number, boolean> = {}
    subjectIds.forEach((id) => (allSubjects[id] = true))
    const allModules: Record<number, boolean> = {}
    moduleIds.forEach((id) => (allModules[id] = true))
    setOpenSubjects(allSubjects)
    setOpenModules(allModules)
  }

  const collapseAll = () => {
    const allSubjects: Record<number, boolean> = {}
    subjectIds.forEach((id) => (allSubjects[id] = false))
    const allModules: Record<number, boolean> = {}
    moduleIds.forEach((id) => (allModules[id] = false))
    setOpenSubjects(allSubjects)
    setOpenModules(allModules)
  }

  const toggleSubject = (id: number) =>
    setOpenSubjects((prev) => ({ ...prev, [id]: !prev[id] }))
  const toggleModule = (id: number) =>
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }))

  const gradeBadgeClass = (grade: number, scale: '10' | '100' = '10') => {
    const g = grade
    if (scale === '100') {
      if (g >= 90) return 'bg-green-100 text-green-800'
      if (g >= 70) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    }
    if (g >= 8) return 'bg-green-100 text-green-800'
    if (g >= 6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Overall</div>
        <Badge className={gradeBadgeClass(data.overall, '100')}>
          {data.overall.toFixed(1)} / 100
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={expandAll}>
          Expand all
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>
          Collapse all
        </Button>
      </div>

      <div className="space-y-3">
        {data.subjects.map((subject) => {
          const modulesCount = subject.modules.length
          const exercisesCount = subject.modules.reduce(
            (sum, m) => sum + m.exercises.length,
            0,
          )
          return (
            <div key={subject.id} className="border rounded-md">
              <button
                type="button"
                onClick={() => toggleSubject(subject.id)}
                aria-expanded={!!openSubjects[subject.id]}
                className={cn(
                  'w-full flex items-center justify-between p-3 transition',
                  'hover:bg-accent/50',
                )}
              >
                <div className="flex items-center gap-2">
                  {openSubjects[subject.id] ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                  <span className="text-left font-medium">{subject.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {modulesCount} modules • {exercisesCount} exercises
                  </span>
                </div>
                <Badge className={gradeBadgeClass(subject.grade)}>
                  {subject.grade.toFixed(1)} / 10
                </Badge>
              </button>

              {openSubjects[subject.id] && (
                <div className="p-3 pt-0 space-y-3">
                  {subject.modules.map((module) => (
                    <div key={module.id} className="border rounded-md">
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        aria-expanded={!!openModules[module.id]}
                        className={cn(
                          'w-full flex items-center justify-between p-3 transition',
                          'hover:bg-accent/50',
                        )}
                      >
                        <div className="flex items-center gap-2 pl-5">
                          {openModules[module.id] ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                          <span className="text-left">{module.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {module.exercises.length} exercises
                          </span>
                        </div>
                        <Badge className={gradeBadgeClass(module.grade)}>
                          {module.grade.toFixed(1)} / 10
                        </Badge>
                      </button>

                      {openModules[module.id] && (
                        <div className="px-3 pb-3">
                          <div className="mt-2 pl-9 border-l space-y-2">
                            {module.exercises.map((exercise) => (
                              <div
                                key={exercise.id}
                                className="flex items-center justify-between"
                              >
                                <div className="text-sm text-muted-foreground">
                                  {exercise.name}
                                </div>
                                <Badge
                                  className={gradeBadgeClass(exercise.grade)}
                                >
                                  {exercise.grade.toFixed(1)} / 10
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
