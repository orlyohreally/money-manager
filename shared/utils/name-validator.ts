type NameErrorType = "name" | "pattern" | "minlength" | "maxlength";

export function nameValidatorFn(
  value: string
): { [error in NameErrorType]?: boolean } | null {
  if (!value) {
    // tslint:disable-next-line: no-null-keyword
    return null;
  }
  const pattern = /^[a-zA-Z\s-]*$/;
  const invalidPattern = !new RegExp(pattern).test(value);
  const tooLong = value.length > 15;
  const tooShort = value.length < 3;
  if (invalidPattern || tooLong || tooShort) {
    return {
      name: true,
      ...(invalidPattern && { pattern: true }),
      ...(tooShort && { minlength: true }),
      ...(tooLong && { maxlength: true })
    };
  }
  // tslint:disable-next-line: no-null-keyword
  return null;
}
