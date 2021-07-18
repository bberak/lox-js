class Printer {
	parens(name, ...expressions) {
		const builder = [`${name}`];

		expressions.forEach((x) => builder.push(x.accept(this)));

		return `(${builder.join(" ")})`;
	}

	print(expression){ 
		return expression.accept(this);
	}

	visitBinary(binary) { 
		return this.parens(binary.operator.lexeme, binary.left, binary.right);
	}

	visitGrouping(grouping) { 
		return this.parens("group", grouping.expression);
	}

	visitLiteral(literal) {
		if (literal.value == null) return "nil";
		return literal.value.toString();
	};

	visitUnary(unary) {
		return this.parens(unary.operator.lexeme, unary.right);
	}
}

module.exports = Printer;