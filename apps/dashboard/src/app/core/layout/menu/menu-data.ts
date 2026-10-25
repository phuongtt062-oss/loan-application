import type { MenuItem } from "primeng/api";
import { APP_ROUTES } from "@core/constants/app.constants";

export function createAppMenuItems(): MenuItem[] {
  return [
    {
      label: "Chức năng",
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-fw pi-home",
          routerLink: APP_ROUTES.DASHBOARD,
        },
        // {
        //   label: "Thông báo",
        //   icon: "pi pi-fw pi-bell",
        //   routerLink: APP_ROUTES.DASHBOARD,
        // },
      ],
    },
    {
      label: "Báo cáo",
      path: "/hierarchy",
      items: [
        {
          label: "Submenu 1",
          icon: "pi pi-fw pi-bookmark",
          path: "/hierarchy/submenu_1",
          items: [
            {
              label: "Submenu 1.1",
              icon: "pi pi-fw pi-bookmark",
              path: "/hierarchy/submenu_1/submenu_1_1",
            },
            {
              label: "Submenu 1.2",
              icon: "pi pi-fw pi-bookmark",
              path: "/hierarchy/submenu_1/submenu_1_2",
            },
          ],
        },
        {
          label: "Submenu 2",
          icon: "pi pi-fw pi-bookmark",
          path: "/hierarchy/submenu_2",
          items: [
            {
              label: "Submenu 2.1",
              icon: "pi pi-fw pi-bookmark",
              path: "/hierarchy/submenu_2/submenu_2_1",
              items: [
                { label: "Submenu 2.1.1", icon: "pi pi-fw pi-bookmark" },
                { label: "Submenu 2.1.2", icon: "pi pi-fw pi-bookmark" },
              ],
            },
            {
              label: "Submenu 2.2",
              icon: "pi pi-fw pi-bookmark",
              path: "/hierarchy/submenu_2/submenu_2_2",
              items: [{ label: "Submenu 2.2.1", icon: "pi pi-fw pi-bookmark" }],
            },
          ],
        },
      ],
    },
  ];
}
