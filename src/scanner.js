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

function Scanner(source, onError) {
	let start = 0;
	let current = 0;
	let line = 1;
	let tokens = [];

	const isAtEnd = () => {
		return current >= source.length;
	};

	const isDigit = (char) => {
		return char >= "0" && char <= "9";
	};

	const isAlpha = (char) => {
		return (
			(char >= "a" && char <= "z") ||
			(char >= "A" && char <= "Z") ||
			char === "_"
		);
	};

	const isAlphaNumeric = (char) => {
		return isAlpha(char) || isDigit(char);
	};

	const advance = () => {
		current++;
		return source[current - 1];
	};

	const peek = () => source[current];

	const peekNext = () => source[current + 1];

	const match = (expected) => {
		if (isAtEnd()) return false;
		if (peek() !== expected) return false;

		advance();
		return true;
	};

	const string = () => {
		while (peek() !== '"' && !isAtEnd()) {
			if (peek() === "\n") line++;
			advance();
		}

		if (isAtEnd()) onError && onError(new ScanError(line, "Unterminated string."));

		// The closing ".
		advance();

		// Trim the surrounding quotes.
		const value = source.substring(start + 1, current - 1);
		addToken(TokenType.STRING, value);
	};

	const number = () => {
		while (isDigit(peek())) advance();

		// Look for a fractional part.
		if (peek() === "." && isDigit(peekNext())) {
			// Consume the "."
			advance();

			while (isDigit(peek())) advance();
		}

		const value = parseFloat(source.substring(start, current));
		addToken(TokenType.NUMBER, value);
	};

	const identifier = () => {
		while (isAlphaNumeric(peek())) advance();

		const lexeme = source.substring(start, current);
		const type = keywords[lexeme] || TokenType.IDENTIFIER;

		addToken(type);
	};

	const addToken = (type, literal = null) => {
		const lexeme = source.substring(start, current);

		tokens.push(new Token(type, lexeme, literal, line));
	};

	const scanToken = () => {
		const char = advance();

		switch (char) {
			case "(":
				addToken(TokenType.LEFT_PAREN);
				break;
			case ")":
				addToken(TokenType.RIGHT_PAREN);
				break;
			case "{":
				addToken(TokenType.LEFT_BRACE);
				break;
			case "}":
				addToken(TokenType.RIGHT_BRACE);
				break;
			case ",":
				addToken(TokenType.COMMA);
				break;
			case ".":
				addToken(TokenType.DOT);
				break;
			case "-":
				addToken(TokenType.MINUS);
				break;
			case "+":
				addToken(TokenType.PLUS);
				break;
			case ";":
				addToken(TokenType.SEMICOLON);
				break;
			case "*":
				addToken(TokenType.STAR);
				break;
			case "!":
				addToken(match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
				break;
			case "=":
				addToken(match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
				break;
			case "<":
				addToken(match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
				break;
			case ">":
				addToken(
					match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
				);
				break;
			case "/":
				if (match("/")) {
					// A comment goes until the end of the line.
					while (peek() !== "\n" && !isAtEnd()) {
						advance();
					}
				} else {
					addToken(TokenType.SLASH);
				}
				break;
			case " ":
			case "\r":
			case "\t":
				// Ignore whitespace.
				break;
			case "\n":
				line++;
				break;
			case '"':
				string();
				break;
			default:
				if (isDigit(char)) {
					number();
				} else if (isAlpha(char)) {
					identifier();
				} else {
					onError && onError(new ScanError(line, `Unexpected character: ${char}`));
				}
				break;
		}
	};

	const scanTokens = () => {
		while (!isAtEnd()) {
			// We are at the beginning of the next lexeme.
			start = current;
			scanToken();
		}

		tokens.push(new Token(TokenType.EOF, "", null, line));

		return tokens;
	};

	return {
		scanTokens,
	};
}

module.exports = Scanner;
