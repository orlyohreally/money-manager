import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MembersService } from "../members.service";
import { HtmlElementRepresentation } from "../html-element";
import { AuthenticationService } from "../authentication.service";
import { ImageAsset } from "@shared/types";

@Component({
  selector: "app-sign-in-form",
  templateUrl: "./sign-in-form.component.html",
  styleUrls: ["./sign-in-form.component.scss"]
})
export class SignInFormComponent implements OnInit {
  constructor(
    private membersService: MembersService,
    private authenticationService: AuthenticationService
  ) {}
  public signInForm: FormGroup;
  public colorSchemeRepresentations: HtmlElementRepresentation[];

  ngOnInit() {
    this.getColorSchemes();
    this.initForm();
  }

  private initForm() {
    this.signInForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      colorScheme: new FormControl("primary"),
      password: new FormControl("", [Validators.required])
    });
  }

  private getColorSchemes() {
    const generateSchemeRepresentations = color => ({
      id: color,
      classes: `color-scheme background-color-${color}`,
      innerHTML: null
    });
    this.colorSchemeRepresentations = this.membersService
      .getColorSchemes()
      .map(generateSchemeRepresentations);
    console.log(this.colorSchemeRepresentations);
  }
  public selectColorScheme(colorScheme: HtmlElementRepresentation) {
    console.log(colorScheme);
    this.signInForm.controls.colorScheme.setValue(colorScheme.id);
  }
  public register() {
    console.log(this.signInForm.value);
    this.authenticationService.register(this.signInForm.value);
  }
}
