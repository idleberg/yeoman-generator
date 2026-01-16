import { Eta, type EtaConfig } from 'eta';
import isBinaryPath from 'is-binary-path';
import type { MemFsEditor } from 'mem-fs-editor';
import type { EtaOptions } from './types.ts';

/**
 * Process a template using ETA.
 */
export function _processTpl(
	this: MemFsEditor,
	{
		contents,
		filename,
		context = {},
		tplSettings = {},
	}: {
		contents: string | Buffer;
		filename: string;
		destination?: string;
		context?: any;
		tplSettings?: EtaOptions;
	},
): string | Buffer {
	if (isBinaryPath(filename)) {
		return contents;
	}

	const contentsStr = Buffer.isBuffer(contents) ? contents.toString('utf8') : contents;

	try {
		// Build Eta config with only valid EtaConfig properties
		// This fixes the bug where undefined or invalid properties were being passed
		const etaConfig: Partial<EtaConfig> = {
			cache: tplSettings.cache ?? true,
			autoEscape: tplSettings.autoEscape ?? false,
		};

		// Only add tags if they're defined
		if (tplSettings.tags) {
			etaConfig.tags = tplSettings.tags;
		}

		const eta = new Eta(etaConfig);
		const rendered = eta.renderString(contentsStr, context ?? {});

		return rendered;
	} catch (error) {
		throw new Error(`ETA template error in ${filename}: ${error instanceof Error ? error.message : String(error)}`);
	}
}
