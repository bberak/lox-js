const Token = require("./token");

function Binary(left, operator, right) {
	this.left = left;
	this.operator = operator;
	this.right = right;
	this.accept = (visitor) => visitor.visitBinary(this);

	return this;
}

function Grouping(expression) {
	this.expression = expression;
	this.accept = (visitor) => visitor.visitGrouping(this);

	return this;
}

function Literal(value) {
	this.value = value;
	this.accept = (visitor) => visitor.visitLiteral(this);

	return this;
}

function Unary(operator, right) {
	this.operator = operator;
	this.right = right;
	this.accept = (visitor) => visitor.visitUnary(this);

	return this;
}

function AstPrinter() {
	const parens = (name, ...expressions) => {
		const builder = [`(${name}`];
		
		expressions.forEach(x => builder.push(x.accept(this)));

		return `${builder.join(" ")})`;
	};

	this.print = (expression) => expression.accept(this);

	this.visitBinary = (binary) => parens(binary.operator.lexeme, binary.left, binary.right);

	this.visitGrouping = (grouping) => parens("group", grouping.expression);

	this.visitLiteral = (literal) => {
		if (literal.value == null) return "nil";
		return literal.value.toString();
	};

	this.visitUnary = (unary) => parens(unary.operator.lexeme, unary.right);

	return this;
}

module.exports = {
	Binary,
	Grouping,
	Literal,
	Unary,
	AstPrinter
};
