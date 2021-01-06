const { assert } = require("chai");
const Scanner = require("../src/scanner");
const TokenType = require("../src/token-type");

describe("Scanner", function() {
	describe("#scanTokens()", function() {
		it("should always append EOF token", function() {
			const scanner = new Scanner("");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens.length, 1, "tokens length mismatch");
			assert.equal(tokens[0].type, TokenType.EOF, "types mismatch");
			assert.equal(tokens[0].lexeme, "", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.EOF}  null`, "toString values mismatch");
		});

		it("should identify LEFT_PAREN token", function() {
			const scanner = new Scanner("(");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens[0].type, TokenType.LEFT_PAREN, "types mismatch");
			assert.equal(tokens[0].lexeme, "(", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.LEFT_PAREN} ( null`, "toString values mismatch");
		});

		it("should identify SLASH token", function() {
			const scanner = new Scanner("/");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens[0].type, TokenType.SLASH, "types mismatch");
			assert.equal(tokens[0].lexeme, "/", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.SLASH} / null`, "toString values mismatch");
		});

		it("should ignore comments", function() {
			const scanner = new Scanner("//+-whatever");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens[0].type, TokenType.EOF, "types mismatch");
			assert.equal(tokens[0].lexeme, "", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.EOF}  null`, "toString values mismatch");
		});

		it("should ignore whitespaces", function() {
			const scanner = new Scanner(" \r \t");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens[0].type, TokenType.EOF, "types mismatch");
			assert.equal(tokens[0].lexeme, "", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.EOF}  null`, "toString values mismatch");
		});

		it("should identify BANG token", function() {
			const scanner = new Scanner("!");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens[0].type, TokenType.BANG, "types mismatch");
			assert.equal(tokens[0].lexeme, "!", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.BANG} ! null`, "toString values mismatch");
		});

		it("should identify BANG_EQUAL token", function() {
			const scanner = new Scanner("!=");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens[0].type, TokenType.BANG_EQUAL, "types mismatch");
			assert.equal(tokens[0].lexeme, "!=", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.BANG_EQUAL} != null`, "toString values mismatch");
		});

		it("should identify EQUAL token", function() {
			const scanner = new Scanner("=");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens[0].type, TokenType.EQUAL, "types mismatch");
			assert.equal(tokens[0].lexeme, "=", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.EQUAL} = null`, "toString values mismatch");
		});

		it("should identify EQUAL_EQUAL token", function() {
			const scanner = new Scanner("==");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.equal(tokens[0].type, TokenType.EQUAL_EQUAL, "types mismatch");
			assert.equal(tokens[0].lexeme, "==", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.EQUAL_EQUAL} == null`, "toString values mismatch");
		});

		it("should identify valid tokens on different lines", function() {
			const scanner = new Scanner("!\n=");
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.isOk(tokens.length >= 2, "tokens length mismatch");

			assert.equal(tokens[0].type, TokenType.BANG, "types mismatch");
			assert.equal(tokens[0].lexeme, "!", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 1, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.BANG} ! null`, "toString values mismatch");

			assert.equal(tokens[1].type, TokenType.EQUAL, "types mismatch");
			assert.equal(tokens[1].lexeme, "=", "lexemes mismatch");
			assert.equal(tokens[1].literal, null, "literals mismatch");
			assert.equal(tokens[1].line, 2, "line numbers mismatch");
			assert.equal(tokens[1].toString(), `${TokenType.EQUAL} = null`, "toString values mismatch");
		});

		it("should identify valid tokens on different lines", function() {
			const source = `
				!
				=
			`;

			const scanner = new Scanner(source);
			const tokens = scanner.scanTokens();

			assert.isNotEmpty(tokens, "tokens are empty");
			assert.isOk(tokens.length >= 2, "tokens length mismatch");

			assert.equal(tokens[0].type, TokenType.BANG, "types mismatch");
			assert.equal(tokens[0].lexeme, "!", "lexemes mismatch");
			assert.equal(tokens[0].literal, null, "literals mismatch");
			assert.equal(tokens[0].line, 2, "line numbers mismatch");
			assert.equal(tokens[0].toString(), `${TokenType.BANG} ! null`, "toString values mismatch");

			assert.equal(tokens[1].type, TokenType.EQUAL, "types mismatch");
			assert.equal(tokens[1].lexeme, "=", "lexemes mismatch");
			assert.equal(tokens[1].literal, null, "literals mismatch");
			assert.equal(tokens[1].line, 3, "line numbers mismatch");
			assert.equal(tokens[1].toString(), `${TokenType.EQUAL} = null`, "toString values mismatch");
		});

		it("should identify unexpected character", function() {
			let failed = false;

			const onError = (line, message) => { 
				failed = true;

				assert.equal(line, 1, "line numbers mismatch");
				assert.equal(message, "Unexpected character: @", "error messages mismatch");
			};

			const scanner = new Scanner("@", onError);
			scanner.scanTokens();

			assert.equal(failed, true, "onError was not called")
		});

		it("should identify unexpected characters", function() {
			let failed = false;
			let errorIndex = 0;

			const onError = (line, message) => {
				assert.equal(line, 1, "line numbers mismatch");
				assert.equal(message, ["Unexpected character: @", "Unexpected character: ^"][errorIndex], "error messages mismatch");
				
				failed = true;
				errorIndex++;
			};

			const scanner = new Scanner("@^", onError);
			scanner.scanTokens();

			assert.equal(failed, true, "onError was not called")
		});

		it("should identify unexpected characters on different lines", function() {
			let failed = false;
			let errorIndex = 0;

			const onError = (line, message) => { 
				assert.equal(line, [2, 3][errorIndex], "line numbers mismatch");
				assert.equal(message, ["Unexpected character: @", "Unexpected character: ^"][errorIndex], "error messages mismatch");
				
				failed = true;
				errorIndex++;
			};

			const source = `
				@
				^
			`;

			const scanner = new Scanner(source, onError);
			scanner.scanTokens();

			assert.equal(failed, true, "onError was not called")
		});
	});
});
