const configured =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";
const normalizeBase = (value) =>
  `${value.replace(/\/+$/, "").replace(/\/api$/, "")}/api`;
export const API_BASE = import.meta.env.DEV
  ? "/api"
  : normalizeBase(configured || window.location.origin);

export function sessionToken() {
  return (
    localStorage.getItem("andora_token") ||
    sessionStorage.getItem("andora_token")
  );
}
export function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem("andora_token");
    storage.removeItem("andora_user");
  }
}
export function saveSession(token, user, remember = true) {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("andora_token", token);
  storage.setItem("andora_user", JSON.stringify(user));
}
export function saveCachedProfile(user) {
  const storage = localStorage.getItem("andora_token")
    ? localStorage
    : sessionStorage;
  storage.setItem("andora_user", JSON.stringify(user));
}
export function uploadUrl(file, version = "") {
  if (!file) return "";
  try {
    const root = new URL(API_BASE, window.location.origin);
    root.pathname = root.pathname.replace(/\/api$/, "") + "/uploads/";
    const name = String(file).replace(/^\/?uploads\//, "");
    if (name.split("/").includes("..")) return "";
    const url = /^https?:\/\//i.test(file)
      ? new URL(file)
      : new URL(name.split("/").map(encodeURIComponent).join("/"), root);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    if (version) url.searchParams.set("v", String(version));
    return url.href;
  } catch {
    return "";
  }
}
export async function apiRequest(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);
  if (sessionToken()) headers.set("Authorization", `Bearer ${sessionToken()}`);
  if (isFormData) headers.delete("Content-Type");
  else if (options.body != null)
    headers.set("Content-Type", "application/json");
  const body =
    !isFormData && options.body && typeof options.body === "object"
      ? JSON.stringify(options.body)
      : options.body;
  let response;
  try {
    response = await fetch(`${API_BASE}/${endpoint.replace(/^\//, "")}`, {
      cache: "no-store",
      ...options,
      headers,
      body,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Confira se o servidor está funcionando.",
    );
  }
  if (response.status === 401) {
    clearSession();
    if (window.location.hash !== "#/") window.location.hash = "#/";
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.mensagem ||
        `Não foi possível concluir a operação (HTTP ${response.status}).`,
    );
  }
  if (response.status === 204) return null;
  return response.json();
}
export const apiFetch = apiRequest;
