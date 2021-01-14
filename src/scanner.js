const Token = require("./token");
const TokenType = require("./token-type");

function Scanner(source, onError) {
	let start = 0;
	let current = 0;
	let line = 1;
	let tokens = [];

	const isAtEnd = () => {
		return current >= source.length;
	};

	const advance = () => {
		current++;
		return source[current - 1];
	};

	const peek = () => source[current];

	const match = (expected) => {
		if (isAtEnd()) return false;
		if (peek() !== expected) return false;

		advance();
		return true;
	};

  	const string = () => {
  		while (peek() !== "\"" && !isAtEnd()) {
  			if (peek() === "\n") line++;
  			advance();
  		}

  		if (isAtEnd())
  			onError && onError(line, "Unterminated string.");

  		// The closing ".
  		advance();

  		// Trim the surrounding quotes.
  		const value = source.substring(start + 1, current - 1);
  		addToken(TokenType.STRING, value);
  	};

	const addToken = (type, literal = null) => {
		const text = source.substring(start, current);

		tokens.push(new Token(type, text, literal, line));
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
				addToken(match("=") ? TokenType.EQUAL_EQUAL: TokenType.EQUAL);
				break;
			case "<":
				addToken(match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
				break;
			case ">":
				addToken(match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
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
			case "\"": 
				string(); 
				break;
			default:
				onError && onError(line, `Unexpected character: ${char}`);
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
