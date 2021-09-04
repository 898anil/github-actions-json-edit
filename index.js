const path = require('path');
const core = require('@actions/core');
const tmp = require('tmp');
const fs = require('fs');
const editJsonFile = require("edit-json-file");


async function run(){
	try {
		const inputFile = core.getInput('file_path', { required: true });
		const fieldPath = core.getInput('field_path', { required: true });
		const fieldValue = core.getInput('field_value', { required: true });

		const inputFilePath = path.isAbsolute(inputFile) ?
		  inputFile :
		  path.join(process.env.GITHUB_WORKSPACE, inputFile);
		
		if (!fs.existsSync(inputFilePath)) {
		  throw new Error(`input file does not exist: ${inputFilePath}`);
		}

		let file = editJsonFile(inputFilePath);

		file.set(fieldPath, fieldValue);

		const output = file.get()

		var updatedFile = tmp.fileSync({
		    tmpdir: process.env.RUNNER_TEMP,
		    prefix: 'out-file-',
		    postfix: '.json',
		    keep: true,
		    discardDescriptor: true
		});
		const newContentToWrite = JSON.stringify(output, null, 4);
		fs.writeFileSync(updatedFile.name, newContentToWrite);
		core.setOutput('out_file', updatedFile.name);
	}
	catch(e){
		core.setFailed(e.message);
	}
}

module.exports = run

if (require.main === module) {
    run();
}