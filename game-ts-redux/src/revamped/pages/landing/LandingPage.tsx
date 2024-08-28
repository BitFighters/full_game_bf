import '../../css/index.css'
import ScrollToTop from '../../components/ScrollToTop'
import NavigationBar from '../../components/NavigationBar'
import Footer from '../../components/Footer'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
// import MineSection from './MineSection'
import VideoSection from './VideoSection'
import InfoSection from './InfoSection'
import FeaturesSection from './FeaturesSection'
import FAQsSection from './FAQsSection'

export default function LandingPage() {
  return (
    <div className='revamped-wrapper'>
      <ScrollToTop />

      <NavigationBar />

      <main className='revamped-landing-page'>
        <HeroSection />
        <AboutSection />
        {/* <MineSection /> */}
        <VideoSection />
        <InfoSection />
        <FeaturesSection />
        <FAQsSection />
      </main>

      <Footer />
    </div>
  )
}
