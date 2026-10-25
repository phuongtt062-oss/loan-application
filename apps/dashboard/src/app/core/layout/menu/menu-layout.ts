import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MenuItem } from "primeng/api";
import { createAppMenuItems } from "./menu-data";
import { Menuitem } from "./menu-custom";

@Component({
  selector: "app-menu",
  imports: [CommonModule, Menuitem, RouterModule],
  template: `<ul class="layout-menu">
    @for (item of model; track item.label) {
      @if (!item.separator) {
        <app-menu-item [item]="item" [root]="true"></app-menu-item>
      } @else {
        <li class="menu-separator"></li>
      }
    }
  </ul> `,
})
export class AppMenu {
  readonly model: MenuItem[] = createAppMenuItems();
}
