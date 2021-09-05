const { nanoid } = require('nanoid');
const faker = require('faker');

class MsgGenerator {
  constructor() {
    this.messages = [];
    this.timeout = null;
    this.limit = 100; // Лимит, по достижению которого сервер перестает генерировать сообщения.
    this.isFinish = false; // true, если достигнут предел и все сообщения переданы (для отписки).
  }

  start() {
    // Определяем случайные задержки между сообщениями в диапазоне от 200ms до 4000ms.
    const delay = Math.floor(Math.random() * (4000 - 200)) + 200;

    this.timeout = setTimeout(() => {
      const message = {
        id: nanoid(),
        from: faker.internet.email(),
        subject: faker.lorem.words(),
        body: faker.lorem.paragraph(),
        received: Date.now(),
      };

      this.messages.push(message);

      // Генерируем сообщения до определенного количества.
      if (this.messages.length === this.limit) {
        clearTimeout(this.timeout);
        // eslint-disable-next-line no-console
        console.log('Messages generation finished.');
      } else this.start();
    }, delay);
  }

  // Возвращает только не переданные ранее сообщения, если они появились.
  getLastMessages(id) {
    if (!id) return this.messages;

    // Определяем индекс последнего переданного сообщения.
    const index = this.messages.findIndex((msg) => msg.id === id);

    if (index + 1 === this.limit) this.isFinish = true;
    return this.messages.slice(index + 1, this.messages.length);
  }
}

module.exports = MsgGenerator;
