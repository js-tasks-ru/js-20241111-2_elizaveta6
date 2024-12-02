export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'sortable-table';

    wrapper.innerHTML = `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.getHeaderTemplate()}
      </div>
      <div data-element="body" class="sortable-table__body">
        ${this.getBodyTemplate(this.data)}
      </div>
      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <p>No products satisfies your filter criteria</p>
      </div>
    `;

    this.element = wrapper;
    this.subElements = this.getSubElements(wrapper);
  }

  getHeaderTemplate() {
    return this.headerConfig
      .map(({ id, title, sortable }) => `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${sortable ? '' : ''}>
          <span>${title}</span>
          ${sortable ? `<span class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>` : ''}
        </div>
      `)
      .join('');
  }  

  getBodyTemplate(data) {
    return data
      .map(item => `
        <a href="#" class="sortable-table__row">
          ${this.headerConfig
            .map(({ id, template }) =>
              template
                ? template(item[id])
                : `<div class="sortable-table__cell">${item[id]}</div>`
            )
            .join('')}
        </a>
      `)
      .join('');
  }

  sort(field, order = 'asc') {
    const column = this.headerConfig.find(item => item.id === field);
  
    if (!column || !column.sortable) return;
  
    const direction = order === 'asc' ? 1 : -1;
    const { sortType } = column;
  
    const compareFunction = {
      string: (a, b) => a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' }),
      number: (a, b) => a - b,
      date: (a, b) => new Date(a) - new Date(b),
    };
  
    this.data.sort((a, b) => direction * compareFunction[sortType](a[field], b[field]));
  
    this.subElements.header.querySelectorAll('.sortable-table__cell[data-id]').forEach(headerCell => {
      headerCell.removeAttribute('data-order');
    });
  
    const currentColumn = this.subElements.header.querySelector(`.sortable-table__cell[data-id="${field}"]`);
    if (currentColumn) {
      currentColumn.setAttribute('data-order', order);
    }
  
    this.updateBody();
  }  

  updateBody() {
    this.subElements.body.innerHTML = this.getBodyTemplate(this.data);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}


