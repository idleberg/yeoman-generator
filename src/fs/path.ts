import { Eta, type EtaConfig } from 'eta';
import type { EtaOptions } from './types.ts';

/**
 * Strip .eta extension from destination path.
 */
export function processDestinationPath(destPath: string): string {
	return destPath.replace(/\.eta$/i, '');
}

/**
 * Render destination path with template context.
 */
export function renderDestinationPath(destPath: string, context: any, tplSettings: EtaOptions = {}): string {
	if (!context || Object.keys(context).length === 0) {
		return destPath;
	}

	try {
		// Build Eta config with only valid EtaConfig properties
		const etaConfig: Partial<EtaConfig> = {
			cache: false, // Don't cache destination paths
			autoEscape: false,
		};

		// Only add tags if they're defined
		if (tplSettings.tags) {
			etaConfig.tags = tplSettings.tags;
		}

		const eta = new Eta(etaConfig);
		return eta.renderString(destPath, context);
	} catch {
		// If rendering fails, return original path
		return destPath;
	}
}
