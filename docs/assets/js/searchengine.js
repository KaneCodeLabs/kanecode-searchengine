var KCSearchEngine = class KCSearchEngine {
	/**
	 * @description The search engine is a simple search engine that allows you to search and show search recommendations.
	 * @param {string | Element} element The element where the search engine will be placed.
	 * @param {object} options The options for the search engine.
	 * @returns {KCSearchEngine} The search engine object.
	 * @example
	 * const searchEngine = new KCSearchEngine('#search-engine', {
	 * 	data: ['Apple', 'Banana', 'Orange']
	 * });
	 */
	constructor(element, options) {
		// Check if the element exists
		if (typeof element === 'string')
			this.#target = document.querySelector(element);
		else if (element instanceof Element)
			this.#target = element;
		else
			throw new Error('The element does not exist.');
		
		// Check if the options are valid
		if (typeof options !== 'object')
			throw new Error('The options are not valid.');

		// Specify the default options
		this.#defaults = {
			button: {
				enabled: true,
				icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>',
			},
			data: [],
			onBlur: (search, result) => {},
			onChange: (search, result) => {},
			onFocus: (search, result) => {},
			onInput: (search, result) => {},
			onSearch: (search, result) => {},
			onSubmit: (search, result) => {},
			placeholder: 'Search...',
			recommendations: {
				enabled: true,
				max: 5,
				noResultsMessage: 'No results found.',
				showOnFocus: true,
			},
			theme: 'light',
		};
		this.#options = this.defaults;

		this.render();

		// Merge the default options with the user options
		this.setOptions(options);

	}

	render() {
		// Check if the target is valid
		if (!(this.target instanceof Element))
			throw new Error('The target is not valid.');

		this.#generate();
		this.setOptions(this.options);
		
		this.target.appendChild(this.element);
	}

	setOptions(options) {
		// Check if the options are valid
		if (typeof options !== 'object')
			throw new Error('The options are not valid.');

		// Convert the grouped options to a dotted options
		const dottedOptions = {};
		for (const [key, value] of Object.entries(options)) {
			if (typeof value === 'object' && key !== 'data') {
				for (const [subKey, subValue] of Object.entries(value))
					dottedOptions[`${key}.${subKey}`] = subValue;
			} else {
				dottedOptions[key] = value;
			}
		}

		// Set the options
		for (const [key, value] of Object.entries(dottedOptions)) {
			this.setOption(key, value);
		}
	}

	setOption(key, value) {
		// Check if the key is valid
		if (typeof key !== 'string')
			throw new Error('The key is not valid.');
		
		// Check if the value is valid for each key
		switch (key) {
			case 'button.enabled':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'button.icon':
				if (typeof value !== 'string' && value !== false) {
					throw new Error(`The value is not valid for '${key}' option.`);
				}
				break;
			case 'data':
				if (!Array.isArray(value) && typeof value !== 'function' && typeof value !== 'string')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'onBlur':
			case 'onChange':
			case 'onFocus':
			case 'onInput':
			case 'onSearch':
			case 'onSubmit':
				if (typeof value !== 'function')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'placeholder':
				if (typeof value !== 'string')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.enabled':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.max':
				if (typeof value !== 'number')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.noResultsMessage':
				if (typeof value !== 'string')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.showOnFocus':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'theme':
				if (this.#themes.indexOf(value) === -1)
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			default:
				throw new Error(`The key '${key}' does not exist.`);
		}

		// Check if the key is "data"
		if (key === 'data') {
			this.data = value;
		} else {
			// Check if the key contains a dot
			if (key.indexOf('.') !== -1) {
				const [parentKey, childKey] = key.split('.');
				this.#options[parentKey][childKey] = value;
			} else {
				this.#options[key] = value;
			}
			// Load the option
			this.#loadOption(key, value);
		}
	}

	#generate() {
		const element = document.createElement('div');
		element.classList.add('kcsearchengine');
		element.innerHTML = `
			<div class="kcsearchengine__wrapper">
				<div class="kcsearchengine__input-group">
					<input type="text" class="kcsearchengine__input" placeholder="${this.#options.placeholder}" />
					<button type="button" class="kcsearchengine__button">
						${this.#options.button.icon ? this.#options.button.icon : ''}
					</button>
				</div>
				<div class="kcsearchengine__recommendations"></div>
			</div>`;

		this.#input = element.querySelector('.kcsearchengine__input');
		this.#element = element;
	}

	#loadOption(key, value) {
		// Check if the element exists
		if (!this.element instanceof HTMLElement)
			throw new Error('The element has not been created yet.');
		
		switch(key) {
			case 'button.enabled':
				if (value)
					this.element.querySelector('.kcsearchengine__button').classList.add('kcsearchengine__button-appearance');
				else
					this.element.querySelector('.kcsearchengine__button').classList.remove('kcsearchengine__button-appearance');
				break;
			case 'button.icon':
				if (value) {
					this.element.querySelector('.kcsearchengine__button').innerHTML = value;
					this.element.querySelector('.kcsearchengine__button').classList.add('kcsearchengine__button-icon');
				}
				else
					this.element.querySelector('.kcsearchengine__button').classList.remove('kcsearchengine__button-icon');
				break;
			case 'placeholder':
				this.input.placeholder = value;
				break;
			case 'recommendations.enabled':
				if (value)
					this.element.classList.add('kcsearchengine__recommendations-enabled');
				else
					this.element.classList.remove('kcsearchengine__recommendations-enabled');
				break;
			case 'theme':
				this.#themes.forEach(theme => this.element.classList.remove(`kcsearchengine__theme-${theme}`));
				this.element.classList.add(`kcsearchengine__theme-${value}`);
				break;
			case 'onBlur':
			case 'onChange':
			case 'onFocus':
			case 'onInput':
			case 'onSearch':
			case 'onSubmit':
			case 'recommendations.max':
			case 'recommendations.noResultsMessage':
			case 'recommendations.showOnFocus':
				break;
			default:
				throw new Error(`The option '${key}' does not exist.`);
		}
	}

	get defaults() { return this.#defaults; }
	get element() { return this.#element; }
	get input() { return this.#input; }
	get options() { return this.#options; }
	get target() { return this.#target; }
	get themes() { return this.#themes; }

	#defaults = {};
	#element = null;
	#input = null;
	#options = {};
	#target = null;
	#themes = ['light', 'dark', 'clear'];
}