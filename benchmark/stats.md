# deep (175 bytes)
  dot-prop x 3,032,820 ops/sec ±0.28% (98 runs sampled)
  get-value x 3,595,570 ops/sec ±0.18% (99 runs sampled)
  getobject x 1,316,105 ops/sec ±0.18% (100 runs sampled)
  object-path x 1,016,509 ops/sec ±0.13% (99 runs sampled)

  fastest is get-value (by 101% avg)

# root (210 bytes)
  dot-prop x 11,487,197 ops/sec ±0.25% (97 runs sampled)
  get-value x 49,214,682 ops/sec ±0.18% (100 runs sampled)
  getobject x 7,407,736 ops/sec ±0.39% (96 runs sampled)
  object-path x 9,467,413 ops/sec ±0.66% (97 runs sampled)

  fastest is get-value (by 421% avg)

# shallow (84 bytes)
  dot-prop x 8,495,299 ops/sec ±0.67% (98 runs sampled)
  get-value x 8,161,977 ops/sec ±0.56% (96 runs sampled)
  getobject x 4,400,304 ops/sec ±0.53% (96 runs sampled)
  object-path x 4,452,725 ops/sec ±0.20% (98 runs sampled)

  fastest is dot-prop (by 50% avg)
