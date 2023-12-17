class EmbedParam {
  name: string;
  value: string; // Assuming 'value' is also a string. Change the type if it's different.

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}

export default EmbedParam;
