import btcImg from "../../assets/images/btc.svg";
import landingPageFeaturesSectionImg1 from "../../assets/images/landing-page-features-section-1.webp";
import landingPageFeaturesSectionImg2 from "../../assets/images/landing-page-features-section-2.webp";
import landingPageFeaturesSectionImg3 from "../../assets/images/landing-page-features-section-3.webp";
import landingPageFeaturesSectionImg4 from "../../assets/images/landing-page-features-section-4.webp";
import landingPageFeaturesSectionImg5 from "../../assets/images/landing-page-features-section-5.webp";
import landingPageFeaturesSectionImg6 from "../../assets/images/landing-page-features-section-6.webp";
import landingPageFeaturesSectionFloorImg from "../../assets/images/landing-page-features-section-floor.webp";

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="h2-wrapper">
          <h2 className="text">
            No Shitcoins that <br /> Goes to Zero...
          </h2>

          <h2 className="text-stroke">
            No Shitcoins that <br /> Goes to Zero...
          </h2>

          <h2 className="text-shadow">
            No Shitcoins that <br /> Goes to Zero...
          </h2>
        </div>

        <p className="top-desc">
          We use Bitcoin as our currency not any native shitcoin that eventually
          goes to zero. That is what sets us apart from other projects.
        </p>

        <div className="parts-wrapper">
          <div className="left-part">
            <div className="info-box">
              <div className="info-box-top">
                <img
                  src={landingPageFeaturesSectionImg1}
                  alt=""
                  className="icon"
                />

                <div className="content">
                  <h3>Player Driven</h3>

                  <p>Each 1k club card gets a share of the 1%.</p>
                </div>
              </div>

              <div className="floor-wrapper">
                <h3>1</h3>

                <img
                  src={landingPageFeaturesSectionFloorImg}
                  alt=""
                  className="floor"
                />
              </div>
            </div>

            <div className="info-box">
              <div className="info-box-top">
                <img
                  src={landingPageFeaturesSectionImg2}
                  alt=""
                  className="icon"
                />

                <div className="content">
                  <h3>Proof of Work</h3>

                  <p>Each 1k club card gets a share of the 1%.</p>
                </div>
              </div>

              <div className="floor-wrapper">
                <h3>2</h3>

                <img
                  src={landingPageFeaturesSectionFloorImg}
                  alt=""
                  className="floor"
                />
              </div>
            </div>

            <div className="info-box">
              <div className="info-box-top">
                <img
                  src={landingPageFeaturesSectionImg3}
                  alt=""
                  className="icon"
                />

                <div className="content">
                  <h3>Passive Income</h3>

                  <p>Each 1k club card gets a share of the 1%.</p>
                </div>
              </div>

              <div className="floor-wrapper">
                <h3>3</h3>

                <img
                  src={landingPageFeaturesSectionFloorImg}
                  alt=""
                  className="floor"
                />
              </div>
            </div>
          </div>

          <div className="center-part">
            <div className="icon-wrapper">
              <div className="icon">
                <img src={btcImg} alt="" />
              </div>
            </div>

            <a href="#home" className="primary-btn-component">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>

              <div className="content">
                <span>Get Started</span>
              </div>
            </a>
          </div>

          <div className="right-part">
            <div className="info-box">
              <div className="info-box-top">
                <img
                  src={landingPageFeaturesSectionImg4}
                  alt=""
                  className="icon"
                />

                <div className="content">
                  <h3>No Tax</h3>

                  <p>Each 1k club card gets a share of the 1%.</p>
                </div>
              </div>

              <div className="floor-wrapper">
                <h3>4</h3>

                <img
                  src={landingPageFeaturesSectionFloorImg}
                  alt=""
                  className="floor"
                />
              </div>
            </div>

            <div className="info-box">
              <div className="info-box-top">
                <img
                  src={landingPageFeaturesSectionImg5}
                  alt=""
                  className="icon"
                />

                <div className="content">
                  <h3>Open World</h3>

                  <p>Each 1k club card gets a share of the 1%.</p>
                </div>
              </div>

              <div className="floor-wrapper">
                <h3>5</h3>

                <img
                  src={landingPageFeaturesSectionFloorImg}
                  alt=""
                  className="floor"
                />
              </div>
            </div>

            <div className="info-box">
              <div className="info-box-top">
                <img
                  src={landingPageFeaturesSectionImg6}
                  alt=""
                  className="icon"
                />

                <div className="content">
                  <h3>Play2Earn</h3>

                  <p>Each 1k club card gets a share of the 1%.</p>
                </div>
              </div>

              <div className="floor-wrapper">
                <h3>6</h3>

                <img
                  src={landingPageFeaturesSectionFloorImg}
                  alt=""
                  className="floor"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
