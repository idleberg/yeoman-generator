import path from 'node:path';
import { glob as globAsync, globSync } from 'glob';
import type { MemFsEditor } from 'mem-fs-editor';
import { processDestinationPath, renderDestinationPath } from './path.ts';
import { _processTpl } from './renderer.ts';
import type { EtaOptions } from './types.ts';

/**
 * Copy template file(s) using ETA
 */
export function copyTpl(
	this: MemFsEditor,
	from: string | string[],
	to: string,
	context?: any,
	tplSettings?: EtaOptions,
	options?: any,
): void {
	const fromPaths = Array.isArray(from) ? from : [from];
	const processedPaths: string[] = [];

	// Expand globs
	for (const fromPath of fromPaths) {
		const matches = globSync(fromPath, {
			dot: true,
			nodir: true,
			...(options?.globOptions || {}),
		});

		if (matches.length === 0) {
			// If no glob match, treat as literal path
			processedPaths.push(fromPath);
		} else {
			processedPaths.push(...matches);
		}
	}

	const isGlob = processedPaths.length > 1 || (fromPaths.length === 1 && processedPaths.length !== fromPaths.length);

	for (const fromPath of processedPaths) {
		const contents = this.read(fromPath);

		if (contents === null) {
			throw new Error(`File not found: ${fromPath}`);
		}
		const filename = path.basename(fromPath);

		const rendered = _processTpl.call(this, {
			contents,
			filename,
			context,
			tplSettings: { ...tplSettings, filename: fromPath },
		});

		const destPath = isGlob ? path.join(to, path.basename(fromPath)) : to;

		// Strip .eta extension (matches Yeoman's behavior of stripping .ejs)
		const processedDestPath = processDestinationPath(destPath);

		// Render destination path with template context (allows dynamic filenames)
		const finalDestPath = renderDestinationPath(processedDestPath, context, tplSettings);

		this.write(finalDestPath, rendered, options);
	}
}

/**
 * Copy template file(s) using ETA (async version)
 */
export async function copyTplAsync(
	this: MemFsEditor,
	from: string | string[],
	to: string,
	context?: any,
	tplSettings?: EtaOptions,
	options?: any,
): Promise<void> {
	const fromPaths = Array.isArray(from) ? from : [from];
	const processedPaths: string[] = [];

	// Expand globs
	for (const fromPath of fromPaths) {
		const matches = await globAsync(fromPath, {
			dot: true,
			nodir: true,
			...(options?.globOptions || {}),
		});

		if (matches.length === 0) {
			processedPaths.push(fromPath);
		} else {
			processedPaths.push(...matches);
		}
	}

	const isGlob = processedPaths.length > 1 || (fromPaths.length === 1 && processedPaths.length !== fromPaths.length);

	for (const fromPath of processedPaths) {
		const contents = this.read(fromPath);

		if (contents === null) {
			throw new Error(`File not found: ${fromPath}`);
		}

		const filename = path.basename(fromPath);
		const rendered = _processTpl.call(this, {
			contents,
			filename,
			context,
			tplSettings: { ...tplSettings, filename: fromPath },
		});

		const destPath = isGlob ? path.join(to, path.basename(fromPath)) : to;

		// Strip .eta extension (matches Yeoman's behavior of stripping .ejs)
		const processedDestPath = processDestinationPath(destPath);

		// Render destination path with template context (allows dynamic filenames)
		const finalDestPath = renderDestinationPath(processedDestPath, context, tplSettings);

		this.write(finalDestPath, rendered, options);
	}
}

/**
 * Append template content to a file using ETA
 */
export function appendTpl(
	this: MemFsEditor,
	to: string,
	contents: string | Buffer,
	context?: any,
	tplSettings?: EtaOptions,
	options?: any,
): void {
	const rendered = _processTpl.call(this, {
		contents,
		filename: to,
		context,
		tplSettings,
	});

	this.append(to, rendered as string, options);
}
