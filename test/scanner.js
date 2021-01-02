const { assert } = require("chai");
const Scanner = require("../src/scanner");

describe("Scanner", function() {
  describe("#scanTokens()", function() {
    it("should return 0, 1, 2 when calling scanTokens", function() {
      const scanner = Scanner("Some source code");
      const tokens = scanner.scanTokens();

      assert.deepEqual(tokens, [0, 1, 2]);
    });
  });
});