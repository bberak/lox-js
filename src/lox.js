const fs = require("fs");
const readline = require("readline");
const args = process.argv;
const Scanner = require("./scanner");

if (args.length > 3) console.log("Usage: npm run lox [script]");
else if (args.length === 3) runFile(args[2]);
else runPrompt();

function runFile(file) {
	const fullPath = `${process.cwd()}/${file}`;
	const source = fs.readFileSync(fullPath, "utf8");
	const failed = run(source);

	if (failed) process.exitCode = 1;
}

function runPrompt() {
	const repl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	repl.question("> ", (source) => {
		run(source);
		repl.close();
		runPrompt();
	});
}

function run(source) {
	let failed = false;

	try {
		const scanner = Scanner(source);
		const tokens = scanner.scanTokens();

		console.log("Tokens", tokens);
	} catch (err) {
		failed = true;
		error(0, err.message);
	}

	return failed;
}

function error(line, message) {
	report(line, "", message);
}

function report(line, where, message) {
	console.error(`[line ${line}] Error${where}: "  ${message}`);
}