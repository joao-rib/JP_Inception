import { useRouter } from 'next/navigation'
import { Status } from '../../constants';
import { useAppContext }from '@/app/contexts/Context'
import './GameEnds.css'

const GameEnds = () => {

    const router = useRouter()
    const { appState : {status} } = useAppContext();
    
    if (status === Status.ongoing || status === Status.promoting)
        return null

    const returnToLobby = () => {
        router.replace('/game/lobby')
    }

    const isWin = status.endsWith('wins')

    return <div className="popup--inner popup--inner__center">
        <h1>{isWin ? status : 'Draw'}</h1>
        <p>{!isWin && status}</p>
        <div className={`${status}`}/>
        <button onClick={returnToLobby}>Return to lobby</button>
    </div>
   
}

export default GameEnds
