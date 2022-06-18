import test from 'ava';

test('seqfx features', (t) => {
  const dummy = () => console.log('Hello world!');
  const dummy2 = () => console.log('Hello world 2!');

  t.is(typeof dummy, typeof dummy2, 'dummy is a function');
});
