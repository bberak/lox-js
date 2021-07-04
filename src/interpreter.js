const TokenType = require("./token-type");

function Interpreter(expression) {
	const evaluate = (expression) => expression.accept(this);

	const isTruthy = (value) => {
		//-- Lox has stricter definitions of truthiness than JavaScript
		if (value === null) return false;
		if (typeof value === "boolean") return value;

		return true;
	};

	this.interpret = () => evaluate(expression);
	
	this.visitBinary = (binary) => {
		switch (binary.operator.type) {
			case TokenType.MINUS: return evaluate(binary.left) - evaluate(binary.right);
			case TokenType.PLUS: return evaluate(binary.left) + evaluate(binary.right);
			case TokenType.SLASH: return evaluate(binary.left) / evaluate(binary.right);
			case TokenType.STAR: return evaluate(binary.left) * evaluate(binary.right);
			case TokenType.BANG_EQUAL: return isTruthy(evaluate(binary.left)) !== isTruthy(evaluate(binary.right));
			case TokenType.EQUAL_EQUAL: return isTruthy(evaluate(binary.left)) === isTruthy(evaluate(binary.right));
			case TokenType.GREATER: return evaluate(binary.left) > evaluate(binary.right);
			case TokenType.GREATER_EQUAL: return evaluate(binary.left) >= evaluate(binary.right);
			case TokenType.LESS: return evaluate(binary.left) < evaluate(binary.right);
			case TokenType.LESS_EQUAL: return evaluate(binary.left) <= evaluate(binary.right);

			default: throw new Error(`Cannot handle ${binary.operator.type} operator`);
		}
	};
	
	this.visitGrouping = (grouping) => evaluate(grouping.expression);
	
	this.visitLiteral = (literal) => literal.value;
	
	this.visitUnary = (unary) => {
		switch (unary.operator.type) {
			case TokenType.MINUS: return -evaluate(unary.right); 
			case TokenType.BANG: return !isTruthy(evaluate(unary.right));
			
			default: throw new Error(`Cannot handle ${unary.operator.type} operator`);
		}
	};

	return this;
}

module.exports = Interpreter;