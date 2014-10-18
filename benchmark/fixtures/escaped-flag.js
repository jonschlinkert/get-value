/**
 * Escaped dots. Some of the fns will fail on this.
 *
 * The last arg, `true` only has meaning for fns that
 * do escaping.
 */

module.exports = [{'a.b.c': {d: {e: {f: {g: 'THE END!'}}}}}, 'a\\.b\\.c.d.e.f.g', true];