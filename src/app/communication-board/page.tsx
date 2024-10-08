import { CommunicationBoardComponent } from '@/components/communication-board'

export default function CommunicationBoardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Communication Board</h1>
      <CommunicationBoardComponent />
    </main>
  )
}