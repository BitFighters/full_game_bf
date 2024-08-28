interface IProps {
  isActive: boolean;
  setIsActive: () => void;
  question: string;
  answer: string;
}

export default function FAQ({
  isActive,
  setIsActive,
  question,
  answer,
}: IProps) {
  return (
    <div className={`faq-component ${isActive ? "active" : ""}`}>
      <div onClick={setIsActive} className="faq-top">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>

        <div className="content">
          <p>{question}</p>

          <button>
            <svg
              width="13"
              height="7"
              viewBox="0 0 13 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.625 0V1.16667H9.375V2.33333H8.125V3.5H6.875V4.66667H5.625V3.5H4.375V2.33333H3.125V1.16667H1.875V0L0 0L0 1.16667H0.625V2.33333H1.875V3.5H3.125V4.66667H4.375V5.83333H5V6.41667H5.625V7H6.875V6.41667H7.5V5.83333H8.125V4.66667H9.375V3.5H10.625V2.33333H11.875V1.16667H12.5V0L10.625 0Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="faq-bottom">
        <p>{answer}</p>
      </div>
    </div>
  );
}
