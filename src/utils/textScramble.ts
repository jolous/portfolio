type QueueItem = {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
};

export default class TextScramble {
  private el: HTMLElement;
  private chars = '!<>-_\\/[]{}—=+*^?#________';
  private frame = 0;
  private frameRequest = 0;
  private queue: QueueItem[] = [];
  private resolve?: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>(resolve => {
      this.resolve = resolve;
    });

    this.queue = [];

    for (let i = 0; i < length; i += 1) {
      const from = oldText[i] ?? '';
      const to = newText[i] ?? '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i += 1) {
      const item = this.queue[i];
      if (this.frame >= item.end) {
        complete += 1;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this.randomChar();
        }
        output += `<span class="dud">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve?.();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame += 1;
    }
  }

  private randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
