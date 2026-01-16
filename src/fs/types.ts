import type { Eta } from 'eta';
import type { GlobOptions } from 'glob';
import type { MemFsEditor } from 'mem-fs-editor';

/**
 * ETA template options - similar to EJS options
 */
export type EtaOptions = {
	/**
	 * Name of the file (used for better error messages and caching)
	 */
	filename?: string;
	/**
	 * Whether to cache compiled templates
	 */
	cache?: boolean;
	/**
	 * Custom delimiters for ETA
	 */
	tags?: [string, string];
	/**
	 * Whether to automatically escape output
	 */
	autoEscape?: boolean;
	/**
	 * Additional configuration options for ETA
	 */
	[key: string]: any;
};

/**
 * File stat options for write operations
 */
export type FileStatOptions = {
	/**
	 * File mode (permissions), e.g., 0o755 for executable
	 */
	mode?: number;
};

/**
 * Options for copyTpl operations
 */
export type CopyTplOptions = {
	/**
	 * Options passed to glob for pattern matching
	 * Compatible with both glob and globby options
	 */
	globOptions?: GlobOptions | Record<string, unknown>;
	/**
	 * File stat options (e.g., file permissions)
	 */
	stat?: FileStatOptions | null;
	/**
	 * Function to post-process file contents after template rendering
	 */
	process?: (contents: string | Buffer, filepath: string, destination: string) => string | Buffer;
	/**
	 * Whether to append to the file instead of overwriting
	 */
	append?: boolean;
};

/**
 * Options for copyTplAsync operations (extends CopyTplOptions with async-specific options)
 */
export type CopyTplAsyncOptions = CopyTplOptions & {
	/**
	 * Function to transform destination file paths
	 */
	processDestinationPath?: (destinationPath: string) => string;
	/**
	 * Whether to ignore when no files match the glob pattern (suppress errors)
	 */
	ignoreNoMatch?: boolean;
};

/**
 * Options for appendTpl operations
 */
export type AppendTplOptions = {
	/**
	 * Whether to create the file if it doesn't exist
	 */
	create?: boolean;
	/**
	 * Whether to trim whitespace at the end before appending
	 */
	trimEnd?: boolean;
	/**
	 * Separator to use between existing content and appended content
	 */
	separator?: string;
};

/**
 * Extended MemFsEditor interface with ETA template support
 */
export interface EtaMemFsEditor extends MemFsEditor {
	copyTpl(
		from: string | string[],
		to: string,
		context?: Data,
		tplSettings?: EtaOptions,
		options?: CopyTplOptions,
	): void;
	copyTplAsync(
		from: string | string[],
		to: string,
		context?: Data,
		tplSettings?: EtaOptions,
		options?: CopyTplAsyncOptions,
	): Promise<void>;
	appendTpl(
		to: string,
		contents: string | Buffer,
		context?: Data,
		tplSettings?: EtaOptions,
		options?: AppendTplOptions,
	): void;
	_processTpl(args: {
		contents: string | Buffer;
		filename: string;
		destination?: string;
		context?: Data;
		tplSettings?: EtaOptions;
	}): string | Buffer;
	_etaInstance?: Eta;
}

export interface Data {
	[name: string]: any;
}
