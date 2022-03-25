// All the requires below //
const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const {
	createUser,
	generateRandomString,
	authenticateUser,
	urlsForUser,
} = require("./data/helpers");
const { users, urlDatabase } = require("./data/database");

const PORT = 3000; // default port

const app = express();

app.set("etag", false);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		name: "session",
		keys: ["key1", "key2"],
	})
);

// Routing Handlers and Endpoints below //

app.get("/", (req, res) => {
	if (!req.session.user_id) {
		return res.redirect("/login");
	}
	res.redirect("/urls");
});

app.get("/register", (req, res) => {
	if (req.session.user_id) {
		return res.redirect("/urls");
	}
	res.render("register");
});

// Verifies for valid user inputs fields before hashing password and creating new user
app.post("/register", (req, res) => {
	if (!req.body.email || !req.body.password || req.body.password.length < 6) {
		return res.send("Invalid Fields");
	}
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = bcrypt.hashSync(req.body.password, salt);
	const { error, data } = createUser(req.body.email, hashedPassword, users);

	if (error) {
		// in the case email already in use
		return res.status(400).send(error);
	}
	req.session.user_id = data.id;
	res.redirect("/urls");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", (req, res) => {
	const { error, data } = authenticateUser(req.body, users, bcrypt.compareSync);
	if (error) {
		return res.status(403).send(error);
	}
	req.session.user_id = data;
	res.redirect("/urls");
});

app.get("/urls", (req, res) => {
	// Creates a generated list of URLs that belong to user into an object to render into "urls_index"
	const templateVars = {
		user: users[req.session.user_id],
		urls: urlsForUser(req.session.user_id, urlDatabase), // Helper function here to create url list as objects
	};
	res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
	// If not logged in, users cannot creating new links, redirect to login page
	if (!req.session.user_id) {
		return res.redirect(401, "/login");
	}
	const short = generateRandomString(); 
	urlDatabase[short] = { // creates new short Url object and adds to existing urlDatabase
		longURL: req.body.longURL,
		userID: req.session.user_id,
	};
	res.redirect(`/urls/${short}`);
});

app.get("/urls.json", (req, res) => { 
	res.json(urlDatabase);
});

app.get("/users.json", (req, res) => {
	res.json(users);
});

app.get("/urls/new", (req, res) => {
	if (!req.session.user_id) {
		return res.redirect(401, "/login");
	}
	const templateVars = {
		user: users[req.session.user_id],
	};
	res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
	if (!urlDatabase[req.params.shortURL]) {
		return res.status(404).send("Short Url hasn't been created (yet)");
	}
	if (!req.session.user_id) {
		return res.status(401).send("Please log in!");
	}
	if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
		return res.send("URL does not belong to you!");
	}
	const templateVars = {
		user: users[req.session.user_id],
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL].longURL,
	};
	res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
	if (!urlDatabase[req.params.shortURL]) {
		return res.status(404).send("Short Url hasn't been created (yet)");
	}
	if (!req.session.user_id) {
		return res.status(401).send("Please log in!");
	}
	if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
		return res.send("URL does not belong to you!");
	}
	const id = req.params.shortURL;
	urlDatabase[id].longURL = req.body.newURL;
	res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
	if (!req.session.user_id) {
		return res.status(401).send("Please log in!");
	}
	if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
		return res.send("URL does not belong to you!");
	}
	delete urlDatabase[req.params.shortURL];
	res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
	if (!urlDatabase[req.params.shortURL]) {
		return res.redirect(404, "/urls");
	}
	const longURL = urlDatabase[req.params.shortURL].longURL;
	res.redirect(longURL);
});

app.post("/logout", (req, res) => {
	req.session = null;
	res.redirect("/urls");
});

app.listen(PORT, () => {
	console.log(`TinyApp listening on port ${PORT}!`);
});
