import { useState } from 'react'
import Divider from '../../components/Divider'
import landingPageVideoSectionThumbnailImg from '../../assets/images/landing-page-video-section-thumbnail.webp'

export default function VideoSection() {
  const [isActive, setIsActive] = useState<boolean>(false)

  return (
    <>
      {isActive && (
        <div
          onClick={() => {
            setIsActive(false)
          }}
          className='video-popup-component'
        >
          <div className='container'>
            <button>
              <svg width='14' height='14' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
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

            <iframe
              src='https://www.youtube.com/embed/jxoJbZXskhg'
              title='Bit Fighters - Ecosystem loop'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <section id='video' className='video-section'>
        <Divider />

        <div className='container'>
          <div className='h2-wrapper'>
            <h2 className='text'>
              Play, Anywhere, Anytime <br /> on Mobile and PC
            </h2>

            <h2 className='text-stroke'>
              Play Anywhere, Anytime <br /> on Mobile and PC
            </h2>

            <h2 className='text-shadow'>
              Play Anywhere, Anytime <br /> on Mobile and PC
            </h2>
          </div>

          <div className='video-wrapper'>
            <button
              onClick={() => {
                setIsActive(true)
              }}
            >
              <svg width='50' height='50' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clipPath='url(#clip0_255_938)'>
                  <path
                    d='M25 49.2688C38.8071 49.2688 50 38.3363 50 24.8502C50 11.3642 38.8071 0.431641 25 0.431641C11.1929 0.431641 0 11.3642 0 24.8502C0 38.3363 11.1929 49.2688 25 49.2688Z'
                    fill='white'
                    fillOpacity='0.1'
                  />
                  <path
                    d='M25.0005 48.6874C38.4788 48.6874 49.4052 38.0151 49.4052 24.8502C49.4052 11.6852 38.4788 1.01294 25.0005 1.01294C11.5221 1.01294 0.595703 11.6852 0.595703 24.8502C0.595703 38.0151 11.5221 48.6874 25.0005 48.6874Z'
                    stroke='white'
                    strokeOpacity='0.1'
                  />
                  <path
                    d='M32.0452 24.8019V26.0616H31.4005V26.6914H30.7556V27.3212H29.4659V27.9511H28.1762V28.581H27.5314V29.2107H26.2417V29.8406H24.952V30.4705H24.3071V31.1003H23.0175V31.7302H21.7278V32.36H19.7933V31.7302H19.1484V19.1333H19.7933V18.5034H21.7278V19.1333H23.0175V19.7631H24.3071V20.393H24.952V21.0228H26.2417V21.6526H27.5314V22.2825H28.1762V22.9124H29.4659V23.5421H30.7556V24.172H31.4005V24.8019H32.0452Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_255_938'>
                    <rect width='50' height='50' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </button>

            <img src={landingPageVideoSectionThumbnailImg} alt='' />
          </div>
          <p style={{ textAlign: 'center' }}>
            Bit Fighters is browser based with tiny system requirements. <br />
            No downloads or executables. <br />
            Bit Fighters loads fast and plays on almost any device connected to the internet.
            <br />
          </p>
        </div>

        <Divider />
      </section>
    </>
  )
}
