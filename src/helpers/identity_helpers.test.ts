import { shortId, uuid } from './identity_helpers';

describe('Identity helpers', () => {

    it('works', () => {
        expect(uuid()).toHaveLength(36);
        expect(shortId()).toHaveLength(9);
        expect(shortId(6)).toHaveLength(6);
    });

});
