const stats = require('./stats.json');

const calculateDiff = values => {
  const fastest = Math.max(...values);
  const secondFastest = Math.max(...values.filter(value => value !== fastest));
  const diff = ((fastest - secondFastest) / secondFastest) * 100;
  return diff;
};

const calculate = stats => {
  const values = stats.results.map(result => result.hz);
  const diff = calculateDiff(values);
  const percent = `${Math.round(diff)}%`;
  return percent;
};

const renderTarget = target => {
  let output = `# ${target.name} ${target.file.bytes}\n`;

  for (let i = 0; i < target.results.length; i++) {
    const stats = target.results[i];
    output += `  ${stats.name} x ${stats.ops} ops/sec ±${stats.rme}%`;
    output += ` (${stats.runs} runs sampled)\n`;
  }

  output += `\n  fastest is ${target.fastest.join(', ')}`;
  output += ` (by ${calculate(target)} avg)\n`;
  return output;
};

const render = benchmarks => {
  const lines = [];

  for (let i = 0; i < benchmarks.length; i++) {
    lines.push(renderTarget(benchmarks[i]));
  }

  return lines.join('\n');
};

console.log(render(stats));
module.exports = render;
