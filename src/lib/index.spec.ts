import test from 'ava';

test('lib', (t) => {
  const dummy = () => console.log('Hello world!');

  t.is(typeof dummy, 'Function', 'dummy is a function');
});
