const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const {
	createUser,
	generateRandomString,
	authenticateUser,
} = require("./data/helpers");
const { users, urlDatabase } = require("./data/database");

const PORT = 3000;

const app = express();

app.set("etag", false);
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	const { email, password } = req.body;
	const { error, data } = createUser(email, password, users);
	if (error) {
		return res.status(400).send(error);
	}
	res.cookie("user_id", data.id);
	res.redirect("/urls");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", (req, res) => {
	const { error, data } = authenticateUser(req.body, users);
	if (error) {
		return res.status(403).send(error);
	}
	res.cookie("user_id", data);
	res.redirect("/urls");
});

app.get("/urls", (req, res) => {
	const loginID = req.cookies["user_id"];
	const templateVars = {
		user: users[loginID],
		urls: urlDatabase,
	};
	res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
	if (!req.cookies["user_id"]) {
		return res.redirect(401, "/login");
	}
	const short = generateRandomString();
	urlDatabase[short] = req.body.longURL;
	res.redirect(`/urls/${short}`);
});

app.get("/urls.json", (req, res) => {
	res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
	if (!req.cookies["user_id"]) {
		return res.redirect(401, "/login");
	}
	const templateVars = {
		user: users[req.cookies["user_id"]],
	};
	res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
	const templateVars = {
		user: users[req.cookies["user_id"]],
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL],
	};
	res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
	const id = req.params.shortURL;
	urlDatabase[id] = req.body.newURL;
	res.redirect(`/urls/${id}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
	delete urlDatabase[req.params.shortURL];
	res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
	const longURL = urlDatabase[req.params.shortURL];
	res.redirect(longURL);
});

app.post("/logout", (req, res) => {
	res.clearCookie("user_id");
	res.redirect("/urls");
});

app.listen(PORT, () => {
	console.log(`TinyApp listening on port ${PORT}!`);
});
