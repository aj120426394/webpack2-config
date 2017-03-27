import Util from '../webpack/Util';

describe('The Util class should', () => {
  describe('provide the duplicating Object function that', () => {


    test('duplicate the object containing primitive values', () => {
      const testObj = {
        testNumber: 123,
        testString: 'abc',
        testBoolean: true
      };

      const resultObj = Util.duplicateObject(testObj);
      resultObj.testNumber = 456;
      resultObj.testString = 'hello';
      resultObj.testBoolean = false;

      expect(resultObj.testNumber).not.toBe(testObj.testNumber);
      expect(resultObj.testString).not.toBe(testObj.testString);
      expect(resultObj.testBoolean).not.toBe(testObj.testBoolean);
    });

    test('duplicate the object containing an Array value', () => {
      const testObj = {
        testNumberArray: [123],
        testStringArray: ['abc'],
        testBooleanArray: [true]
      };

      const resultObj = Util.duplicateObject(testObj);
      resultObj.testNumberArray[0] = 456;
      resultObj.testStringArray[0] = 'hello';
      resultObj.testBooleanArray[0] = false;

      expect(resultObj.testNumberArray).toBeInstanceOf(Array);
      expect(resultObj.testNumberArray[0]).not.toBe(testObj.testNumberArray[0]);
      expect(resultObj.testStringArray[0]).not.toBe(testObj.testStringArray[0]);
      expect(resultObj.testBooleanArray[0]).not.toBe(testObj.testBooleanArray[0]);
    });

    test('duplicate the object containing an Object value', () => {
      const testObj = {
        testNumberObject: {test: 123},
        testStringObject: {test: 'abc'},
        testBooleanObject: {test: true}
      };

      const resultObj = Util.duplicateObject(testObj);
      resultObj.testNumberObject.test = 456;
      resultObj.testStringObject.test = 'hello';
      resultObj.testBooleanObject.test = false;

      expect(resultObj.testNumberObject).toBeInstanceOf(Object);
      expect(resultObj.testNumberObject.test).not.toBe(testObj.testNumberObject.test);
      expect(resultObj.testStringObject.test).not.toBe(testObj.testStringObject.test);
      expect(resultObj.testBooleanObject.test).not.toBe(testObj.testBooleanObject.test);
    });
  });
});
