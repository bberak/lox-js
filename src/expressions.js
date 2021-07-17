/*
generateType:

Generate an expresssion type similar to below:

class Binary {
	constructor(left, operator, right) {
		this.left = left;
		this.operator = operator;
		this.right = right;
		this.accept = (visitor) => visitor.visitBinary(this);
	}
	
	accept(visitor) {
		return visitor.visitBinary(this);
	}
}
*/

const generateType = (name, ...fields) => {
	return new Function(`return () => 
		class ${name} {
	 		constructor(${fields.join(", ")}) {
				${fields.map((x) => `this.${x} = ${x};`).join("\n")}
			}

			accept(visitor) {
				return visitor.visit${name}(this);
			}
		}`
	)()();
};

module.exports = {
	Binary: generateType("Binary", "left", "operator", "right"),
	Grouping: generateType("Grouping", "expression"),
	Literal: generateType("Literal", "value"),
	Unary: generateType("Unary", "operator", "right"),
};
