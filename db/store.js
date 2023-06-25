const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
  constructor() {
    this.dbFilePath = 'db/db.json';
  }

  read() {
    return readFileAsync(this.dbFilePath, 'utf8');
  }

  write(notes) {
    return writeFileAsync(this.dbFilePath, JSON.stringify(notes));
  }

  getNotes() {
    return this.read().then((notes) => {
      let parsedNotes;
      try {
        parsedNotes = [].concat(JSON.parse(notes));
      } catch (err) {
        parsedNotes = [];
      }
      return parsedNotes;
    });
  }

  addNote(note) {
    return this.getNotes()
      .then((notes) => [...notes, note])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => note);
  }

  removeNote(id) {
    return this.getNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}

module.exports = new Store();
