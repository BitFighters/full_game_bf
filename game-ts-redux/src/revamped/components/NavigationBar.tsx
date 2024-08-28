import { useState } from 'react'
import { Link } from 'react-router-dom'
import shortLogoImg from '../assets/images/short-logo.webp'
import SocialLinks from './SocialLinks'
import avatarImg1 from '../assets/images/avatar-1.webp'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import { getEllipsisTxt } from '../../utils'

function NoticeBox() {
  return (
    <Link to={'/news'} className='notice-box'>
      <div className='left-area'>
        <p>Attention!:</p>
      </div>
      <div className='right-area'>
        <div className='marquee'>
          {[...Array(20)].map((_, index) => (
            <p key={index}>New FIGHT NIGHT series, coming soon!</p>
          ))}
        </div>
      </div>
    </Link>
  )
}

function Menu() {
  const location = useLocation()

  return (
    <ul>
      <li className={`${location.pathname === '/' ? 'active' : ''}`}>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>

        <Link to={'/'}>
          <svg width='11' height='12' viewBox='0 0 11 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_243_867)'>
              <path
                d='M10.0827 5.54168V6.45834H9.62435V6.91668H9.16602V7.37501H8.24935V7.83334H7.33268V8.29168H6.87435V8.75001H5.95768V9.20834H5.04102V9.66668H4.58268V10.125H3.66602V10.5833H2.74935V11.0417H1.37435V10.5833H0.916016V1.41668H1.37435V0.958344H2.74935V1.41668H3.66602V1.87501H4.58268V2.33334H5.04102V2.79168H5.95768V3.25001H6.87435V3.70834H7.33268V4.16668H8.24935V4.62501H9.16602V5.08334H9.62435V5.54168H10.0827Z'
                fill='white'
              />
            </g>
            <defs>
              <clipPath id='clip0_243_867'>
                <rect width='11' height='11' fill='white' transform='translate(0 0.5)' />
              </clipPath>
            </defs>
          </svg>

          <span>Game</span>
        </Link>
      </li>

      <li className={`${location.pathname === '/mint' ? 'active' : ''}`}>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>

        <Link to={'/mint'}>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M7.99935 7.33334H8.66602V14.6667H7.33268V10H4.66602V9.33334H3.33268V8.66668H2.66602V8.00001H1.99935V6.66668H1.33268V5.33334H0.666016V3.33334H3.99935V4.00001H5.33268V4.66668H6.66602V5.33334H7.33268V6.00001H7.99935V7.33334Z'
              fill='white'
            />
            <path
              d='M15.3333 1.33334V4.00001H14.6667V5.33334H14V6.00001H13.3333V6.66668H12V7.33334H10.6667V8.00001H9.33333V6.66668H8.66667V5.33334H8V4.00001H8.66667V3.33334H9.33333V2.66668H10.6667V2.00001H12V1.33334H15.3333Z'
              fill='white'
            />
          </svg>

          <span>Mint</span>
        </Link>
      </li>

      <li>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>

        <Link to={'https://joepegs.com/collections/avalanche/bit-fighters-gen-0'} target='_blank'>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M6 12.6667H6.66667V14H6V14.6667H4.66667V14H4V12.6667H4.66667V12H6V12.6667Z' fill='white' />
            <path d='M13.334 12.6667H14.0007V14H13.334V14.6667H12.0007V14H11.334V12.6667H12.0007V12H13.334V12.6667Z' fill='white' />
            <path
              d='M15.3327 2.00001V4.00001H14.666V6.00001H13.9993V8.00001H13.3327V8.66668H5.33268V10H13.3327V11.3333H4.66602V10.6667H3.99935V8.00001H3.33268V4.66668H2.66602V2.66668H0.666016V1.33334H2.66602V2.00001H15.3327Z'
              fill='white'
            />
          </svg>

          <span>Marketplace</span>
        </Link>
      </li>

      <li className={`${location.pathname === '/leaderboard' ? 'active' : ''}`}>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>

        <Link to={'/leaderboard'}>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M15.3327 4.66667V6H14.666V6.66667H13.9993V9.33333H13.3327V11.3333H12.666V12.6667H11.9993V14H3.99935V12.6667H3.33268V11.3333H2.66602V9.33333H1.99935V6.66667H1.33268V6H0.666016V4.66667H1.33268V4H2.66602V4.66667H3.33268V6H2.66602V6.66667H3.33268V7.33333H3.99935V8H5.33268V7.33333H5.99935V6H6.66602V4.66667H7.33268V4H6.66602V2.66667H7.33268V2H8.66602V2.66667H9.33268V4H8.66602V4.66667H9.33268V6H9.99935V7.33333H10.666V8H11.9993V7.33333H12.666V6.66667H13.3327V6H12.666V4.66667H13.3327V4H14.666V4.66667H15.3327Z'
              fill='white'
            />
          </svg>

          <span>Leaderboard</span>
        </Link>
      </li>
    </ul>
  )
}

function Profile() {
  const userAddress = useAppSelector((state) => state.web3store.userAddress)
  const bitFightersTotalData = useAppSelector((state) => state.bitFighters.totalNFTData)
  const selectedPlayer = useAppSelector((state) => state.playerDataStore.current_game_player_info)

  const profileName = selectedPlayer.nick_name !== '' ? selectedPlayer.nick_name : '?'
  return (
    <>
      {userAddress !== '' ? (
        <Link to={'/play'} className='profile-wrapper'>
          {bitFightersTotalData.length > 0 && bitFightersTotalData[0].data && bitFightersTotalData[0].data.profile_image ? (
            <img src={bitFightersTotalData[0].data.profile_image} alt='' />
          ) : (
            <img src={avatarImg1} alt='' />
          )}

          <p>{profileName || getEllipsisTxt(userAddress)}</p>
        </Link>
      ) : (
        <div className='play-btn active'>
          <span className='dot'></span>
          <span className='dot'></span>
          <span className='dot'></span>
          <span className='dot'></span>

          <Link to={'/play'}>
            <span>Play now</span>
          </Link>
        </div>
      )}
    </>
  )
}

export default function NavigationBar() {
  const [isHamburgerMenuActive, setIsHamburgerMenuActive] = useState<boolean>(false)

  return (
    <>
      <nav className='navigation-bar-component'>
        <NoticeBox />

        <div className='container'>
          <Link to={'/'} className='logo-img-wrapper'>
            <img src={shortLogoImg} alt='' />
          </Link>

          <div className='items-wrapper'>
            <Menu />

            <SocialLinks />

            <Profile />

            <button onClick={() => setIsHamburgerMenuActive(true)} className='hamburger-menu-open-btn'>
              <svg width='22' height='14' viewBox='0 0 25 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clipPath='url(#clip0_426_6)'>
                  <path
                    d='M20.3947 0H1.31579C0.589099 0 0 0.596953 0 1.33333C0 2.06971 0.589099 2.66667 1.31579 2.66667H20.3947C21.1214 2.66667 21.7105 2.06971 21.7105 1.33333C21.7105 0.596953 21.1214 0 20.3947 0Z'
                    fill='#fff'
                  ></path>
                  <path
                    d='M23.6842 6.66667H4.60522C3.87853 6.66667 3.28943 7.2636 3.28943 8C3.28943 8.7364 3.87853 9.33333 4.60522 9.33333H23.6842C24.4109 9.33333 25 8.7364 25 8C25 7.2636 24.4109 6.66667 23.6842 6.66667Z'
                    fill='#fff'
                  ></path>
                  <path
                    d='M20.3947 13.3333H1.31579C0.589099 13.3333 0 13.9303 0 14.6667C0 15.4031 0.589099 16 1.31579 16H20.3947C21.1214 16 21.7105 15.4031 21.7105 14.6667C21.7105 13.9303 21.1214 13.3333 20.3947 13.3333Z'
                    fill='#fff'
                  ></path>
                </g>
                <defs>
                  <clipPath id='clip0_426_6'>
                    <rect width='25' height='16' fill='white'></rect>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className={`hamburger-menu-component ${isHamburgerMenuActive ? 'active' : ''}`}>
        <div className='container'>
          <button className='hamburger-menu-close-btn'>
            <svg onClick={() => setIsHamburgerMenuActive(false)} width='14' height='14' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <g clipPath='url(#clip0_426_3)'>
                <path
                  d='M17.0103 15.1367L3.17123 1.29761C2.64413 0.770505 1.78951 0.770505 1.2624 1.29761C0.735288 1.82472 0.735288 2.67934 1.2624 3.20645L15.1015 17.0455C15.6286 17.5726 16.4832 17.5726 17.0103 17.0455C17.5374 16.5184 17.5374 15.6638 17.0103 15.1367Z'
                  fill='#fff'
                ></path>
                <path
                  d='M14.7935 0.954399L0.954413 14.7934C0.427305 15.3206 0.427305 16.1752 0.954413 16.7023C1.48153 17.2294 2.33614 17.2294 2.86325 16.7023L16.7023 2.86324C17.2295 2.33613 17.2295 1.48151 16.7023 0.954399C16.1752 0.427289 15.3206 0.427289 14.7935 0.954399Z'
                  fill='#fff'
                ></path>
              </g>
              <defs>
                <clipPath id='clip0_426_3'>
                  <rect width='18' height='18' fill='white'></rect>
                </clipPath>
              </defs>
            </svg>
          </button>

          <Profile />

          <Menu />

          <SocialLinks />
        </div>
      </div>
    </>
  )
}
