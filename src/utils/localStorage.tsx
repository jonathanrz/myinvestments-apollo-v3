const localStorage = {
  get(name: string) {
    try {
      return JSON.parse(window.localStorage.getItem(name) || "");
    } catch (_) {
      return null;
    }
  },
  set(name: string, value: string) {
    window.localStorage.setItem(name, JSON.stringify(value));
  },
};

export default localStorage;
