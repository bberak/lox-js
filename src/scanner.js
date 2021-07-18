const Token = require("./token");
const TokenType = require("./token-type");

const keywords = {
	"and": TokenType.AND,
	"class": TokenType.CLASS,
	"else": TokenType.ELSE,
	"false": TokenType.FALSE,
	"for": TokenType.FOR,
	"fun": TokenType.FUN,
	"if": TokenType.IF,
	"nil": TokenType.NIL,
	"or": TokenType.OR,
	"print": TokenType.PRINT,
	"return": TokenType.RETURN,
	"super": TokenType.SUPER,
	"this": TokenType.THIS,
	"true": TokenType.TRUE,
	"var": TokenType.VAR,
	"while": TokenType.WHILE
};

class ScanError extends Error {
	constructor(line, message) {
		super(message);
		this.line = line;
		this.name = "ScanError";
	}
}

class Scanner {
	#onError;
	#start;
	#current;
	#line;
	#tokens;
	#source;

	constructor(onError) {
		this.#onError = onError;
	}

	isAtEnd() {
		return this.#current >= this.#source.length;
	}

	isDigit(char) {
		return char >= "0" && char <= "9";
	}

	isAlpha(char) {
		return (
			(char >= "a" && char <= "z") ||
			(char >= "A" && char <= "Z") ||
			char === "_"
		);
	}

	isAlphaNumeric(char) {
		return this.isAlpha(char) || this.isDigit(char);
	}

	advance() {
		this.#current++;
		return this.#source[this.#current - 1];
	}

	peek() { 
		return this.#source[this.#current];
	}

	peekNext() {
		return this.#source[this.#current + 1];
	}

	match(expected) {
		if (this.isAtEnd()) return false;
		if (this.peek() !== expected) return false;

		this.advance();
		return true;
	}

	string() {
		while (this.peek() !== '"' && !this.isAtEnd()) {
			if (this.peek() === "\n") this.#line++;
			this.advance();
		}

		if (this.isAtEnd()) this.#onError && this.#onError(new ScanError(this.#line, "Unterminated string."));

		// The closing ".
		this.advance();

		// Trim the surrounding quotes.
		const value = this.#source.substring(this.#start + 1, this.#current - 1);
		this.addToken(TokenType.STRING, value);
	}

	number() {
		while (this.isDigit(this.peek())) this.advance();

		// Look for a fractional part.
		if (this.peek() === "." && this.isDigit(this.peekNext())) {
			// Consume the "."
			this.advance();

			while (this.isDigit(this.peek())) this.advance();
		}

		const value = parseFloat(this.#source.substring(this.#start, this.#current));
		this.addToken(TokenType.NUMBER, value);
	}

	identifier() {
		while (this.isAlphaNumeric(this.peek())) this.advance();

		const lexeme = this.#source.substring(this.#start, this.#current);
		const type = keywords[lexeme] || TokenType.IDENTIFIER;

		this.addToken(type);
	};

	addToken(type, literal = null) {
		const lexeme = this.#source.substring(this.#start, this.#current);

		this.#tokens.push(new Token(type, lexeme, literal, this.#line));
	}

	scanToken() {
		const char = this.advance();

		switch (char) {
			case "(":
				this.addToken(TokenType.LEFT_PAREN);
				break;
			case ")":
				this.addToken(TokenType.RIGHT_PAREN);
				break;
			case "{":
				this.addToken(TokenType.LEFT_BRACE);
				break;
			case "}":
				this.addToken(TokenType.RIGHT_BRACE);
				break;
			case ",":
				this.addToken(TokenType.COMMA);
				break;
			case ".":
				this.addToken(TokenType.DOT);
				break;
			case "-":
				this.addToken(TokenType.MINUS);
				break;
			case "+":
				this.addToken(TokenType.PLUS);
				break;
			case ";":
				this.addToken(TokenType.SEMICOLON);
				break;
			case "*":
				this.addToken(TokenType.STAR);
				break;
			case "!":
				this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
				break;
			case "=":
				this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
				break;
			case "<":
				this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
				break;
			case ">":
				this.addToken(
					this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
				);
				break;
			case "/":
				if (this.match("/")) {
					// A comment goes until the end of the line.
					while (this.peek() !== "\n" && !this.isAtEnd()) {
						this.advance();
					}
				} else {
					this.addToken(TokenType.SLASH);
				}
				break;
			case " ":
			case "\r":
			case "\t":
				// Ignore whitespace.
				break;
			case "\n":
				this.#line++;
				break;
			case '"':
				this.string();
				break;
			default:
				if (this.isDigit(char)) {
					this.number();
				} else if (this.isAlpha(char)) {
					this.identifier();
				} else {
					this.#onError && this.#onError(new ScanError(this.#line, `Unexpected character: ${char}`));
				}
				break;
		}
	}

	scanTokens(source) {
		this.#start = 0;
		this.#current = 0;
		this.#line = 1;
		this.#tokens = [];
		this.#source = source;

		while (!this.isAtEnd()) {
			// We are at the beginning of the next lexeme.
			this.#start = this.#current;
			this.scanToken();
		}

		this.#tokens.push(new Token(TokenType.EOF, "", null, this.#line));

		return this.#tokens;
	}
}

module.exports = Scanner;
