export default class HelloComponent {
  constructor(name) {
    this.name = name
  }

  sayHello() {
    console.log(`Hello from ${this.name}.`);
  }
}
