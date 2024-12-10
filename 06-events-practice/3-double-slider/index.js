export default class DoubleSlider {
    constructor({
      min = 100,
      max = 200,
      selected = { from: min, to: max },
      formatValue = value => value,
    } = {}) {
      this.min = min;
      this.max = max;
      this.selected = { ...selected };
      this.formatValue = formatValue;
  
      this.render();
      this.initEventListeners();
    }
  
    render() {
      const wrapper = document.createElement('div');
      wrapper.className = 'range-slider';
  
      wrapper.innerHTML = `
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${this.getPercent(this.selected.from)}%; right: ${100 - this.getPercent(this.selected.to)}%;"></span>
          <span class="range-slider__thumb-left" style="left: ${this.getPercent(this.selected.from)}%;"></span>
          <span class="range-slider__thumb-right" style="right: ${100 - this.getPercent(this.selected.to)}%;"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      `;
  
      this.element = wrapper;
      this.subElements = this.getSubElements(wrapper);
    }
  
    getPercent(value) {
      return ((value - this.min) / (this.max - this.min)) * 100;
    }
  
    getSubElements(element) {
      const elements = element.querySelectorAll('[data-element]');
      return [...elements].reduce((acc, subElement) => {
        acc[subElement.dataset.element] = subElement;
        return acc;
      }, {});
    }
  
    initEventListeners() {
      const leftThumb = this.element.querySelector('.range-slider__thumb-left');
      const rightThumb = this.element.querySelector('.range-slider__thumb-right');
  
      leftThumb.addEventListener('pointerdown', this.onThumbPointerDown);
      rightThumb.addEventListener('pointerdown', this.onThumbPointerDown);
    }
  
    onThumbPointerDown = (event) => {
      event.preventDefault();
  
      const thumb = event.target;
      const isLeftThumb = thumb.classList.contains('range-slider__thumb-left');
      const inner = this.element.querySelector('.range-slider__inner');
      const { left, width } = inner.getBoundingClientRect();
  
      const onPointerMove = (event) => {
        if (!this.element) return;
  
        const newPercent = Math.max(0, Math.min(100, ((event.clientX - left) / width) * 100));
        const newValue = Math.round(this.min + (newPercent / 100) * (this.max - this.min));
  
        if (isLeftThumb) {
          this.selected.from = Math.min(newValue, this.selected.to);
          this.updateThumbPosition(thumb, 'left', this.getPercent(this.selected.from));
          this.subElements.from.textContent = this.formatValue(this.selected.from);
        } else {
          this.selected.to = Math.max(newValue, this.selected.from);
          this.updateThumbPosition(thumb, 'right', this.getPercent(this.selected.to));
          this.subElements.to.textContent = this.formatValue(this.selected.to);
        }
  
        this.updateProgressBar();
      };
  
      const onPointerUp = () => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
  
        if (this.element) {
          this.element.dispatchEvent(
            new CustomEvent('range-select', {
              detail: {
                from: this.selected.from,
                to: this.selected.to,
              },
              bubbles: true,
            })
          );
        }
      };
  
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    };
  
    updateThumbPosition(thumb, side, percent) {
      if (thumb) {
        thumb.style[side] = `${percent}%`;
      }
    }
  
    updateProgressBar() {
      if (!this.element) return;
      const progress = this.element.querySelector('.range-slider__progress');
      if (progress) {
        progress.style.left = `${this.getPercent(this.selected.from)}%`;
        progress.style.right = `${100 - this.getPercent(this.selected.to)}%`;
      }
    }
  
    destroy() {
      if (this.element) {
        this.element.remove();
        this.element = null;
        this.subElements = null;
      }
    }
  }
  