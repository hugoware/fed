import fs from 'fs';
import path from 'path';

// get the client script
const clientScriptPath = path.join(
	path.dirname(__dirname),
	'resource',
	'client.js'
);

export const CLIENT_SCRIPT = fs.readFileSync(clientScriptPath);
