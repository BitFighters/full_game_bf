import Divider from "../../components/Divider";
import landingPageMineSectionImg1 from "../../assets/images/landing-page-mine-section-1.webp";
import landingPageMineSectionImg2 from "../../assets/images/landing-page-mine-section-2.webp";
import landingPageMineSectionImg3 from "../../assets/images/landing-page-mine-section-3.webp";
import landingPageMineSectionImg4 from "../../assets/images/landing-page-mine-section-4.webp";
import landingPageMineSectionImg5 from "../../assets/images/landing-page-mine-section-5.webp";
import landingPageMineSectionImg6 from "../../assets/images/landing-page-mine-section-6.webp";

export default function MineSection() {
  return (
    <section className="mine-section">
      <div className="top-fader"></div>

      <div className="container">
        <div className="h2-wrapper">
          <h2 className="text">
            Mine Bitcoins within <br /> the Game...
          </h2>

          <h2 className="text-stroke">
            Mine Bitcoins within <br /> the Game...
          </h2>

          <h2 className="text-shadow">
            Mine Bitcoins within <br /> the Game...
          </h2>
        </div>
      </div>

      <div className="imgs-wrapper">
        <img src={landingPageMineSectionImg1} alt="" />
        <img src={landingPageMineSectionImg2} alt="" />
        <img src={landingPageMineSectionImg3} alt="" />
        <img src={landingPageMineSectionImg4} alt="" />
        <img src={landingPageMineSectionImg5} alt="" />
        <img src={landingPageMineSectionImg6} alt="" />
        <img src={landingPageMineSectionImg1} alt="" />
        <img src={landingPageMineSectionImg2} alt="" />
        <img src={landingPageMineSectionImg3} alt="" />
        <img src={landingPageMineSectionImg4} alt="" />
        <img src={landingPageMineSectionImg5} alt="" />
        <img src={landingPageMineSectionImg6} alt="" />
        <img src={landingPageMineSectionImg1} alt="" />
        <img src={landingPageMineSectionImg2} alt="" />
        <img src={landingPageMineSectionImg3} alt="" />
        <img src={landingPageMineSectionImg4} alt="" />
        <img src={landingPageMineSectionImg5} alt="" />
        <img src={landingPageMineSectionImg6} alt="" />
      </div>

      <div className="track"></div>

      <Divider />
    </section>
  );
}
