export const write = (s: string, ...args: unknown[]): void => {
  process.stdout.write(s + args.join());
};

export const writeln = (s: string, ...args: unknown[]): void => {
  process.stdout.write(s + args.join() + '\n');
};
