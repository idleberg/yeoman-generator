import { ClackAdapter, type ClackPromptOptions, type ClackPromptResult } from 'yeoman-adapter-clack';
import type { BaseOptions, Storage } from 'yeoman-generator';
import { BaseGenerator } from './base.ts';

/**
 * Generator for using Clack prompts with the pure Clack API.
 *
 * This generator provides access to all Clack-specific prompt options like
 * `initialValue`, `options`, `hint`, etc.
 *
 * For Inquirer-compatible API, use {@see ClackCompatGenerator} instead.
 */
export class Generator extends BaseGenerator {
	constructor(args?: string | string[], opts?: BaseOptions) {
		super(ClackAdapter, args, opts);
	}

	// @ts-expect-error Intentionally incompatible with base class Inquirer types — this generator uses the Clack prompt API
	override async prompt<A extends ClackPromptResult = ClackPromptResult>(
		questions: ClackPromptOptions | ClackPromptOptions[],
		storage?: Storage | string,
	): Promise<A> {
		const questionsArray = Array.isArray(questions) ? questions : [questions];
		const questionsWithDefaults = this.loadSession(questionsArray, storage);
		const answers = (await (this.env.adapter as unknown as ClackAdapter).prompt(questionsWithDefaults)) as A;

		this.saveSession(questionsArray, answers, storage);

		return answers;
	}
}
