const fs = require("fs");
const readline = require("readline");
const args = process.argv;
const Scanner = require("./scanner");
const Parser = require("./parser");
const Printer = require("./printer");
const Interpreter = require("./interpreter");
const TokenType = require("./token-type");

const report = (line, message) => {
	console.error(`[line ${line}] ${message}`);
};

const error = (token, message) => {
	if (token.type == TokenType.EOF)
		report(token.line, `at end: ${message}`);
	else
		report(token.line, `at '${token.lexeme}': ${message}`);
};

const runFile = (file) => {
	const fullPath = `${process.cwd()}/${file}`;
	const source = fs.readFileSync(fullPath, "utf8");
	const failed = run(source);

	if (failed) process.exitCode = 1;
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

const run = (source) => {
	let failed = false;

	if (!source) return failed;

	const onScanError = (e) => { failed = true; report(e.line, e.message); };
	const scanner = new Scanner(source, onScanError);
	const tokens = scanner.scanTokens();

	const onParseError = (e) => { failed = true; error(e.token, e.message); };
	const parser = new Parser(tokens, onParseError);
	const expression = parser.parse();

	if (!failed) {
		const printer = new Printer(expression);
		const interpreter = new Interpreter(expression);

		console.log("Expression:", expression);
		console.log("Pretty:", printer.print())	
		console.log("Result:", interpreter.interpret());
	}
	
	return failed;
};

if (args.length > 3) console.log("Usage: npm run lox [script]");
else if (args.length === 3) runFile(args[2]);
else runPrompt();
