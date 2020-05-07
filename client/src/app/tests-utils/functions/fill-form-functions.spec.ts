import { ComponentFixture } from '@angular/core/testing';

export function setInputField<T>(
  fixture: ComponentFixture<T>,
  fieldName: string,
  value: string
) {
  const inputField: HTMLInputElement = fixture.nativeElement.querySelector(
    `input[name="${fieldName}"]`
  );
  inputField.value = value;
  inputField.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

export async function setSelectorOption<T>(
  fixture: ComponentFixture<T>,
  selectorName: string,
  optionIndex: number
) {
  const selector = fixture.nativeElement.querySelector(
    `mat-select[name="${selectorName}"`
  );
  selector.click();
  await fixture.whenStable();
  fixture.detectChanges();
  const options = document.querySelectorAll('.mat-select-panel .mat-option');
  (options[optionIndex] as HTMLElement).click();
  fixture.detectChanges();
}
