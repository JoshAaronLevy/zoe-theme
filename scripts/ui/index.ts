import * as fs from 'fs-extra';
import * as path from 'path';
import * as browserify from 'browserify';

const UI_FOLDER_PATH = path.join('/src', 'webviews', 'ui');
const UI_JS_FOLDER_PATH = path.join('/dist', 'src', 'webviews', 'ui');
const UI_FOLDER_BUILD_PATH = path.join('/build', 'ui');

const copyStatics = async (): Promise<void[]> => {
	const paths = [{
		src: path.join(UI_FOLDER_PATH, 'release-notes', 'release-notes.html'),
		dest: path.join(UI_FOLDER_BUILD_PATH, 'release-notes.html')
	}, {
		src: path.join(UI_FOLDER_PATH, 'release-notes', 'style.css'),
		dest: path.join(UI_FOLDER_BUILD_PATH, 'release-notes.css')
	}];

	return Promise.all(paths.map(async path => fs.copyFile(path.src, path.dest)));
};

const buildJs = async (type: 'release-notes'): Promise<void> => {
	const jsBuildPath = path.join(UI_FOLDER_BUILD_PATH, `${type}.js`);
	const b = browserify();
	await fs.createFile(jsBuildPath);
	const jsBuildFileStream = fs.createWriteStream(jsBuildPath);
	b.add(path.join(UI_JS_FOLDER_PATH, type, 'index.js'));
	b.bundle().pipe(jsBuildFileStream);
	return Promise.resolve();
};

const run = async (): Promise<void> => {
	try {
		await fs.mkdirp(UI_FOLDER_BUILD_PATH);
		await copyStatics();
		await buildJs('release-notes');
	} catch (error) {
		console.error('ERROR build:ui:', error);
		process.exit(1);
	}
};

run();
