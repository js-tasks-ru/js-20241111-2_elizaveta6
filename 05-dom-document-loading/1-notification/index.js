
export default class NotificationMessage {
  static activeNotification = null;

  constructor(message, { type = 'success', duration = 2000 } = {}) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.element = null;

    this.createNotificationElement();
  }

  createNotificationElement() {
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${this.type}`;
    notificationElement.style.cssText = `--value:${this.duration / 1000}s`;

    notificationElement.innerHTML = `
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    `;

    this.element = notificationElement;
  }

  show(targetElement = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    NotificationMessage.activeNotification = this;
    targetElement.append(this.element);

    this.timeoutId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }

    if (NotificationMessage.activeNotification === this) {
      NotificationMessage.activeNotification = null;
    }

    clearTimeout(this.timeoutId);
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
