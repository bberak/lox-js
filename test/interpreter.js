const { assert } = require("chai");
const { Unary, Binary, Literal, Grouping } = require("../src/expressions");
const Interpreter = require("../src/interpreter");
const Token = require("../src/token");
const TokenType = require("../src/token-type");

describe("Interpeter", function() {
	describe("#intepret()", function() {
		it("should interpret an expression correctly", function() {
			const expression = new Binary(
				new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
				new Token(TokenType.STAR, "*", null, 1),
				new Grouping(new Literal(45.67))
			);
			const interpreter = new Interpreter();
			const result = interpreter.interpret(expression);

			assert.isNotEmpty(result, "result is empty");
			assert.equal(result, "-5617.41", "interpret result is incorrect");
		});

		it("should interpret an expression correctly", function() {
			const expression = new Binary(
				new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
				new Token(TokenType.STAR, "*", null, 1),
				new Grouping(new Binary(new Literal(3), new Token(TokenType.PLUS, "+", null, 1), new Literal(4)))
			);
			const interpreter = new Interpreter();
			const result = interpreter.interpret(expression);

			assert.isNotEmpty(result, "result is empty");
			assert.equal(result, "-861", "interpret result is incorrect");
		});

		it("should throw runtime error", function() {
			let failed = false;

			const onError = (e) => { 
				failed = true;
				
				assert.equal(e.token.type, TokenType.MINUS, "types mismatch");
				assert.equal(e.token.line, 1, "line numbers mismatch");
				assert.equal(e.message, "Operand must be a number.", "error messages mismatch");
			};

			const expression = new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal("abc"));
			const interpreter = new Interpreter(onError);
			const result = interpreter.interpret(expression);

			assert.isUndefined(result, "result was not undefined");
			assert.equal(failed, true, "onError was not called")
		});
	});
});
