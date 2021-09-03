import { parseDate } from '@/helpers/date_helpers';

describe('Date helpers', () => {

    it('parses dates', () => {
        expect(parseDate()).toEqual(null);
        expect(parseDate('invalid value')).toEqual(null);
        expect(parseDate(0)).toEqual(null);
        expect(parseDate('Fri, 03 Sept 2021 16:09:12 GMT')).toEqual(new Date(1630685352000));
        expect(parseDate('2021-09-03T16:09:12.000Z')).toEqual(new Date(1630685352000));
        expect(parseDate(new Date(1630685352000))).toEqual(new Date(1630685352000));
    });

});
