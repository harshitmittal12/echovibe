// js/router.js
const routes = {};

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  history.pushState({}, "", path);
  renderRoute(path);
}

function renderRoute(path) {
  const app = document.querySelector("main");
  if (!app) return;

  const route = Object.keys(routes).find(r =>
    path === r || (r.includes(":") && matchDynamic(r, path))
  );

  if (route) {
    app.innerHTML = routes[route](path);
  }
}

function matchDynamic(route, path) {
  const r = route.split("/");
  const p = path.split("/");
  if (r.length !== p.length) return false;
  return r.every((part, i) => part.startsWith(":") || part === p[i]);
}

window.addEventListener("popstate", () => {
  renderRoute(location.pathname);
});
