# @idleberg/yeoman-generator

[![License](https://img.shields.io/github/license/idleberg/yeoman-generator?color=blue&style=for-the-badge)](https://github.com/idleberg/yeoman-generator/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/@idleberg/yeoman-generator?style=for-the-badge)](https://www.npmjs.org/package/@idleberg/yeoman-generator)
![GitHub branch check runs](https://img.shields.io/github/check-runs/idleberg/yeoman-generator/main?style=for-the-badge)

An opinionated drop-in replacement for Yeoman generators, using modern libraries.

**Features**

- uses [Clack][Clack] for prompting
- uses [ETA][Eta] as template engine

## Installation 💿

```shell
npm i @idleberg/yeoman-generator
```

## Usage 🚀

**Example**

```typescript
import { Generator } from '@idleberg/yeoman-generator';

export default class extends Generator {
	async prompting() {
		this.clack.intro('Welcome to the generator!');

		const answers = await this.prompt([
			{
				type: 'text',
				name: 'name',
				message: 'What is your name?',
				placeholder: 'John Appleseed',
				validate: (value) => {
					if (value.length < 2) return 'Name must be at least 2 characters';
					return undefined;
				},
			},
		]);

		this.answers = answers
	}

	async writing() {
		this.fs.copyTpl(this.templatePath('index.eta'), this.destinationPath('index.html'), {
			...this.answers,
		});
	}
}
```

> [!IMPORTANT]
>
> While these generators aim at API-compatibility, you still need to be aware of the suble differences in the ETA template engine. See [ETA vs EJS](https://eta.js.org/docs/2.x.x/about/eta-vs-ejs) for details.

### `Generator`

For new generators, it's recommended to import the `Generator` class. Except for the prompts, it follows the default Yeoman generator API. Refer to the [Clack docs][Clack] on how to use prompts.

```typescript
import { Generator } from '@idleberg/yeoman-generator';

export default class extends Generator {}
```

### `GeneratorCompat`

For existing generators, you might want to use `GeneratorCompat` class. It also uses Clack for prompts, but adheres to the default prompting API, [Inquirer]. Take note of [these limitations](https://github.com/idleberg/yeoman-adapter-clack#limitations-%EF%B8%8F).

```typescript
import { GeneratorCompat } from '@idleberg/yeoman-generator';

export default class extends GeneratorCompat {}
```

### `this.clack`

For your convenience, the full `@clack/prompts` API is exposed within the class.

## Related 👫

- [yeoman-adapter-clack](https://www.npmjs.com/package/yeoman-adapter-clack)

## License ©️

This work is licensed under [The MIT License](LICENSE).

[Clack]: https://bomb.sh/docs/clack/packages/prompts/
[Eta]: https://eta.js.org/
[Inquirer]: https://github.com/SBoudrias/Inquirer.js
