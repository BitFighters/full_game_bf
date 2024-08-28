import Divider from "../../components/Divider";
import landingPageAboutSectionBoxingRingImg from "../../assets/images/landing-page-about-section-boxing-ring.webp";
import landingPageAboutSectionLeftCoinsImg from "../../assets/images/landing-page-about-section-left-coins.webp";
import landingPageAboutSectionRightCoinsImg from "../../assets/images/landing-page-about-section-right-coins.webp";
import landingPageAboutSectionCharacterImg1 from "../../assets/images/landing-page-about-section-character-1.gif";
import landingPageAboutSectionCharacterImg2 from "../../assets/images/landing-page-about-section-character-2.gif";
import landingPageAboutSectionImg1 from "../../assets/images/landing-page-about-section-1.webp";
import landingPageAboutSectionImg2 from "../../assets/images/landing-page-about-section-2.webp";

export default function AboutSection() {
  return (
    <section className="about-section">
      <Divider hasHangingLight />

      <div className="container">
        <div className="h1-wrapper">
          <h1 className="text">
            The World's 1st and Only,  <br />Real-Time Action MMO,  <br />Bitcoin Party Game!
          </h1>

          <h1 className="text-stroke">
            The World's 1st and Only, <br /> Real-Time Action MMO,  <br />Bitcoin Party Game!
          </h1>
          <h1 className="text-shadow">
            The World's 1st and Only, <br /> Real-Time Action MMO, <br /> Bitcoin Party Game!
          </h1>
        </div>
        <p>
          Bit Fighters, A Bitcoin only, multiplayer action game, crafted by the players, for the players,
          offers a zany unique universe where people
          can collaborate, compete, and immerse themselves in a socially
          driven Bitcoin economy.
          <br />
          <br />
          Players own the in-game businesses and prove their work to earn value from one another. The core economy loops provides
          players from many gaming interests different opportunities to earn by serving one another.<br />
          <br />
          Bitcoin is the game and reward token.
        </p>

        <div className="boxing-ring-wrapper">
          <img
            src={landingPageAboutSectionBoxingRingImg}
            alt=""
            className="boxing-ring-img"
          />

          <div className="characters-wrapper">
            <img
              src={landingPageAboutSectionCharacterImg1}
              alt=""
              className="character-1"
            />

            <img
              src={landingPageAboutSectionCharacterImg2}
              alt=""
              className="character-2"
            />
          </div>

          <img
            src={landingPageAboutSectionLeftCoinsImg}
            alt=""
            className="left-coins-img"
          />

          <img
            src={landingPageAboutSectionRightCoinsImg}
            alt=""
            className="right-coins-img"
          />
        </div>
        <p>
          Put your Bitcoin where your fingers are and compete with other players for Bitcoin! Skills rule in this fierce head-to-head real-time action combat!
        </p>
      </div>

      <img src={landingPageAboutSectionImg1} alt="" className="img-1" />
      <img src={landingPageAboutSectionImg2} alt="" className="img-2" />
    </section>
  );
}
