const express = require("express");
const cookieParser = require("cookie-parser");
const req = require("express/lib/request");
const app = express();
const PORT = 3000; // default port 3000

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

function generateRandomString() {
	let result = "";
	while (result.length < 6) {
		let char = Math.floor(Math.random() * (123 - 48) + 48);
		if ((char >= 58 && char <= 64) || (char >= 91 && char <= 96)) {
			continue;
		}
		result += String.fromCharCode(char);
	}
	return result;
}
const urlDatabase = {
	b2xVn2: "http://www.lighthouselabs.ca",
	"9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
	res.send("Hello!");
});

app.get("/urls", (req, res) => {
	const templateVars = {
		username: req.cookies["username"],
		urls: urlDatabase,
	};
	res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
	res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
	res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
	const templateVars = {
		username: req.cookies["username"],
	};
	res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
	const templateVars = {
		username: req.cookies["username"],
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL],
	};
	res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
	const longURL = urlDatabase[req.params.shortURL];
	res.redirect(longURL);
});

app.post("/urls", (req, res) => {
	const short = generateRandomString();
	urlDatabase[short] = req.body.longURL;
	res.redirect(`/urls/${short}`);
});

app.post("/login", (req, res) => {
	const cookie = req.body.username;
	res.cookie("username", cookie);
	res.redirect("/urls");
});

app.post("/logout", (req, res) => {
	res.clearCookie("username");
	res.redirect("/urls");
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

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
