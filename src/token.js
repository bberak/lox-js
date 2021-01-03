function Token(type, lexeme, literal, line) {
	this.type = type;
	this.lexeme = lexeme;
	this.literal = literal;
	this.line = line;
	this.toString = () => `${type} ${lexeme} ${literal}`;
}

module.exports = Token;
