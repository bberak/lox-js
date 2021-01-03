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

	const addToken = (type, literal = null) => {
		const text = source.substr(start, current);
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
