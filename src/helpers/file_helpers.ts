import PromisedValue from './PromisedValue';
import { after } from './time_helpers';

let activeUpload: {
    result: PromisedValue<string | null>;
    input: HTMLInputElement;
} | null = null;

function onUploadInputChanged() {
    if (!activeUpload || !activeUpload.input.files || activeUpload.input.files.length === 0)
        return;

    const reader = new FileReader();
    const uploadResult = activeUpload.result;
    const input = activeUpload.input;

    activeUpload = null;

    reader.onload = () => uploadResult.resolve(reader.result as string), input.remove();
    reader.onerror = () => uploadResult.reject(), input.remove();

    reader.readAsText(input.files?.[0] as File);
}

function cancelActiveUpload() {
    if (!activeUpload)
        return;

    BODY_CANCEL_EVENTS.forEach(event => document.body.removeEventListener(event, cancelActiveUpload));

    activeUpload.result.resolve(null);
    activeUpload.input.remove();
    activeUpload = null;
}

export enum FileMediaType {
    JSON = 'application/json',
    CSV = 'text/csv',
}

const BODY_CANCEL_EVENTS = ['focus', 'mousemove', 'touchmove'];

const MEDIA_TYPES_ACCEPT = {
    [FileMediaType.JSON]: '.json',
    [FileMediaType.CSV]: '.csv',
};

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

export async function uploadFile(accept?: FileMediaType): Promise<string | null> {
    if (activeUpload)
        throw new Error('A file upload is already in progress');

    const input = document.createElement('input');
    const result = new PromisedValue<string | null>();

    input.onchange = onUploadInputChanged;
    input.style.position = 'fixed';
    input.style.left = '100%';
    input.setAttribute('type', 'file');
    input.setAttribute('value', '');
    input.setAttribute('accept', accept ? MEDIA_TYPES_ACCEPT[accept] : '*');

    document.body.appendChild(input);
    input.click();

    // We have to wait to make sure that body listeners are not registered
    // before the file picker modal opens.
    await after({ milliseconds: 200 });

    BODY_CANCEL_EVENTS.forEach(event => document.body.addEventListener(event, cancelActiveUpload));

    activeUpload = { result, input };

    return result;
}
