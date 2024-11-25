export default class ColumnChart {
    constructor({
      data = [],
      label = '',
      link = '',
      value = 0,
      formatHeading = (data) => data,
    } = {}) {
      this.data = data;
      this.label = label;
      this.link = link;
      this.value = value;
      this.formatHeading = formatHeading;
      this.chartHeight = 50;
  
      this.render();
    }
  
    render() {
      const element = document.createElement('div');
      element.className = `column-chart ${
        this.data.length === 0 ? 'column-chart_loading' : ''
      }`;
      element.style.setProperty('--chart-height', this.chartHeight);
  
      element.innerHTML = `
        <div class="column-chart__title">
          ${this.label}
          ${this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ''}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody()}
          </div>
        </div>
      `;
  
      this.element = element;
    }
  
    getColumnBody() {
      if (!this.data.length) {
        return '';
      }
  
      const columnProps = this.getColumnProps(this.data);
  
      return columnProps
        .map(
          ({ value, percent }) =>
            `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
        )
        .join('');
    }
  
    getColumnProps(data) {
      const maxValue = Math.max(...data);
      const scale = this.chartHeight / maxValue;
  
      return data.map((item) => {
        return {
          percent: ((item / maxValue) * 100).toFixed(0) + '%',
          value: String(Math.floor(item * scale)),
        };
      });
    }
  
    update(data = []) {
      this.data = data;
      const body = this.element.querySelector('.column-chart__chart');
      body.innerHTML = this.getColumnBody();
  
      if (data.length === 0) {
        this.element.classList.add('column-chart_loading');
      } else {
        this.element.classList.remove('column-chart_loading');
      }
    }
  
    remove() {
      if (this.element) {
        this.element.remove();
      }
    }
  
    destroy() {
      this.remove();
      this.element = null;
    }
  }
  