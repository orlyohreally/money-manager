type NameErrorType = "name" | "pattern" | "minlength" | "maxlength";

export function nameValidatorFn(
  value: string
): { [error in NameErrorType]?: boolean } | null {
  if (!value) {
    return null;
  }
  const pattern = /^[a-zA-Z\s-]*$/;
  const invalidPattern = !new RegExp(pattern).test(value);
  const tooLong = value.length > 15;
  const tooShort = value.length < 3;
  return invalidPattern || tooLong || tooShort
    ? {
        name: true,
        ...(invalidPattern && { pattern: true }),
        ...(tooShort && { minlength: true }),
        ...(tooLong && { maxlength: true })
      }
    : null;
}
