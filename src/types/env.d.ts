export {};

declare global {
    interface Window {
        // Available in Aerogel apps.
        $app?: { environment?: string };
    }
}
