const { assert } = require("chai");
const { AstPrinter, Unary, Binary, Literal, Grouping } = require("../src/ast");
const Token = require("../src/token");
const TokenType = require("../src/token-type");

describe("AstPrinter", function() {
	describe("#print()", function() {
		it("should print an expression correctly", function() {
			const printer = new AstPrinter();
			const expression = Binary(
				new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
				new Token(TokenType.STAR, "*", null, 1),
				new Grouping(new Literal(45.67))
			);
			const result = printer.print(expression);

			assert.isNotEmpty(result, "print result it empty");
			assert.equal(result, "(* (- 123) (group 45.67))", "print result is incorrect");
		});

		it("should print an expression correctly", function() {
			const printer = new AstPrinter();
			const expression = Binary(
				new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
				new Token(TokenType.STAR, "*", null, 1),
				new Grouping(new Binary(new Literal(3), new Token(TokenType.PLUS, "+", null, 1), new Literal(4)))
			);
			const result = printer.print(expression);

			assert.isNotEmpty(result, "print result it empty");
			assert.equal(result, "(* (- 123) (group (+ 3 4)))", "print result is incorrect");
		});
	});
});
