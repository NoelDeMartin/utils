let forcedEnv: string | null = null;

export function forceEnv(env: string): void {
    forcedEnv = env;
}

export function getEnv(): string | null {
    if (forcedEnv !== null) {
        return forcedEnv;
    }

    if (typeof globalThis === 'object' && 'Cypress' in globalThis) {
        return 'testing';
    }

    if (typeof window === 'object' && '$app' in window && !!window.$app?.environment) {
        return window.$app.environment;
    }

    if (typeof process === 'object' && process.env) {
        if (process.env.VITEST) {
            return 'testing';
        }

        if (process.env.NODE_ENV) {
            return process.env.NODE_ENV;
        }
    }

    return null;
}

export function isDevelopment(): boolean {
    return getEnv() === 'development';
}

export function isTesting(): boolean {
    return getEnv() === 'testing';
}

export function isProduction(): boolean {
    return getEnv() === 'production';
}

export function applyStrictChecks(): boolean {
    const env = getEnv();

    return env === 'development' || env === 'testing';
}
