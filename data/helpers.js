function createUser(email, password, database) {
	if (!email || !password || password.length < 6) {
		return { error: "Invalid Fields", data: null };
	}
	for (const user in database) {
		if (database[user].email === email) {
			return { error: "Email already in use!", data: null };
		}
	}
	const user = {
		id: generateRandomString(),
		email,
		password,
	};
	database[user.id] = user;
	return { error: null, data: user };
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

function authenticateUser(userLogin, database, cb) {
	const { email, password } = userLogin;

	for (const user in database) {
		if (database[user]["email"] === email) {
			if (!cb(password, database[user]["password"])) {
				return { error: "Password not match", data: null };
			}
			return { error: null, data: database[user].id };
		}
	}
	return { error: "User not found", data: null };
}

function urlsForUser(id, urlDB) {
	let result = {};
	for (let url in urlDB) {
		if (id === urlDB[url].userID) {
			result[url] = urlDB[url];
		}
	}
	return result;
}

module.exports = {
	createUser,
	generateRandomString,
	authenticateUser,
	urlsForUser,
};
