import { useState } from 'react'
import TableData from './TableData'
import { useAppSelector } from '../../../hooks'
import { getEllipsisTxt } from '../../../utils'
export interface IRank {
  profileImgUrl?: string
  walletAddress: string
  username: string
  win: number
  loss: number
}

export default function TableSection() {
  const [type, setType] = useState<'all-time' | 'fight-night'>('all-time')

  const leaderboardData = useAppSelector((state) => state.websiteStateStore.leaderboardData)

  const ranks: IRank[] = leaderboardData.tournament_data.map(
    (rank: { user_wallet_address: string; player_alias: string; wins_count: number; loss_count: number }) => {
      return {
        walletAddress: getEllipsisTxt(rank.user_wallet_address),
        username: rank.player_alias,
        win: rank.wins_count,
        loss: rank.loss_count,
      }
    },
  )

  return (
    <section className='table-section'>
      <div className='container'>
        <div className='h1-container'>
          <div onClick={() => setType('all-time')} className={`h1-wrapper ${type === 'all-time' ? 'active' : ''}`}>
            <h1 className='text'>All Time</h1>

            <h1 className='text-stroke'>All Time</h1>

            <h1 className='text-shadow'>All Time</h1>
          </div>

          <div onClick={() => setType('fight-night')} className={`h1-wrapper ${type === 'fight-night' ? 'active' : ''}`}>
            <h1 className='text'>Fight Night</h1>

            <h1 className='text-stroke'>Fight Night</h1>

            <h1 className='text-shadow'>Fight Night</h1>
          </div>
        </div>

        {type === 'fight-night' && (
          <div className='timer-box'>
            <p>Game time: 00:00:00</p>
          </div>
        )}

        <TableData ranks={ranks} />
      </div>
    </section>
  )
}
