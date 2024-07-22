import {StringToNumberMapper} from "./moks/string-to-number-mapper.mock";


describe('StringToNumberMapper', () => {
    let mapper: StringToNumberMapper;

    beforeEach(() => {
        mapper = new StringToNumberMapper();
    });

    test('mapFrom should convert string to number', () => {
        const input = '123.45';
        const expectedOutput = 123.45;
        expect(mapper.mapFrom(input)).toBe(expectedOutput);
    });

    test('mapTo should convert number to string', () => {
        const input = 123.45;
        const expectedOutput = '123.45';
        expect(mapper.mapTo(input)).toBe(expectedOutput);
    });
});
