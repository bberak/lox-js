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

module.exports = Printer;