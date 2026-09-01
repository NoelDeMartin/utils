export {};

declare global {
    // Available in Aerogel apps.
    const __AEROGEL_ENV__: string | undefined;
    const __AEROGEL_E2E__: boolean | undefined;
}
