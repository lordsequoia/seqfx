# seqfx

[![GitHub Issues](https://img.shields.io/github/issues/lordsequoia/seqfx.svg?style=flat-square)](https://github.com/lordsequoia/seqfx/issues) [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/lordsequoia/seqfx.svg?style=flat-square)](https://github.com/lordsequoia/seqfx/pulls) [![MIT License](https://img.shields.io/github/license/lordsequoia/seqfx.svg?style=flat-square)](http://badges.mit-license.org) [![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square)](http://paypal.me/lordsequoia) [![Become a Patron!](https://img.shields.io/badge/Patreon-Become%20a%20Patron!-orange.svg?style=flat-square)](https://www.patreon.com/lordsequoia)

LordSequoia's reactive utilities.

## Installation

```bash
yarn init -y
yarn add seqfx
```

## Usage

```typescript
import {File, useStorage} from 'seqfx';

const {seen, when} = useStorage('.')

const textFileSeen = when(seen, '**/*.txt')

textFileSeen.watch((file: File) => console.log(`seen text file: ${file.path}`))
```

```typescript
import {File, WithData, useStorage} from 'seqfx';

const {seen, when, $read} = useStorage('.')

when(seen, '**/*.txt')
    .then((file: File) => $read(file.path))
    .then((file: WithData<File>) => console.log(`text file ${file.path} contents: ${file.data.length}`))
```

```typescript
import {useStorage} from 'seqfx';

const {$filter} = useStorage('.')
const $textFiles = $filter(file => file.path.indexOf('.txt') > -1)

$textFiles.watch(state => console.log(`storage has ${$textFiles.getState().length} text files`))
```

## Testing

```bash
yarn test
```

## Deployment

```bash
yarn deploy
```

## Contributing

> To get started...

1.  🍴 [Fork this repo](https://github.com/lordsequoia/seqfx#fork-destination-box)
2.  🔨 View the contributing guidelines at [CONTRIBUTING.md](.github/CONTRIBUTING.md)
3.  👥 Add yourself as a contributor under the credits section
4.  🔧 [Open a new pull request](https://github.com/lordsequoia/seqfx/compare)
5.  🎉 Get your pull request approved - success!

Or just [create an issue](https://github.com/lordsequoia/seqfx/issues) - any little bit of help counts! 😊

## Code of Conduct

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

More details can be found at this project's [code of conduct](.github/CODE_OF_CONDUCT.md).

## Credits

* [LordSequoia](https://github.com/lordsequoia) 🍓🍫
