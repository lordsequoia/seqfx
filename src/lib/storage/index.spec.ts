import test from 'ava';

test('storage features', async (t) => {
  const double = (n: number) => n * 2;

  t.is(double(2), 4, '2 x 2 = 4');
});
