/*
generateType:

Generate an expresssion type similar to below:

function Binary(left, operator, right) {
	this.left = left;
	this.operator = operator;
	this.right = right;
	this.accept = (visitor) => visitor.visitBinary(this);

	return this;
}
*/

const generateType = (name, ...fields) => {
	return new Function(`return () => function ${name}(${fields.join(", ")}) {
		${fields.map((x) => `this.${x} = ${x};`).join("\n")}
		this.accept = (visitor) => visitor.visit${name}(this);

		return this;
	}`)()();
};

function Printer(expression) {
	const parens = (name, ...expressions) => {
		const builder = [`${name}`];

		expressions.forEach((x) => builder.push(x.accept(this)));

		return `(${builder.join(" ")})`;
	};

	this.print = () => expression.accept(this);

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
	Binary: generateType("Binary", "left", "operator", "right"),
	Grouping: generateType("Grouping", "expression"),
	Literal: generateType("Literal", "value"),
	Unary: generateType("Unary", "operator", "right"),
	Printer,
};
