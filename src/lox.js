const fs = require("fs");
const readline = require("readline");
const args = process.argv;
const Scanner = require("./scanner");
const Parser = require("./parser");
const Printer = require("./printer");
const Interpreter = require("./interpreter");
const TokenType = require("./token-type");

let failed = false;

const report = (line, message) => {
	failed = true;
	console.error(`[line ${line}] ${message}`);
};

const error = (token, message) => {
	if (token.type == TokenType.EOF)
		report(token.line, `at end: ${message}`);
	else
		report(token.line, `at '${token.lexeme}': ${message}`);
};

const onScanError = (e) => {
	report(e.line, e.message);
};

const onParseError = (e) => {
	error(e.token, e.message);
};

const onRuntimeError = (e) => {
	error(e.token, e.message);
};

const scanner = new Scanner(onScanError);
const parser = new Parser(onParseError);
const printer = new Printer();
const interpreter = new Interpreter(onRuntimeError);

const run = (source) => {
	failed = false;

	if (!source) return;

	const tokens = scanner.scanTokens(source);
	const expression = parser.parse(tokens);

	if (!failed) {
		console.log("Expression:", expression);
		console.log("Pretty:", printer.print(expression))	
		console.log("Result:", interpreter.interpret(expression));
	}
};

const runFile = (file) => {
	const fullPath = `${process.cwd()}/${file}`;
	const source = fs.readFileSync(fullPath, "utf8");
	run(source);
};

const runPrompt = () => {
	const repl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	repl.question("> ", (source) => {
		run(source);
		repl.close();
		runPrompt();
	});
};


if (args.length > 3) console.log("Usage: npm run lox [script]");
else if (args.length === 3) runFile(args[2]);
else runPrompt();

if (failed) process.exitCode = 1;
