const { assert } = require("chai");
const { Printer, Unary, Binary, Literal, Grouping } = require("../src/expressions");
const Token = require("../src/token");
const TokenType = require("../src/token-type");
const Parser = require("../src/parser");

describe("Parser", function() {
	describe("#parse()", function() {
		it("should parse a simple binary expression correctly", function() {
			const tokens = [
				new Token(TokenType.NUMBER, "2", 2, 1),
				new Token(TokenType.PLUS, "+", null, 1), 
				new Token(TokenType.NUMBER, "3", 3, 1),
				new Token(TokenType.EOF, "", null, 1)
			];
			const parser = new Parser(tokens);
			const expression = parser.parse();

			assert.isNotNull(expression, "expression is null");
			assert.isTrue(expression instanceof Binary, "expression should be of type Binary");
			assert.isTrue(expression.left instanceof Literal, "expression.left should be of type Literal");
			assert.equal(expression.left.value, 2, "expression.left.value should equal 2");
			assert.isTrue(expression.operator instanceof Token, "expression.operator should be of type Token");
			assert.equal(expression.operator.type, TokenType.PLUS, `expression.operator.type should equal ${TokenType.PLUS}`)
			assert.isTrue(expression.right instanceof Literal, "expression.right should be of type Literal");
			assert.equal(expression.right.value, 3, "expression.right.value should equal 2");
		});

		it("should detect missing expression correctly", function() {
			let failed = false;

			const onError = (e) => { 
				failed = true;

				assert.equal(e.token.type, TokenType.EOF, `e.token.type should be ${TokenType.EOF}`);
				assert.equal(e.message, "Expect expression.", "Error message was incorrect");
			};

			const tokens = [
				new Token(TokenType.NUMBER, "2", 2, 1),
				new Token(TokenType.PLUS, "+", null, 1), 
				new Token(TokenType.EOF, "", null, 1)
			];
			
			const parser = new Parser(tokens, onError);
			const expression = parser.parse();

			assert.isNull(expression, "expression is not null");
			assert.equal(failed, true, "onError was not called")
		});

		it("should detect missing ')' correctly", function() {
			let failed = false;

			const onError = (e) => { 
				failed = true;

				assert.equal(e.token.type, TokenType.EOF, `e.token.type should be ${TokenType.EOF}`);
				assert.equal(e.message, "Expect ')' after expression.", "Error message was incorrect");
			};

			const tokens = [
				new Token(TokenType.LEFT_PAREN, "(", null, 1),
				new Token(TokenType.NUMBER, "2", 2, 1),
				new Token(TokenType.PLUS, "+", null, 1), 
				new Token(TokenType.NUMBER, "3", 3, 1),
				new Token(TokenType.EOF, "", null, 1)
			];
			
			const parser = new Parser(tokens, onError);
			const expression = parser.parse();

			assert.isNull(expression, "expression is not null");
			assert.equal(failed, true, "onError was not called")
		});
	});
});
