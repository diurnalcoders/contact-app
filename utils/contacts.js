const fs = require("fs");

// data folder
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// make file contact json
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// Take file in contact json
const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// Find contact name
const findContact = (name) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  );
  return contact;
};

// overrides the contact json file
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// add new contact data
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// check duplicate
const checkDuplicate = (name) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.name === name);
};

// delete contact
const deleteContact = (name) => {
  const contact = loadContact();
  const filteredContacts = contact.filter((contact) => contact.name !== name);
  saveContacts(filteredContacts);
};

// change contact
const updateContact = (newContact) => {
  const contacts = loadContact();
  // hidden contact
  const filteredContacts = contacts.filter(
    (contact) => contact.name !== newContact.oldName
  );
  delete newContact.oldName;
  filteredContacts.push(newContact);
  saveContacts(filteredContacts);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContact,
};
