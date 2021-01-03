const fs = require("fs");
const readline = require("readline");
const args = process.argv;
const Scanner = require("./scanner");

const report = (line, message) => {
	console.error(`[line ${line}] ${message}`);
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

	const onError = (line, message) => { failed = true; report(line, message); };
	const scanner = new Scanner(source, onError);
	const tokens = scanner.scanTokens();

	console.log("Tokens", tokens);

	return failed;
};

if (args.length > 3) console.log("Usage: npm run lox [script]");
else if (args.length === 3) runFile(args[2]);
else runPrompt();