/**
 * Opt-in compatibility shim for restricted Linux/sandbox environments where
 * os.networkInterfaces() throws EPERM. Normal environments keep native behavior.
 *
 * Usage:
 *   NODE_OPTIONS="-r ./scripts/network-compat.cjs" node --import tsx scripts/preflight.mjs
 *   NODE_OPTIONS="-r ./scripts/network-compat.cjs" node --import tsx scripts/render.ts ...
 */
const os = require("node:os");
const nativeNetworkInterfaces = os.networkInterfaces.bind(os);

os.networkInterfaces = function safeNetworkInterfaces() {
  try {
    return nativeNetworkInterfaces();
  } catch (error) {
    if (error && (error.code === "EPERM" || error.code === "EACCES")) {
      return {
        lo: [
          {address:"127.0.0.1", netmask:"255.0.0.0", family:"IPv4", mac:"00:00:00:00:00:00", internal:true, cidr:"127.0.0.1/8"},
          {address:"::1", netmask:"ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff", family:"IPv6", mac:"00:00:00:00:00:00", internal:true, cidr:"::1/128", scopeid:0},
        ],
      };
    }
    throw error;
  }
};
