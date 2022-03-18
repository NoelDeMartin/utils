export function isSuccessfulResponse(response: Response): boolean {
    return Math.floor(response.status / 100) === 2;
}
