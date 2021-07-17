const TokenType = require("./token-type");

class RuntimeError extends Error {
	constructor(token, message) {
		super(message);
		this.token = token;
	}
}

function Interpreter(expression, onError) {
	const evaluate = (expression) => expression.accept(this);

	const checkNumberOperand = (operator, operand) => {
		if (typeof operand === "number") return;
		throw new RuntimeError(operator, "Operand must be a number");
	};

	const checkNumberOperands = (operator, left, right) => {
		if (typeof left === "number" && typeof right === "number") return;
		throw new RuntimeError(operator, "Operands must be numbers.");
	};

	const stringify = (value) => {
		if (value === null) return "nil";
		return value.toString();
	};

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

	this.interpret = () => {
		try {
			const value = evaluate(expression);
			return stringify(value);
		} catch (err) {
			onError && onError(err);
		}
	};

	this.visitBinary = (binary) => {
		const operator = binary.operator;
		const left = evaluate(binary.left);
		const right = evaluate(binary.right);

		switch (operator.type) {
			case TokenType.MINUS:
				checkNumberOperands(operator, left, right);
				return left - right;

			case TokenType.PLUS:
				if (typeof left === "number" && typeof right === "number")
					return left + right;

				if (typeof left === "string" && typeof right === "string")
					return left + right;

				throw new RuntimeError(
					operator,
					"Operands must be two numbers or two strings."
				);

			case TokenType.SLASH:
				checkNumberOperands(operator, left, right);
				return left / right;

			case TokenType.STAR:
				checkNumberOperands(operator, left, right);
				return left * right;

			case TokenType.GREATER:
				checkNumberOperands(operator, left, right);
				return left > right;

			case TokenType.GREATER_EQUAL:
				checkNumberOperands(operator, left, right);
				return left >= right;

			case TokenType.LESS:
				checkNumberOperands(operator, left, right);
				return left < right;

			case TokenType.LESS_EQUAL:
				checkNumberOperands(operator, left, right);
				return left <= right;

			case TokenType.BANG_EQUAL:
				return !isEqual(left, right);

			case TokenType.EQUAL_EQUAL:
				return isEqual(left, right);

			default:
				throw new Error(`Cannot handle ${operator.type} operator`);
		}
	};

	this.visitGrouping = (grouping) => evaluate(grouping.expression);

	this.visitLiteral = (literal) => literal.value;

	this.visitUnary = (unary) => {
		const operator = unary.operator;
		const right = evaluate(unary.right);

		switch (operator.type) {
			case TokenType.MINUS:
				checkNumberOperand(operator, right);
				return -right;

			case TokenType.BANG:
				return !isTruthy(right);

			default:
				throw new Error(`Cannot handle ${operator.type} operator`);
		}
	};

	return this;
}

module.exports = Interpreter;
