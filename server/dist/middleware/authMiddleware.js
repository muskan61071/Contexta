// Single-user local prototype: routes are intentionally local-only. Add real session auth before network deployment.
export function localOnly(_req, _res, next) { next(); }
