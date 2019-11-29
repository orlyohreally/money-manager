import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "shared-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.scss"]
})
export class ImageComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() height: string;
  @Input() width: string;
  @Input() borderRadius: string;
  constructor() {}

  ngOnInit() {}
  public getImageStyles(): { [property: string]: string } {
    let styles = {
      "background-image": `url(${this.imageUrl})`,
      height: this.height || "100px",
      width: this.width || "100px"
    };

    if (this.borderRadius) {
      styles["border-radius"] = this.borderRadius;
    }

    return styles;
  }
}
