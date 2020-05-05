import { nameValidatorFn } from "./name-validator";

describe("nameValidatorFn", () => {
  it("should create an instance", () => {
    expect(nameValidatorFn).toBeTruthy();
  });

  it(
    "should return username and minlength error" +
      " for too short user name (less than 3 characters)",
    () => {
      expect(nameValidatorFn("ab")).toEqual(
        jasmine.objectContaining({
          username: true,
          minlength: true
        })
      );
    }
  );

  it(
    "should return username and maxlength error" +
      " for too long user name (more than 15 characters)",
    () => {
      expect(nameValidatorFn("a".repeat(16))).toEqual({
        username: true,
        maxlength: true
      });
    }
  );

  it("should not return username error for validName", () => {
    expect(nameValidatorFn("validName")).toBeFalsy();
  });

  it("should return username error and pattern for 1invalidName", () => {
    expect(nameValidatorFn("1invalidName")).toEqual({
      username: true,
      pattern: true
    });
  });

  it("should not return username error for empty name", () => {
    expect(nameValidatorFn("")).toBeFalsy();
  });
});
