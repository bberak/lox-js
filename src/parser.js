/*
Instead of repeating the rule name each time we want to add another production for it, we’ll allow a series of productions separated by a pipe (|).

bread → "toast" | "biscuits" | "English muffin" ;

Further, we’ll allow parentheses for grouping and then allow | within that to select one from a series of options within the middle of a production.

protein → ( "scrambled" | "poached" | "fried" ) "eggs" ;

Using recursion to support repeated sequences of symbols has a certain appealing purity, but it’s kind of a chore to make a separate named sub-rule each time we want to loop. So, we also use a postfix * to allow the previous symbol or group to be repeated zero or more times.

crispiness → "really" "really"* ;

This is how the Scheme programming language works. It has no built-in looping functionality at all. Instead, all repetition is expressed in terms of recursion.
A postfix + is similar, but requires the preceding production to appear at least once.

crispiness → "really"+ ;

A postfix ? is for an optional production. The thing before it can appear zero or one time, but not more.

breakfast → protein ( "with" breakfast "on the side" )? ;

---

expression     → equality ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
primary        → NUMBER | STRING | "true" | "false" | "nil"
               | "(" expression ")" ;
*/

const TokenType = require("./token-type");
const { Binary, Unary, Literal, Grouping } = require("./expressions");

class ParseError extends Error {
	constructor(token, message) {
		super(message);
		this.token = token;
		this.name = "ParseError";
	}
}

function Parser(tokens, onError) {
	let current = 0;

	const peek = () => tokens[current];

	const previous = () => tokens[current - 1];

	const isAtEnd = () => peek().type === TokenType.EOF;

	const advance = () => {
		if (!isAtEnd()) current++;
		return previous();
	};

	const check = (type) => {
		if (isAtEnd()) return false;
		return peek().type === type;
	};

	const error = (token, message) => {
		const e = new ParseError(token, message);
		onError && onError(e);
		return e;
	};

	const consume = (type, message) => {
		if (check(type)) return advance();

		throw error(peek(), message);
	};

	const match = (...types) => {
		for (let i = 0; i < types.length; i++) {
			const type = types[i];

			if (check(type)) {
				advance();
				return true;
			}
		}

		return false;
	};

	const synchronize = () => {
		advance();

		while (!isAtEnd()) {
			if (previous().type === TokenType.SEMICOLON) return;

			switch (peek().type) {
				case TokenType.CLASS:
				case TokenType.FUN:
				case TokenType.VAR:
				case TokenType.FOR:
				case TokenType.IF:
				case TokenType.WHILE:
				case TokenType.PRINT:
				case TokenType.RETURN:
					return;
				default:
					advance();
			}
		}
	};

	const equality = () => {
		let expression = comparison();

		while (match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
			const operator = previous();
			const right = comparison();
			expression = new Binary(expression, operator, right);
		}

		return expression;
	};

	const comparison = () => {
		let expression = term();

		while (match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
			const operator = previous();
			const right = term();
			expression = new Binary(expression, operator, right);
		}

		return expression;
	};

	const term = () => {
		let expression = factor();

		while (match(TokenType.MINUS, TokenType.PLUS)) {
			const operator = previous();
			const right = factor();
			expression = new Binary(expression, operator, right);
		}

		return expression;
	};

	const factor = () => {
		let expression = unary();

		while (match(TokenType.STAR, TokenType.SLASH)) {
			const operator = previous();
			const right = unary();
			expression = new Binary(expression, operator, right);
		}

		return expression;
	};

	const unary = () => {
		if (match(TokenType.BANG, TokenType.MINUS)) {
			const operator = previous();
			const right = unary();
			return new Unary(operator, right);
		}

		return primary();
	};

	const primary = () => {
		if (match(TokenType.FALSE)) return new Literal(false);
		if (match(TokenType.TRUE)) return new Literal(true);
		if (match(TokenType.NIL)) return new Literal(null);

		if (match(TokenType.NUMBER, TokenType.STRING)) return new Literal(previous().literal);

		if (match(TokenType.LEFT_PAREN)) {
			const expression = equality();
			consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
			return new Grouping(expression);
		}

		throw error(peek(), "Expect expression.");
	};

	const parse = () => {
		try {
			return equality();
		} catch (e) {
			if (e instanceof ParseError)
				return null;

			//-- If we get here, some other error has occurred such as an AssertionError from
			//-- a test suite or something else we didn't expect.
			throw e;
		}
	};

	return {
		parse,
	};
}

module.exports = Parser;
