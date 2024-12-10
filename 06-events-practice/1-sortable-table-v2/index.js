export default class SortableTable {
  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
    this.sortData(this.sorted.id, this.sorted.order);
    this.update();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTableTemplate();
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();
  }

  getTableTemplate() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeaderTemplate()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getBodyTemplate(this.data)}
        </div>
      </div>
    `;
  }

  getHeaderTemplate() {
    return this.headersConfig
      .map(({ id, title, sortable }) => `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="">
          <span>${title}</span>
          ${sortable ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>' : ''}
        </div>
      `)
      .join('');
  }

  getBodyTemplate(data) {
    return data
      .map(item => `
        <a href="#" class="sortable-table__row">
          ${this.getRowTemplate(item)}
        </a>
      `)
      .join('');
  }

  getRowTemplate(item) {
    return this.headersConfig
      .map(({ id, template }) =>
        template ? template(item[id] ?? '') : `<div class="sortable-table__cell">${item[id] ?? ''}</div>`
      )
      .join('');
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  initEventListeners() {
    const headers = this.subElements.header.querySelectorAll('[data-id]');
    headers.forEach(header => {
      const clonedHeader = header.cloneNode(true);
      header.replaceWith(clonedHeader); // Удаляем старые события
      if (clonedHeader.dataset.sortable === 'true') {
        clonedHeader.addEventListener('click', () => {
          const order = clonedHeader.dataset.order === 'asc' ? 'desc' : 'asc';
          this.sort(clonedHeader.dataset.id, order);
        });
      }
    });
  }

  sort(field, order) {
    this.sorted = { id: field, order };
    this.sortData(field, order);
    this.update();
  }

  sortData(field, order) {
    const column = this.headersConfig.find(({ id }) => id === field);
    if (!column) {
      throw new Error(`Column with id "${field}" is not found`);
    }

    const { sortType } = column;
    const direction = order === 'asc' ? -1 : 1;

    this.data.sort((a, b) => {
      const valueA = a[field] ?? '';
      const valueB = b[field] ?? '';

      if (sortType === 'number') {
        return direction * (Number(valueA) - Number(valueB));
      }

      if (sortType === 'string') {
        return direction * String(valueA).localeCompare(String(valueB), 'ru', { sensitivity: 'base' });
      }

      return 0;
    });
  }

  update() {
    this.subElements.body.innerHTML = this.getBodyTemplate(this.data);

    const headers = this.subElements.header.querySelectorAll('[data-order]');
    headers.forEach(header => (header.dataset.order = ''));

    const currentHeader = this.subElements.header.querySelector(`[data-id="${this.sorted.id}"]`);
    if (currentHeader) {
      currentHeader.dataset.order = this.sorted.order;
    }
  }

  destroy() {
    this.element.remove();
    this.subElements = {};
  }
}
