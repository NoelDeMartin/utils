let forcedEnv: string | null = null;

function getTestingType(): 'unit' | 'e2e' | null {
    if (typeof globalThis === 'object') {
        if ('Cypress' in globalThis) {
            return 'e2e';
        }

        if (typeof globalThis.top === 'object' && globalThis.top && 'Cypress' in globalThis.top) {
            return 'e2e';
        }
    }

    if (typeof process === 'object' && process.env.VITEST) {
        return 'unit';
    }

    return null;
}

export function forceEnv(env: string): void {
    forcedEnv = env;
}

export function getEnv(): string | null {
    if (forcedEnv !== null) {
        return forcedEnv;
    }

    if (getTestingType()) {
        return 'testing';
    }

    if (typeof window === 'object' && '$app' in window && !!window.$app?.environment) {
        return window.$app.environment;
    }

    if (typeof process === 'object' && process.env?.NODE_ENV) {
        return process.env.NODE_ENV;
    }

    return null;
}

export function isDevelopment(): boolean {
    return getEnv() === 'development';
}

export function isTesting(type?: 'unit' | 'e2e'): boolean {
    if (getEnv() !== 'testing') {
        return false;
    }

    return !type || type === getTestingType();
}

export function isProduction(): boolean {
    return getEnv() === 'production';
}

export function applyStrictChecks(): boolean {
    const env = getEnv();

    return env === 'development' || env === 'testing';
}
