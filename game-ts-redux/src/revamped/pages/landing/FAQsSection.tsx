import { useState } from "react";
import Divider from "../../components/Divider";
import landingPageAboutSectionImg1 from "../../assets/images/landing-page-about-section-1.webp";
import landingPageAboutSectionImg2 from "../../assets/images/landing-page-about-section-2.webp";
import FAQ from "../../components/FAQ";

interface IFAQ {
  question: string;
  answer: string;
}

export default function FAQsSection() {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const faqs: IFAQ[] = [
    {
      question: "Why?",
      answer:
        "Bit Fighters, A Bitcoin-powered universe crafted by industry professionals, offers players a special spot on the internet where they can collaborate, compete, and immerse themselves in a player driven Bitcoin economy.",
    },
    {
      question: "What?",
      answer:
        "Bit Fighters, A Bitcoin-powered universe crafted by industry professionals, offers players a special spot on the internet where they can collaborate, compete, and immerse themselves in a player driven Bitcoin economy.",
    },
    {
      question: "When?",
      answer:
        "Bit Fighters, A Bitcoin-powered universe crafted by industry professionals, offers players a special spot on the internet where they can collaborate, compete, and immerse themselves in a player driven Bitcoin economy.",
    },
    {
      question: "Who?",
      answer:
        "Bit Fighters, A Bitcoin-powered universe crafted by industry professionals, offers players a special spot on the internet where they can collaborate, compete, and immerse themselves in a player driven Bitcoin economy.",
    },
    {
      question: "Where?",
      answer:
        "Bit Fighters, A Bitcoin-powered universe crafted by industry professionals, offers players a special spot on the internet where they can collaborate, compete, and immerse themselves in a player driven Bitcoin economy.",
    },
    {
      question: "How?",
      answer:
        "Bit Fighters, A Bitcoin-powered universe crafted by industry professionals, offers players a special spot on the internet where they can collaborate, compete, and immerse themselves in a player driven Bitcoin economy.",
    },
  ];

  return (
    <section className="faqs-section">
      <Divider hasHangingLight />

      <div className="container">
        <div className="h2-wrapper">
          <h2 className="text">
            Frequently Asked <br /> Questions...
          </h2>

          <h2 className="text-stroke">
            Frequently Asked <br /> Questions...
          </h2>

          <h2 className="text-shadow">
            Frequently Asked <br /> Questions...
          </h2>
        </div>

        <div className="faqs-wrapper">
          {faqs.map((faq, index) => {
            return (
              <FAQ
                key={index}
                isActive={index === activeFaqIndex}
                setIsActive={() => {
                  if (activeFaqIndex === index) {
                    setActiveFaqIndex(null);
                  } else {
                    setActiveFaqIndex(index);
                  }
                }}
                question={faq.question}
                answer={faq.answer}
              />
            );
          })}
        </div>
      </div>

      <img src={landingPageAboutSectionImg2} alt="" className="img-1" />
      <img src={landingPageAboutSectionImg1} alt="" className="img-2" />
    </section>
  );
}
