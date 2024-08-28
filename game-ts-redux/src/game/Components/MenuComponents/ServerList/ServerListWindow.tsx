import { useAppSelector } from '../../../../hooks'
import { ServerListInfo } from './ServerListInfo'
import './ServerListWindow.css'

export function ServerListWindow() {
  const showServersList = useAppSelector((state) => state.websiteStateStore.showGameServersList)
  const showing_jackpot_wheel = useAppSelector((state) => state.websiteStateStore.showing_jackpot_wheel)
  return (
    <>
      {showServersList && !showing_jackpot_wheel && (
        <div className='server-list-window-component'>
          <ServerListInfo />
        </div>
      )}
    </>
  )
}
