/**
 * Escaped dots. Some of the fns will fail on this.
 */

module.exports = [{ 'a.b.c': { d: { e: { f: { g: 'success' } } } } }, 'a\\.b\\.c.d.e.f.g', true];
