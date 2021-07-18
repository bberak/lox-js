const TokenType = require("./token-type");

class RuntimeError extends Error {
	constructor(token, message) {
		super(message);
		this.token = token;
	}
}

class Interpreter {
	#onError;

	constructor(onError) {
		this.#onError = onError;
	}

	evaluate(expression) { 
		return expression.accept(this);
	}

	checkNumberOperand(operator, operand) {
		if (typeof operand === "number") return;
		throw new RuntimeError(operator, "Operand must be a number.");
	}

	checkNumberOperands(operator, left, right) {
		if (typeof left === "number" && typeof right === "number") return;
		throw new RuntimeError(operator, "Operands must be numbers.");
	}

	stringify(value) {
		if (value === null) return "nil";
		return value.toString();
	}

	isTruthy(value) {
		//-- Lox has stricter definitions of truthiness than JavaScript
		if (value === null) return false;
		if (typeof value === "boolean") return value;

		return true;
	}

	isEqual(a, b) {
		if (a === null && b === null) return true;
		if (a === null) return false;

		return a === b;
	}

	interpret(expression) {
		try {
			const value = this.evaluate(expression);
			return this.stringify(value);
		} catch (err) {
			this.#onError && this.#onError(err);
		}
	}

	visitBinary(binary) {
		const operator = binary.operator;
		const left = this.evaluate(binary.left);
		const right = this.evaluate(binary.right);

		switch (operator.type) {
			case TokenType.MINUS:
				this.checkNumberOperands(operator, left, right);
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
				this.checkNumberOperands(operator, left, right);
				return left / right;

			case TokenType.STAR:
				this.checkNumberOperands(operator, left, right);
				return left * right;

			case TokenType.GREATER:
				this.checkNumberOperands(operator, left, right);
				return left > right;

			case TokenType.GREATER_EQUAL:
				this.checkNumberOperands(operator, left, right);
				return left >= right;

			case TokenType.LESS:
				this.checkNumberOperands(operator, left, right);
				return left < right;

			case TokenType.LESS_EQUAL:
				this.checkNumberOperands(operator, left, right);
				return left <= right;

			case TokenType.BANG_EQUAL:
				return !this.isEqual(left, right);

			case TokenType.EQUAL_EQUAL:
				return this.isEqual(left, right);

			default:
				throw new Error(`Cannot handle ${operator.type} operator`);
		}
	}

	visitGrouping(grouping) {
		return this.evaluate(grouping.expression);
	}

	visitLiteral(literal) {
		return literal.value;
	}

	visitUnary(unary) {
		const operator = unary.operator;
		const right = this.evaluate(unary.right);

		switch (operator.type) {
			case TokenType.MINUS:
				this.checkNumberOperand(operator, right);
				return -right;

			case TokenType.BANG:
				return !this.isTruthy(right);

			default:
				throw new Error(`Cannot handle ${operator.type} operator`);
		}
	}
}

module.exports = Interpreter;
