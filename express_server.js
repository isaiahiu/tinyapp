const express = require("express");
const cookieParser = require("cookie-parser");
const req = require("express/lib/request");
const app = express();
const PORT = 3000; // default port 3000

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const res = require("express/lib/response");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

function userSearch(reqObj, usersObj) {
	for (let user in usersObj) {
		console.log(`user is: `, user);
		console.log(`reqObj.email is: `, reqObj.email);
		console.log(`user email is : `, usersObj[user].email);
		console.log(``);
		if (reqObj.email === usersObj[user].email) {
			return true;
		}
		return false;
	}
}

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
const users = {
	userRandomID: {
		id: "userRandomID",
		email: "user@example.com",
		password: "purple-monkey-dinosaur",
	},
	user2RandomID: {
		id: "user2RandomID",
		email: "user2@example.com",
		password: "dishwasher-funk",
	},
};
app.get("/", (req, res) => {
	res.send("Hello!");
});

app.get("/hello", (req, res) => {
	res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/urls", (req, res) => {
	const loginID = req.cookies["user_id"];
	const templateVars = {
		user: users[loginID],
		urls: urlDatabase,
	};
	// console.log("user key is: ", loginID);
	// console.log("users object is: ", users);
	// console.log("templateVars is : ", templateVars);
	res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
	res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
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

app.get("/u/:shortURL", (req, res) => {
	const longURL = urlDatabase[req.params.shortURL];
	res.redirect(longURL);
});

app.post("/register", (req, res) => {
	if (!req.body.email || !req.body.password || req.body.password.length < 6) {
		return res.status(400).send("Invalid Fields");
	}
	if (userSearch(req.body, users)) {
		return res.status(400).send("Email already in use!");
	}
	const newId = generateRandomString();
	const user = {
		id: newId,
		email: req.body.email,
		password: req.body.password,
	};
	users[newId] = user;
	res.cookie("user_id", newId);
	console.log(users);
	res.redirect("/urls");
});

app.post("/urls", (req, res) => {
	const short = generateRandomString();
	urlDatabase[short] = req.body.longURL;
	res.redirect(`/urls/${short}`);
});

app.post("/login", (req, res) => {
	const templateVars = {
		user: users[req.cookies["user_id"]],
	};
	// console.log("user key is: ", loginID);
	// console.log("users object is: ", users);
	// console.log("templateVars is : ", templateVars);
	res.redirect("/urls");
});

app.post("/logout", (req, res) => {
	res.clearCookie("user_id");
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
	console.log(`TinyApp listening on port ${PORT}!`);
});
