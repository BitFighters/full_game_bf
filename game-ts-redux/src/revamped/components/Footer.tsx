import SocialLinks from './SocialLinks'
// import shortLogoImg from '../assets/images/short-logo.webp'
// import footerComponentImg1 from '../assets/images/footer-component-1.webp'
// import footerComponentImg2 from '../assets/images/footer-component-2.webp'
import Divider from './Divider'
import landingPageMineSectionImg1 from '../assets/images/landing-page-mine-section-1.webp'
import landingPageMineSectionImg2 from '../assets/images/landing-page-mine-section-2.webp'
import landingPageMineSectionImg3 from '../assets/images/landing-page-mine-section-3.webp'
import landingPageMineSectionImg4 from '../assets/images/landing-page-mine-section-4.webp'
import landingPageMineSectionImg5 from '../assets/images/landing-page-mine-section-5.webp'
import landingPageMineSectionImg6 from '../assets/images/landing-page-mine-section-6.webp'

export default function Footer() {
  return (
    <footer className='footer-component'>
      {/* <div className="footer-top">
        <div className="top-fader"></div>

        <div className="container">
          <div className="h2-wrapper">
            <h2 className="text">
              Game <br /> Over
            </h2>

            <h2 className="text-stroke">
              Game <br /> Over
            </h2>

            <h2 className="text-shadow">
              Game <br /> Over
            </h2>
          </div>

          <a href={"#home"} className="logo-img-wrapper">
            <img src={shortLogoImg} alt="" />
          </a>

          <img src={footerComponentImg1} alt="" className="img-1" />
          <img src={footerComponentImg2} alt="" className="img-2" />
        </div>
      </div> */}
      <div className='imgs-wrapper'>
        <img src={landingPageMineSectionImg1} alt='' />
        <img src={landingPageMineSectionImg2} alt='' />
        <img src={landingPageMineSectionImg3} alt='' />
        <img src={landingPageMineSectionImg4} alt='' />
        <img src={landingPageMineSectionImg5} alt='' />
        <img src={landingPageMineSectionImg6} alt='' />
        <img src={landingPageMineSectionImg1} alt='' />
        <img src={landingPageMineSectionImg2} alt='' />
        <img src={landingPageMineSectionImg3} alt='' />
        <img src={landingPageMineSectionImg4} alt='' />
        <img src={landingPageMineSectionImg5} alt='' />
        <img src={landingPageMineSectionImg6} alt='' />
        <img src={landingPageMineSectionImg1} alt='' />
        <img src={landingPageMineSectionImg2} alt='' />
        <img src={landingPageMineSectionImg3} alt='' />
        <img src={landingPageMineSectionImg4} alt='' />
        <img src={landingPageMineSectionImg5} alt='' />
        <img src={landingPageMineSectionImg6} alt='' />
      </div>

      <div className='track'></div>

      <Divider />

      <div className='footer-bottom'>
        <div className='container'>
          <p>Copyright 2024 . All rights reserved</p>

          <SocialLinks />
        </div>
      </div>
    </footer>
  )
}
