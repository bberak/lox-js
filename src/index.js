const fs = require("fs");
const readline = require("readline");
const args = process.argv;

if (args.length > 3) console.log("Usage: npm run lox [script]");
else if (args.length === 3) runFile(args[2]);
else runPrompt();

function runFile(file) {
	const fullPath = `${process.cwd()}/${file}`;
	const source = fs.readFileSync(fullPath, "utf8");

	run(source);
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
	console.log("Executing: ", source);
}
