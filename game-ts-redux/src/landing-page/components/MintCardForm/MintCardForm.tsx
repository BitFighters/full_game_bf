import './MintCardForm.scss';

function MintCardForm() {
  return (
    <form className="mint-card__form">
      <div className="mint-card__form__title">
        <span>Please Enter</span>
      </div>
      <div className="mint-card__form__item">
        <label htmlFor="name">Fighter Name:</label>
        <input id="name" type="text" />
      </div>
      <div className="mint-card__form__item">
        <label htmlFor="code">Refferrer Code:</label>
        <input id="code" type="text" />
      </div>
      <div className="mint-card__form__item mint-card__form__item--radio">
        <input id="radio" type="radio" />
        <label htmlFor="radio" className="radio-circle">
          {' '}
        </label>
        <label htmlFor="radio">I don&#39;t have one</label>
      </div>
      <div className="mint-card__form__item mint-card__form__item--lucky">
        <label htmlFor="lucky">Lucky #1-100:</label>
        <input id="lucky" type="text" />
      </div>
    </form>
  );
}

export default MintCardForm;
