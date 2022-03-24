function createUser(email, password, usersObj) {
	if (!email || !password || password.length < 6) {
		return { error: "Invalid Fields", data: null };
	}
	for (const user in usersObj) {
		if (usersObj[user].email === email) {
			return { error: "Email already in use!", data: null };
		}
	}
	const user = {
		id: generateRandomString(),
		email,
		password,
	};
	usersObj[user.id] = user;
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

function authenticateUser(reqObj, usersObj) {
	const { email, password } = reqObj;

	for (const user in usersObj) {
		if (usersObj[user]["email"] === email) {
			if (usersObj[user].password !== password) {
				return { error: "Password not match", data: null };
			}
			return { error: null, data: usersObj[user].id };
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
