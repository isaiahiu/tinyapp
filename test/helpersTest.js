const { assert } = require("chai");

const {
	createUser,
	generateRandomString,
	authenticateUser,
	urlsForUser,
} = require("../data/helpers");

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

describe("createUser", () => {
	it("should return a new user object and add user to database", () => {
		const email = "123@test.com";
		const password = "123456";
		const user = createUser(email, password, testUsers);
		assert.equal(user.data, testUsers[user.data.id]);
	});
	it("should return with an error string if email already in use", () => {
		const email = "user@example.com";
		const password = "123456";
		const user = createUser(email, password, testUsers);
		assert.isString(user.error);
	});
});

describe("generateRandomString", () => {
	it("should create alphanumeric string six characters long", () => {
		const str = generateRandomString();
		assert.isString(str);
		assert.isTrue(str.length === 6);
	});
});

describe("authenticateUser", () => {
	it("should return an object with error: null and data as a user object from a database if email and password match ", () => {
		const loginObj = {
			email: "user2@example.com",
			password: "dishwasher-funk",
		};
		const user = authenticateUser(loginObj, testUsers, (x, y) => {
			return x === y ? true : false;
		});
		assert.deepEqual(user.data, testUsers.user2RandomID);
	});
});
