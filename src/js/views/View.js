import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recipe object to the DOM
   * @param {Object | Object[]} data  The data to be rendered(e.g. recipe)
   * @param {boolean} {render = true} If false, create markup sting instead of renderign to the DOM
   * @returns {undefined | string} a markup string is returned if render=false
   * @this {Object} View instance 
   * @author Sebasitan Nowak
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    // if(render === false)
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // new object it's 'virtual DOM'
    const newDom = document.createRange().createContextualFragment(newMarkup);
    // choose every elements from DOM, return every sinle elemetns
    const newElements = Array.from(newDom.querySelectorAll('*'));

    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        console.log(newEl.firstChild + '🍕🍕🍕🍕');

        curEl.textContent = newEl.textContent;
      }

      // update changed attr
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> 
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderError(message = this._errorMessage) {
    console.error();
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}icons.svg#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
      <div>
        <svg>
          <use href="${icons}icons.svg#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

// excercise:
/*
1. wyświetlaj nr strony tam gdzie paginację
2. sort wd np czasu trwania gotowania lub ilości składników  [na końcu]
3. walidacją składników przed wysłaniem [input np na czerwono, że jest nieprawidłowy format]
4. dodać 3 odzielne pola do składników , możliwość dodwania więcej składników
5. Lista zakupów 
6. Kalendarz 
7. API spoonacular [dodaje kolaorie do składników itd ]
*/