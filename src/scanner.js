const Token = require("./token");

function Scanner() {
	return {
		scanTokens() {
			return [Token.X, Token.Y, Token.Z]
		}
	}
}

module.exports = Scanner;