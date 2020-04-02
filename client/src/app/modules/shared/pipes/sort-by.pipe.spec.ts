import { SortByPipe } from './sort-by.pipe';

describe('SortPipe', () => {
  it('create an instance', () => {
    const pipe = new SortByPipe();
    expect(pipe).toBeTruthy();
  });

  it('should sort array of strings by asc', () => {
    const a = ['bca', 'abc', 'ab'];
    const expectedResult = ['ab', 'abc', 'bca'];
    const pipe = new SortByPipe();
    expect(pipe.transform(a, 'asc')).toEqual(expectedResult);
  });

  it('should sort array of objects by property by asc', () => {
    const a = [{ b: 'bca' }, { b: 'abc' }, { b: 'ab' }];
    const expectedResult = [{ b: 'ab' }, { b: 'abc' }, { b: 'bca' }];
    const pipe = new SortByPipe();
    expect(pipe.transform(a, 'asc', 'b')).toEqual(expectedResult);
  });

  it('should sort array of strings by asc by default', () => {
    const a = ['bca', 'abc', 'ab'];
    const expectedResult = ['ab', 'abc', 'bca'];
    const pipe = new SortByPipe();
    expect(pipe.transform(a)).toEqual(expectedResult);
  });

  it('should sort array of strings by desc', () => {
    const a = ['bca', 'ab', 'abc'];
    const expectedResult = ['bca', 'abc', 'ab'];
    const pipe = new SortByPipe();
    expect(pipe.transform(a, 'desc')).toEqual(expectedResult);
  });

  it('should sort array of objects by property by desc', () => {
    const a = [{ b: 'bca' }, { b: 'abc' }, { b: 'ab' }];
    const expectedResult = [{ b: 'bca' }, { b: 'abc' }, { b: 'ab' }];
    const pipe = new SortByPipe();
    expect(pipe.transform(a, 'desc', 'b')).toEqual(expectedResult);
  });
});
