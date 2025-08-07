import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useStudentAssignmentResponseGrade,
  useUpdateAssignmentGrade,
} from '@/lib/api/grades'

interface ResponseGradeInputProps {
  responseId: number
  assignmentId: number
  studentId: number
  moduleId: number
  subjectId: number
}

export const ResponseGradeInput = ({
  responseId,
  assignmentId,
  studentId,
  moduleId,
  subjectId,
}: ResponseGradeInputProps) => {
  const [grade, setGrade] = useState<string>('')

  const { data: currentGrade, isLoading: isLoadingGrade } =
    useStudentAssignmentResponseGrade({
      assignment_id: assignmentId,
      response_id: responseId,
      student_id: studentId,
    })

  const updateGradeMutation = useUpdateAssignmentGrade()

  const handleSubmit = () => {
    const gradeValue = parseInt(grade)
    if (gradeValue >= 1 && gradeValue <= 10) {
      updateGradeMutation.mutate({
        student_id: studentId,
        response_id: responseId,
        assignment_id: assignmentId,
        module_id: moduleId,
        subject_id: subjectId,
        new_grade: gradeValue,
      })
      setGrade('')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (
      value === '' ||
      (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 10)
    ) {
      setGrade(value)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-sm text-muted-foreground ps-1 font-light">
        {isLoadingGrade
          ? 'N/A'
          : currentGrade
            ? `Current Grade: ${currentGrade} /10`
            : 'Not graded'}
      </p>
      <div className="flex gap-2">
        <Input
          type="number"
          value={grade}
          onChange={handleInputChange}
          placeholder={currentGrade?.toString() ?? 'Enter grade'}
          min="1"
          max="10"
        />
        <Button
          onClick={handleSubmit}
          disabled={!grade || updateGradeMutation.isPending}
          size="sm"
        >
          {updateGradeMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Update'
          )}
        </Button>
      </div>
    </div>
  )
}
