import { Route } from "@angular/router";
import { MenuItem } from "../components/side-menu/side-menu.component";

export type MenuRoute = Route & { data?: { hideInMenu?: boolean } };

export class UrlHelper {
  static prettyTitle(path: string): string {
    switch (path) {
      case 'favorites':
        return 'Favoritas';
      case 'watch-list':
        return 'Pendientes';
      case 'search':
        return 'Buscar';
      default:
        return path || 'Inicio';
    }
  }
  static routeTitleToString(r: MenuRoute): string {
    return typeof r.title === 'string' ? r.title : UrlHelper.prettyTitle(r.path ?? '');
  }
  static childRoutesOf(routes: ReadonlyArray<MenuRoute>): ReadonlyArray<MenuRoute> {
    const first = routes[0];
    return (first?.children ?? []) as ReadonlyArray<MenuRoute>;
  }
  static buildItems(prefix: string, children: ReadonlyArray<MenuRoute>): MenuItem[] {
    return children
      .filter((r) => r.path !== undefined && r.path !== '**' && !r.data?.hideInMenu)
      .map((r) => ({
        title: UrlHelper.routeTitleToString(r), // ← forzamos string
        route: `${prefix}/${r.path}`, // path es string aquí
      }));
  }
}
