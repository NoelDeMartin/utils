export class StringHelpers {

    public contains(needle: string, haystack: string): boolean {
        return haystack.indexOf(needle) !== -1;
    }

}

export default new StringHelpers();
