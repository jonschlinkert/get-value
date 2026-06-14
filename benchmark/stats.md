# deep (338 bytes)
  dot-prop x 5,319,159 ops/sec ±0.76% (93 runs sampled)
  dotty x 3,870,706 ops/sec ±0.26% (96 runs sampled)
  get-value x 8,788,576 ops/sec ±0.19% (100 runs sampled)
  getobject x 1,979,207 ops/sec ±0.17% (98 runs sampled)
  object-path x 1,761,814 ops/sec ±0.25% (100 runs sampled)

  fastest is get-value (by 65% avg)

# root (215 bytes)
  dot-prop x 41,761,355 ops/sec ±0.89% (93 runs sampled)
  dotty x 29,943,256 ops/sec ±0.55% (99 runs sampled)
  get-value x 65,184,370 ops/sec ±1.00% (96 runs sampled)
  getobject x 13,780,598 ops/sec ±0.35% (98 runs sampled)
  object-path x 21,255,148 ops/sec ±0.45% (101 runs sampled)

  fastest is get-value (by 56% avg)

# shallow (91 bytes)
  dot-prop x 21,019,241 ops/sec ±0.46% (93 runs sampled)
  dotty x 15,912,833 ops/sec ±0.76% (96 runs sampled)
  get-value x 19,824,809 ops/sec ±0.40% (91 runs sampled)
  getobject x 7,537,059 ops/sec ±0.15% (97 runs sampled)
  object-path x 8,519,654 ops/sec ±0.21% (99 runs sampled)

  fastest is dot-prop (by 6% avg)
