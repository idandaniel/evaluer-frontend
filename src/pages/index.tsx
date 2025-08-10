import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentAssignmentPage } from '@/pages/student-assignment'
import { GradesOverviewPage } from '@/pages/grades-overview'

export const HomePage = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="container mx-auto max-w-4xl py-6">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Evaluer
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Evaluate the shit out of your students, with ease.
            </p>
          </div>

          <Tabs
            defaultValue="student-assignment"
            className="space-y-6 sm:space-y-8"
          >
            <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-none sm:flex">
              <TabsTrigger
                value="student-assignment"
                className="text-xs sm:text-sm"
              >
                Student Assignment
              </TabsTrigger>
              <TabsTrigger
                value="grades-overview"
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Grades Overview</span>
                <Badge variant="outline" className="ml-1 sm:ml-2">
                  Soon
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="student-assignment">
              <StudentAssignmentPage />
            </TabsContent>
            <TabsContent value="grades-overview">
              <GradesOverviewPage />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
