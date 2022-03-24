const { assert } = require("chai");

const {
	createUser,
	generateRandomString,
	authenticateUser,
	urlsForUser,
} = require("..helpers");

const testUsers = {
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

describe("getUserByEmail", function () {
	it("should return a user with valid email", function () {
		const user = getUserByEmail("user@example.com", testUsers);
		const expectedUserID = "userRandomID";
		// Write your assert statement here
	});
});

describe("createUser", function () {
	it("should create a new user", function () {});
});
