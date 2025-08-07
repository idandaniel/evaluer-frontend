import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex h-100dvh flex-col items-center justify-center">
      <HomePage />
    </div>
  )
}
