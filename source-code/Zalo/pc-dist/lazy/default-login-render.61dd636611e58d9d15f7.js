/**
 * Deobfuscated from: default-login-render.61dd636611e58d9d15f7.js
 * Generated: 2025-10-05T13:04:15.127Z
 * 
 * This file has been automatically beautified from minified source.
 * Variable names are preserved from the original obfuscated code.
 * Manual analysis and renaming may be needed for better readability.
 */

(this.webpackJsonp = this.webpackJsonp || []).push([
  [14], {
    Fzrl: function(t, n, e) {
      "use strict";
      e.d(n, "a", (function() {
        return c
      }));
      var a = e("wudS");
      const c = async () => {
        let t = [];
        const n = await (async () => {
          let t = null;
          try {
            (await indexedDB.databases()).forEach((({
              name: n
            }) => {
              if (/^zdb_\d+$/g.test(n)) {
                const [e, a] = n.split("_");
                null === t && (t = []), t.push(a)
              }
            }))
          } catch (n) {}
          return t
        })();
        return t = null !== n ? n : Object(a.e)(), t
      }
    },
    ej0K: function(t, n, e) {
      "use strict";
      e.d(n, "a", (function() {
        return c
      }));
      var a = e("BGEY");
      async function c() {
        const t = window.localStorage.getItem("sh_z_recentuid") || window.localStorage.getItem("z_recentuid");
        await Object(a.b)(t)
      }
    }
  }
]);
//# sourceMappingURL=../sourcemaps/lazy/default-login-render.61dd636611e58d9d15f7.js.map
