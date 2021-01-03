const { assert } = require("chai");
const Scanner = require("../src/scanner");
const TokenType = require("../src/token-type");

describe("Scanner", function() {
	describe("#scanTokens()", function() {
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

		it("should identify unexpected character", function() {
			let failed = false;

			const onError = (line, message) => { 
				failed = true;

				assert.equal(line, 1, "line numbers mismatch");
				assert.equal(message, "Unexpected character: @", "error messages mismatch");
			};

			const scanner = new Scanner("@", onError);
			const tokens = scanner.scanTokens();

			assert.equal(failed, true, "onError was not called")
		});

		it("should identify unexpected characters", function() {
			let failed = false;
			let errorIndex = 0;

			const onError = (line, message) => {
				assert.equal(line, 1, "line numbers mismatch");
				assert.equal(message, ["Unexpected character: @", "Unexpected character: !"][errorIndex], "error messages mismatch");
				
				failed = true;
				errorIndex++;
			};

			const scanner = new Scanner("@!", onError);
			const tokens = scanner.scanTokens();

			assert.equal(failed, true, "onError was not called")
		});

		xit("should identify unexpected characters on different lines", function() {
			let failed = false;
			let errorIndex = 0;

			const onError = (line, message) => { 
				assert.equal(line, [2, 3][errorIndex], "line numbers mismatch");
				assert.equal(message, ["Unexpected character: @", "Unexpected character: !"][errorIndex], "error messages mismatch");
				
				failed = true;
				errorIndex++;
			};

			const source = `
				@
				!
			`;

			const scanner = new Scanner(source, onError);
			const tokens = scanner.scanTokens();

			assert.equal(failed, true, "onError was not called")
		});
	});
});
