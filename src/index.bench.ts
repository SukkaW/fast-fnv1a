import { fnv1a, fnv1ahex } from '.';

(async () => {
  const { bench, group, run, do_not_optimize } = await import('mitata');
  const fnv1aPkg = (await import('fnv1a')).default;
  const sindresorhusFnv1a = (await import('@sindresorhus/fnv1a')).default;

  const str = 'the quick brown fox jumps over the lazy dog';

  group('fnv1a', () => {
    bench('fnv1a', () => do_not_optimize(fnv1aPkg(str)));
    bench('@sindresorhus/fnv1a', () => do_not_optimize(sindresorhusFnv1a(str, { size: 32 })));
    bench('fast-fnv1a', () => do_not_optimize(fnv1a(str)));
  });

  group('hex', () => {
    bench('fnv1a + toString(16)', () => do_not_optimize(fnv1aPkg(str).toString(16)));
    bench('@sindresorhus/fnv1a + toString(16)', () => do_not_optimize(sindresorhusFnv1a(str, { size: 32 }).toString(16)));
    bench('fast-fnv1a + toString(16)', () => do_not_optimize(fnv1a(str).toString(16)));
    bench('fnv1ahex', () => do_not_optimize(fnv1ahex(str)));
  });

  run();
})();
