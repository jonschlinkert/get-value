# deep (175 bytes)
  dot-prop x 883,166 ops/sec ±0.93% (86 runs sampled)
  get-value x 1,448,928 ops/sec ±1.53% (87 runs sampled)
  getobject x 213,797 ops/sec ±0.85% (90 runs sampled)
  object-path x 184,347 ops/sec ±2.48% (85 runs sampled)

  fastest is get-value (by 339% avg)

# root (210 bytes)
  dot-prop x 3,905,828 ops/sec ±1.36% (87 runs sampled)
  get-value x 16,391,934 ops/sec ±1.43% (83 runs sampled)
  getobject x 1,200,021 ops/sec ±1.81% (88 runs sampled)
  object-path x 2,788,494 ops/sec ±1.81% (86 runs sampled)

  fastest is get-value (by 623% avg)

# shallow (84 bytes)
  dot-prop x 2,553,558 ops/sec ±0.89% (89 runs sampled)
  get-value x 3,070,159 ops/sec ±0.88% (90 runs sampled)
  getobject x 726,670 ops/sec ±0.81% (86 runs sampled)
  object-path x 922,351 ops/sec ±2.05% (86 runs sampled)

  fastest is get-value (by 219% avg)
