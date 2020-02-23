import { PrefixedNumberPipe } from './prefixed-number.pipe';

describe('PrefixedNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new PrefixedNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
