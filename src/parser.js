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

class Parser {
	#onError;
	#current;
	#tokens;

	constructor(onError) {
		this.#onError = onError;
	}

	peek() { 
		return this.#tokens[this.#current];
	}

	previous() {
		return this.#tokens[this.#current - 1];
	}

	isAtEnd() {
		return this.peek().type === TokenType.EOF;
	}

	advance() {
		if (!this.isAtEnd()) this.#current++;
		return this.previous();
	}

	check(type) {
		if (this.isAtEnd()) return false;
		return this.peek().type === type;
	}

	error(token, message) {
		const e = new ParseError(token, message);
		this.#onError && this.#onError(e);
		return e;
	}

	consume(type, message) {
		if (this.check(type)) return this.advance();

		throw this.error(this.peek(), message);
	}

	match(...types) {
		for (let i = 0; i < types.length; i++) {
			const type = types[i];

			if (this.check(type)) {
				this.advance();
				return true;
			}
		}

		return false;
	}

	synchronize() {
		this.advance();

		while (!this.isAtEnd()) {
			if (this.previous().type === TokenType.SEMICOLON) return;

			switch (this.peek().type) {
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
					this.advance();
			}
		}
	}

	equality() {
		let expression = this.comparison();

		while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
			const operator = this.previous();
			const right = this.comparison();
			expression = new Binary(expression, operator, right);
		}

		return expression;
	}

	comparison() {
		let expression = this.term();

		while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
			const operator = this.previous();
			const right = this.term();
			expression = new Binary(expression, operator, right);
		}

		return expression;
	};

	term() {
		let expression = this.factor();

		while (this.match(TokenType.MINUS, TokenType.PLUS)) {
			const operator = this.previous();
			const right = this.factor();
			expression = new Binary(expression, operator, right);
		}

		return expression;
	}

	factor() {
		let expression = this.unary();

		while (this.match(TokenType.STAR, TokenType.SLASH)) {
			const operator = this.previous();
			const right = this.unary();
			expression = new Binary(expression, operator, right);
		}

		return expression;
	}

	unary() {
		if (this.match(TokenType.BANG, TokenType.MINUS)) {
			const operator = this.previous();
			const right = this.unary();
			return new Unary(operator, right);
		}

		return this.primary();
	}

	primary() {
		if (this.match(TokenType.FALSE)) return new Literal(false);
		if (this.match(TokenType.TRUE)) return new Literal(true);
		if (this.match(TokenType.NIL)) return new Literal(null);

		if (this.match(TokenType.NUMBER, TokenType.STRING)) return new Literal(this.previous().literal);

		if (this.match(TokenType.LEFT_PAREN)) {
			const expression = this.equality();
			this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
			return new Grouping(expression);
		}

		throw this.error(this.peek(), "Expect expression.");
	}

	parse(tokens) {
		try {
			this.#current = 0;
			this.#tokens = tokens;

			return this.equality();
		} catch (e) {
			if (e instanceof ParseError)
				return null;

			//-- If we get here, some other error has occurred such as an AssertionError from
			//-- a test suite or something else we didn't expect.
			throw e;
		}
	}
}

module.exports = Parser;
