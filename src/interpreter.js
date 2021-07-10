const TokenType = require("./token-type");

function Interpreter(expression) {
	const evaluate = (expression) => expression.accept(this);

	const isTruthy = (value) => {
		//-- Lox has stricter definitions of truthiness than JavaScript
		if (value === null) return false;
		if (typeof value === "boolean") return value;

		return true;
	};

	const isEqual = (a, b) => {
		if (a === null && b === null) return true;
		if (a === null) return false;

		return a === b;
	};

	this.interpret = () => evaluate(expression);
	
	this.visitBinary = (binary) => {
		const operator = binary.operator;
		const left = evaluate(binary.left);
		const right = evaluate(binary.right);

		switch (operator.type) {
			case TokenType.MINUS: return left - right;
			case TokenType.PLUS:
				if (typeof left === "number" && typeof right === "number")
					return left + right;

				if (typeof left === "string" && typeof right === "string")
					return left + right;

				if (typeof left !== typeof right)
					throw new Error("Can only add operands of the same type");

				throw new Error("Can only add operands of type number or string");

			case TokenType.SLASH: return left / right;
			case TokenType.STAR: return left * right;
			case TokenType.GREATER: return left > right;
			case TokenType.GREATER_EQUAL: return left >= right;
			case TokenType.LESS: return left < right;
			case TokenType.LESS_EQUAL: return left <= right;
			case TokenType.BANG_EQUAL: return !isEqual(left, right);
			case TokenType.EQUAL_EQUAL: return isEqual(left, right);

			default: throw new Error(`Cannot handle ${operator.type} operator`);
		}
	};
	
	this.visitGrouping = (grouping) => evaluate(grouping.expression);
	
	this.visitLiteral = (literal) => literal.value;
	
	this.visitUnary = (unary) => {
		const operator = unary.operator;
		const right = evaluate(unary.right);

		switch (operator.type) {
			case TokenType.MINUS: return -right; 
			case TokenType.BANG: return !isTruthy(right);
			
			default: throw new Error(`Cannot handle ${operator.type} operator`);
		}
	};

	return this;
}

module.exports = Interpreter;