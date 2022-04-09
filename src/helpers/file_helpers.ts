export function downloadFile(filename: string, content: string, mediaType: string): void {
    const url = window.URL.createObjectURL(new Blob([content], { type: mediaType }));
    const anchor = document.createElement('a');

    anchor.style.display = 'none';
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(anchor);
}
