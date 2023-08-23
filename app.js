const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContact,
} = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// Port
const app = express();
const port = 3000;

// third party middleware
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// flash configuration
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  const student = [
    {
      name: "Rasya adrian",
      email: "rasyaadrian@gmail",
    },
    {
      name: "pale",
      email: "rasyaadrian@gmail",
    },
    {
      name: "jonson",
      email: "rasyaadrian@gmail",
    },
  ];
  res.render("index", {
    name: "Rasya adrian",
    student,
    layout: "layouts/mc",
    title: "Home page",
  });
});

app.get("/about", (req, res) => {
  res.render("about", { layout: "layouts/mc", title: "About page" });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    layout: "layouts/mc",
    title: "contact page",
    contacts,
    msg: req.flash("msg"),
  });
});

// data contact add page
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/mc",
    title: "contact data add form",
  });
});

// proces delete contact
app.get("/contact/delete/:name", (req, res) => {
  const contact = findContact(req.params.name);
  // if nothing contact
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.name);
    req.flash("msg", "Contact data successfully delete");
    res.redirect("/contact");
  }
});

// contact data change form
app.get("/contact/edit/:name", (req, res) => {
  const contact = findContact(req.params.name);
  res.render("edit-contact", {
    layout: "layouts/mc",
    title: "contact data change form",
    contact,
  });
});

// proces change data update
app.post(
  "/contact/update",
  [
    body("name").custom((value, { req }) => {
      const duplicate = checkDuplicate(value);
      if (value !== req.body.oldName && duplicate) {
        throw new error("number is already in use");
      }
      return true;
    }),
    check("email", "invalid email").isEmail(),
    check("number", "invalid number").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        layout: "layouts/mc",
        title: "form change contact data",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContact(req.body);
      // // import message flash
      req.flash("msg", "Contact data successfully change");
      res.redirect("/contact");
    }
  }
);

// detail contact page
app.get("/contact/:name", (req, res) => {
  const contact = findContact(req.params.name);
  res.render("detail", {
    layout: "layouts/mc",
    title: "Detail page",
    contact,
  });
});

// process contact data
app.post(
  "/contact",
  [
    body("name").custom((value) => {
      const duplicate = checkDuplicate(value);
      if (duplicate) {
        throw new error("number is already in use");
      }
      return true;
    }),
    check("email", "invalid email").isEmail(),
    check("number", "invalid number").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        layout: "layouts/mc",
        title: "form add contact data",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // import message flash
      req.flash("msg", "Contact data successfully patched");
      res.redirect("/contact");
    }
  }
);

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
