const TokenType = {
  // Single-character tokens.
  LEFT_PAREN: "l_paren",
  RIGHT_PAREN: "r_paren",
  LEFT_BRACE: "l_brace",
  RIGHT_BRACE: "r_brace",
  COMMA: "comma",
  DOT: "dot",
  MINUS: "minus",
  PLUS: "plus",
  SEMICOLON: "semicolon",
  SLASH: "slash",
  STAR: "star",
  // One or two character tokens.
  BANG: "bang",
  BANG_EQUAL: "bang_equal",
  EQUAL: "equal",
  EQUAL_EQUAL: "equal_equal",
  GREATER: "greater",
  GREATER_EQUAL: "greater_equal",
  LESS: "less",
  LESS_EQUAL: "less_equal",
  // Literals.
  IDENTIFIER: "identifier",
  STRING: "string",
  NUMBER: "number",
  // Keywords.
  AND: "and",
  CLASS: "class",
  ELSE: "else",
  FALSE: "false",
  FUN: "function",
  FOR: "for",
  IF: "if",
  NIL: "nil",
  OR: "or",
  PRINT: "print",
  RETURN: "return",
  SUPER: "super",
  THIS: "this",
  TRUE: "true",
  VAR: "var",
  WHILE: "while",
  // Other.
  EOF: "eof",
};

module.exports = TokenType;
