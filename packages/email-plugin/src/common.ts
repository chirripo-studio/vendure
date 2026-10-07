import { Injector, RequestContext } from '@vendure/core';

import { EmailPluginDevModeOptions, EmailPluginOptions, EmailTransportOptions } from './types';

export function isDevModeOptions(
    input: EmailPluginOptions | EmailPluginDevModeOptions,
): input is EmailPluginDevModeOptions {
    return (input as EmailPluginDevModeOptions).devMode === true;
}

/**
 * @description
 * Returns a warning message when `devMode` is enabled and `NODE_ENV` is `production`.
 * Returns `undefined` otherwise.
 *
 * In dev mode the plugin mounts the dev mailbox, which lists and serves every generated email
 * without authentication, and it uses the file transport, so no email is sent.
 *
 * Exported for unit testing. Production callers rely on the default `process.env.NODE_ENV`.
 */
export function getDevModeProductionWarning(
    options: EmailPluginOptions | EmailPluginDevModeOptions,
    nodeEnv = process.env.NODE_ENV,
): string | undefined {
    if (!isDevModeOptions(options) || nodeEnv !== 'production') {
        return undefined;
    }
    return (
        `devMode is enabled while NODE_ENV is "production". The dev mailbox at route "${options.route}" ` +
        'is publicly reachable: it lists and serves every generated email without authentication. ' +
        `Emails are written to "${options.outputPath}" and are not sent. ` +
        'Remove `devMode` and configure a `transport` for production.'
    );
}

export async function resolveTransportSettings(
    options: EmailPluginOptions,
    injector: Injector,
    ctx?: RequestContext
): Promise<EmailTransportOptions> {
    if (typeof options.transport === 'function') {
        return options.transport(injector, ctx);
    } else {
        return options.transport;
    }
}
