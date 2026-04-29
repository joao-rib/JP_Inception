import { Suspense } from 'react'
import GamePageClient from './GamePageClient'

export default function GamePage() {
  return (
    <Suspense fallback={null}>
      <GamePageClient />
    </Suspense>
  )
}
