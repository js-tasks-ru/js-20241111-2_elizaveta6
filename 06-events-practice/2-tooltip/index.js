class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;

    this.element = null;

    return this;
  }

  initialize() {
    this.render();
    this.initEventListeners();
  }

  render() {
    if (!this.element) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      document.body.appendChild(tooltip);
      this.element = tooltip;
    }
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  onPointerOver = event => {
    const tooltipTarget = event.target.closest('[data-tooltip]');
    if (tooltipTarget) {
      this.showTooltip(tooltipTarget.dataset.tooltip, event);
      document.addEventListener('pointermove', this.onPointerMove);
    }
  };

  onPointerOut = event => {
    const tooltipTarget = event.target.closest('[data-tooltip]');
    if (tooltipTarget) {
      this.hideTooltip();
      document.removeEventListener('pointermove', this.onPointerMove);
    }
  };

  onPointerMove = event => {
    this.setTooltipPosition(event);
  };

  showTooltip(content, event) {
    this.element.textContent = content;
    this.element.style.display = 'block';
    this.setTooltipPosition(event);
  }

  setTooltipPosition(event) {
    const offset = 10;
    const tooltipRect = this.element.getBoundingClientRect();

    let left = event.clientX + offset;
    const top = event.clientY + offset;

    if (left + tooltipRect.width > document.documentElement.clientWidth) {
      left = event.clientX - tooltipRect.width - offset;
    }

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  hideTooltip() {
    if (this.element) {
      this.element.remove(); 
      this.element = null;   
    }
  }
  

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
  }
}

export default Tooltip;
