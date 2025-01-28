# deep (338 bytes)
  dot-prop x 2,524,501 ops/sec ±3.47% (90 runs sampled)
  dotty x 1,990,042 ops/sec ±1.10% (91 runs sampled)
  get-value x 3,776,247 ops/sec ±0.71% (98 runs sampled)
  getobject x 1,166,194 ops/sec ±2.94% (94 runs sampled)
  object-path x 975,380 ops/sec ±0.27% (97 runs sampled)

  fastest is get-value (by 50% avg)

# root (215 bytes)
  dot-prop x 18,774,512 ops/sec ±0.67% (95 runs sampled)
  dotty x 16,732,378 ops/sec ±0.66% (95 runs sampled)
  get-value x 35,516,146 ops/sec ±1.16% (92 runs sampled)
  getobject x 7,743,671 ops/sec ±2.99% (95 runs sampled)
  object-path x 11,955,285 ops/sec ±0.48% (95 runs sampled)

  fastest is get-value (by 89% avg)

# shallow (91 bytes)
  dot-prop x 10,195,874 ops/sec ±0.88% (95 runs sampled)
  dotty x 8,383,019 ops/sec ±0.81% (97 runs sampled)
  get-value x 9,891,229 ops/sec ±0.88% (90 runs sampled)
  getobject x 4,333,202 ops/sec ±1.52% (99 runs sampled)
  object-path x 4,568,894 ops/sec ±1.60% (94 runs sampled)

  fastest is dot-prop (by 3% avg)
