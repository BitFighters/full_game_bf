import Divider from "../../components/Divider";
import landingPageInfoSectionImg1 from "../../assets/images/landing-page-info-section-1.webp";
import landingPageInfoSectionImg2 from "../../assets/images/landing-page-info-section-2.webp";
import landingPageInfoSectionImg3 from "../../assets/images/landing-page-info-section-3.webp";

export default function InfoSection() {
  return (
    <section className="info-section">
      <div className="parts-wrapper">
        <div className="part top-part">
          <div className="left-light">
            <div className="light-part"></div>
            <div className="light"></div>
          </div>

          <div className="container">
            <div className="content">
              <div className="h2-wrapper">
                <h2 className="text">Prove Your Work with In-Game Businesses</h2>

                <h2 className="text-stroke">
                  Prove Your Work with In-Game Businesses
                </h2>

                <h2 className="text-shadow">
                  Prove Your Work with In-Game Businesses
                </h2>
              </div>

              <p>
                The core of Bit Fighters is a Bitcoin based, player driven economy. Players can own buildings
                and businesses to trade services and products for Bitcoin. Building owners have an opportunity to earn BTC passively
                while the rest of the player community takes advantage of the value they created.
              </p>
              <br />
              <p>Players visit and pay building owners and operators for services such as:</p>
              <ul>
                <li>Time in a mine to discover prizes and resources</li>
                <li>Time on a machine in a factory where they can refine and craft resources</li>
                <li>A shop where players can purchase items to give them an edge in the battle arena</li>
              </ul>

            </div>

            <div className="img-wrapper">
              <img src={landingPageInfoSectionImg1} alt="" />
            </div>
          </div>
        </div>

        <img src={landingPageInfoSectionImg3} alt="" className="img-3" />

        <div className="part bottom-part">
          <div className="container">
            <div className="img-wrapper">
              <img src={landingPageInfoSectionImg2} alt="" />
            </div>

            <div className="content">
              <div className="h2-wrapper">
                <h2 className="text">Claim your stake in the Bit Fighter's treasury with a 1k Club VIP Card!</h2>

                <h2 className="text-stroke">
                  Claim your stake in the Bit Fighter's treasury with a 1k Club VIP Card!
                </h2>

                <h2 className="text-shadow">
                  Claim your stake in the Bit Fighter's treasury with a 1k Club VIP Card!
                </h2>
              </div>

              <p>
                Only 1,000 of thesEach 1k club card gets a share of the 1% of the $1M+ Bitcoin
                treasury every month! Bit Fighters, a Bitcoin-powered universe
                crafted by industry professionals, offers a dynamic realm for
                individuals, projects, and communities to connect, compete, and
                immerse themselves in real-time social gaming.
              </p>
            </div>
          </div>

          <div className="right-light">
            <div className="light"></div>
            <div className="light-part"></div>
          </div>
        </div>
      </div>

      <Divider />
    </section>
  );
}
