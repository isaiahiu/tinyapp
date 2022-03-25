function createUser(email, password, database) {
	//check for existing user
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
	database[user.id] = user; //creates new user into database
	return { error: null, data: user };
}

function generateRandomString() {
	// returns a random alphanumeric A-Z, a-z, 0-9, six character long string
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
	//returns appropriate error messages and user data
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
	// return object containing all urls that belong to id
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
