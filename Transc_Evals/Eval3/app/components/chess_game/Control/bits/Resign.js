import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '@/app/contexts/Context'
import { Status } from '../../constants'

const Resign = () => {
  const {
    appState: { status },
    onlineGame,
  } = useAppContext()
  const [hasSentResign, setHasSentResign] = useState(false)

  const isGameOver = useMemo(() => {
    return status !== Status.ongoing && status !== Status.promoting
  }, [status])

  useEffect(() => {
    if (!isGameOver) {
      setHasSentResign(false)
    }
  }, [isGameOver])

  const isDisabled = hasSentResign || isGameOver

  const handleResign = () => {
    if (isDisabled) {
      return
    }

    if (onlineGame?.isOnlineGame) {
      setHasSentResign(true)
      onlineGame.resignGame()
      return
    }

    console.log('Resign clicked')
  }

  return (
    <div>
      <button className='resign-btn' onClick={handleResign} disabled={isDisabled}>
        Resign
      </button>
    </div>
  )
}

export default Resign
