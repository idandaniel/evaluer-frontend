import { useState } from 'react'
import type {
  AssignmentResponse,
  AssignmentResponseFiles,
  CourseAssignment,
} from '@/types/api'

import { FileRenderer } from '@/components/file-renderer'
import { ResponseGradeInput } from '@/components/response-grade-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatFileSize } from '@/lib/utils'

interface StudentAssignmentDisplayProps {
  assignment: CourseAssignment | null
  assignmentGrade: number | null
  assignmentResponses: Array<AssignmentResponse> | null
  assignmentResponsesFiles: Array<AssignmentResponseFiles> | null
  studentId: number
  moduleId: number
  subjectId: number
}

export const StudentAssignmentDisplay = ({
  assignment,
  assignmentGrade,
  assignmentResponses,
  assignmentResponsesFiles,
  studentId,
  moduleId,
  subjectId,
}: StudentAssignmentDisplayProps) => {
  const [selectedFiles, setSelectedFiles] = useState<Record<number, number>>({})

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getResponseTypeVariant = (
    type: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (type) {
      case 'Done':
        return 'default'
      case 'Submission':
      case 'Work In Progress':
      case 'AutoCheck':
        return 'secondary'
      case 'Redo':
        return 'destructive'
      case 'Comment':
      default:
        return 'outline'
    }
  }

  const getGradeColor = (grade: number | null): string => {
    if (grade === null) return 'bg-gray-100 text-gray-800'
    if (grade >= 8) return 'bg-green-100 text-green-800 hover:bg-green-200'
    if (grade >= 6) return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    return 'bg-red-100 text-red-800 hover:bg-red-200'
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('text/')) return '📄'
    if (mimeType.includes('pdf')) return '📕'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦'
    if (mimeType.includes('json')) return '📋'
    if (mimeType.includes('xml')) return '📰'
    return '📎'
  }

  const selectFile = (responseId: number, fileIndex: number) => {
    setSelectedFiles((prev) => ({ ...prev, [responseId]: fileIndex }))
  }

  const isLoading = !assignmentResponses || !assignmentResponsesFiles

  if (!assignment) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Assignment data not available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-6">
      <Card>
        <CardHeader>
          {isLoading ? (
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          ) : (
            <>
              <CardTitle className="w-full flex items-start justify-between">
                Student Responses ({assignmentResponses.length})
                <Badge className={getGradeColor(assignmentGrade)}>
                  {assignmentGrade?.toFixed(1)} / 10
                </Badge>
              </CardTitle>
              <CardDescription>
                All responses submitted for this assignment
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4 sm:space-y-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Skeleton className="h-5 w-20 mb-2" />
                      <div className="space-y-2">
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col gap-1 mb-3 sm:flex-row sm:items-center sm:gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="border rounded-lg overflow-hidden bg-white">
                        {[...Array(2)].map((__, fileIndex) => (
                          <div
                            key={fileIndex}
                            className="flex flex-col gap-2 p-3 border-b border-slate-200 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="h-3 w-12" />
                          </div>
                        ))}
                        <div className="p-4 sm:p-8">
                          <Skeleton className="h-32 w-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : assignmentResponses.length === 0 ? (
            <p className="text-muted-foreground">No responses found.</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {assignmentResponses.map((response, index) => {
                const responseFiles = assignmentResponsesFiles.find(
                  (f) => f.response_id === response.id,
                )

                return (
                  <Card key={response.id} className="border">
                    <CardHeader>
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                        <CardTitle className="text-lg flex flex-col gap-1">
                          <div className="flex items-start justify-start gap-4 h-min">
                            <p>Response {index + 1}</p>
                            <Badge
                              className="h-min text-xs self-center"
                              variant={getResponseTypeVariant(
                                response.response_type,
                              )}
                            >
                              {response.response_type}
                            </Badge>
                          </div>
                          {response.response_type === 'Redo' && (
                            <ResponseGradeInput
                              responseId={response.id}
                              assignmentId={assignment.id}
                              studentId={studentId}
                              moduleId={moduleId}
                              subjectId={subjectId}
                            />
                          )}
                        </CardTitle>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(response.date)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {response.contents.length > 0 ? (
                        <div>
                          <div className="space-y-2">
                            {response.contents.map(
                              ({ content }, contentIndex) => (
                                <div
                                  key={contentIndex}
                                  className="bg-muted p-3 rounded text-sm border"
                                >
                                  <div className="whitespace-pre-wrap break-words">
                                    {content}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted p-3 rounded text-sm border">
                          <div className="whitespace-pre-wrap break-words">
                            {`No content`}
                          </div>
                        </div>
                      )}

                      {responseFiles && responseFiles.has_files && (
                        <div>
                          <h4 className="font-medium mb-3">
                            Files ({responseFiles.files.length})
                            <span className="block font-normal text-sm text-muted-foreground mt-1 sm:inline sm:ml-2 sm:mt-0">
                              Total size:{' '}
                              {formatFileSize(responseFiles.total_size)}
                            </span>
                          </h4>
                          <div className="border rounded-lg overflow-hidden bg-white">
                            {responseFiles.files.map((file, fileIndex) => {
                              const isSelected =
                                (selectedFiles[response.id] ?? 0) === fileIndex
                              return (
                                <Button
                                  key={fileIndex}
                                  onClick={() =>
                                    selectFile(response.id, fileIndex)
                                  }
                                  variant={isSelected ? 'default' : 'outline'}
                                  className={`flex flex-col gap-2 p-3 h-auto w-full rounded-none border-0 border-b border-slate-200 last:border-b-0 sm:flex-row sm:items-center sm:justify-between ${
                                    isSelected ? '' : 'hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <span className="text-base">
                                      {getFileIcon(file.mime_type)}
                                    </span>
                                    <span className="font-medium text-sm truncate">
                                      {file.name}
                                    </span>
                                    <Badge
                                      variant={
                                        isSelected ? 'secondary' : 'outline'
                                      }
                                    >
                                      {file.mime_type}
                                    </Badge>
                                  </div>
                                  <span
                                    className={`text-xs self-start sm:self-center ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}
                                  >
                                    {formatFileSize(file.size)}
                                  </span>
                                </Button>
                              )
                            })}

                            <div>
                              {responseFiles.files.length > 0 ? (
                                <FileRenderer
                                  file={
                                    responseFiles.files[
                                      selectedFiles[response.id] ?? 0
                                    ]
                                  }
                                />
                              ) : (
                                <div className="p-4 text-center text-muted-foreground sm:p-8">
                                  No files available
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const StudentAssignmentDisplaySkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="border">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1 mb-3 sm:flex-row sm:items-center sm:gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="border rounded-lg overflow-hidden bg-white">
                  {[...Array(2)].map((__, fileIndex) => (
                    <div
                      key={fileIndex}
                      className="flex flex-col gap-2 p-3 border-b border-slate-200 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-3 w-12" />
                    </div>
                  ))}
                  <div className="p-4 sm:p-8">
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
