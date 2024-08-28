import { Link } from 'react-router-dom'
import landingPageHeroSectionImg1 from '../../assets/images/landing-page-hero-section-1.webp'

export default function HeroSection() {
  const bgImgs: string[] = [
    '/landing-page-hero-section-bg.webp',
    '/landing-page-hero-section-bg-2.webp',
    '/landing-page-hero-section-bg-3.webp',
    '/landing-page-hero-section-bg-4.webp',
  ]

  return (
    <section
      id='home'
      className='hero-section'
      style={{
        background: `radial-gradient(50% 50% at 50% 50%, rgba(4, 10, 22, 0.8) 0%, rgba(4, 10, 22, 0) 75.5%), url('${
          bgImgs[Math.floor(Math.random() * bgImgs.length)]
        }')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 75%',
      }}
    >
      <div className='top-fader'></div>

      <div className='container'>
        <img src={landingPageHeroSectionImg1} alt='' />

        <div className='btns-wrapper'>
          <Link to={'/play'} className='primary-btn-component'>
            <span className='dot'></span>
            <span className='dot'></span>
            <span className='dot'></span>
            <span className='dot'></span>

            <div className='content'>
              <span>Play now</span>
            </div>
          </Link>

          <a href='#video' className='play-btn'>
            <svg width='42' height='43' viewBox='0 0 42 43' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <circle cx='21' cy='21.3712' r='21' fill='white' fillOpacity='0.1' />
              <circle cx='21' cy='21.3712' r='20.5' stroke='white' strokeOpacity='0.1' />
              <g clipPath='url(#clip0_233_107)'>
                <path
                  d='M26.9173 21.3296V22.4129H26.3757V22.9546H25.834V23.4962H24.7507V24.0379H23.6673V24.5796H23.1257V25.1212H22.0423V25.6629H20.959V26.2046H20.4173V26.7462H19.334V27.2879H18.2507V27.8296H16.6257V27.2879H16.084V16.4546H16.6257V15.9129H18.2507V16.4546H19.334V16.9962H20.4173V17.5379H20.959V18.0796H22.0423V18.6212H23.1257V19.1629H23.6673V19.7046H24.7507V20.2462H25.834V20.7879H26.3757V21.3296H26.9173Z'
                  fill='white'
                />
              </g>
              <defs>
                <clipPath id='clip0_233_107'>
                  <rect width='13' height='13' fill='white' transform='translate(15 15.3712)' />
                </clipPath>
              </defs>
            </svg>

            <p>Economy Loop</p>
          </a>
        </div>
      </div>
    </section>
  )
}
