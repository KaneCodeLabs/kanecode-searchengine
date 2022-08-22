var KCSearchEngine = class {
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
			engine: {
				lowercase: true,
				normalize: true,
				spaces: true,
				trim: true
			},
			live: true,
			onBlur: (results, value) => {},
			onChange: (results, value) => {},
			onFocus: (results, value) => {},
			onInput: (results, value) => {},
			onSearch: (results, value) => {},
			onSubmit: (results, value) => {},
			placeholder: 'Search...',
			recommendations: {
				enabled: true,
				format: (item, value) => {
					const element = document.createElement('div');
					element.classList.add('kcsearchengine__recommendation');
					element.innerHTML = '<span class="kcsearchengine__recommendation-title"></span>';
					element.children[0].innerText = item.title;
					element.setAttribute('value', item.value);
					return element;
				},
				hideOnBlur: true,
				hideOnClick: true,
				hideOnEmpty: true,
				max: 6,
				noResultsMessage: 'No results found',
				searchingMessage: 'Searching...',
				errorMessage: 'Connection failed',
				showOnFocus: true,
				titleToInput: true
			},
			theme: 'light',
		};
		this.#options = this.defaults;

		this.render();

		// Merge the default options with the user options
		this.setOptions(options);
	}

	clear() {
		this.input.value = '';
		this.trigger();
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
			case 'engine.lowercase':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'engine.normalize':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'engine.spaces':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'engine.trim':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'live':
				if (typeof value !== 'boolean')
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
			case 'recommendations.errorMessage':
				if (typeof value !== 'string')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.format':
				if (typeof value !== 'string' && typeof value !== 'function')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.hideOnBlur':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.hideOnClick':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.hideOnEmpty':
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
			case 'recommendations.searchingMessage':
				if (typeof value !== 'string')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.showOnFocus':
				if (typeof value !== 'boolean')
					throw new Error(`The value is not valid for '${key}' option.`);
				break;
			case 'recommendations.titleToInput':
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
			this.options.data = value;
		} else {
			// Check if the key contains a dot
			if (key.indexOf('.') !== -1) {
				const [parentKey, childKey] = key.split('.');
				this.options[parentKey][childKey] = value;
			} else {
				this.options[key] = value;
			}
		}

		// Load the option
		this.#loadOption(key, value);
	}

	showRecommendations() {
		this.#renderRecommendations();
		this.element.classList.add('kcsearchengine--results');
	}

	hideRecommendations() {
		this.element.classList.remove('kcsearchengine--results');
	}

	trigger() {

		// Run the engine
		this.#engine(this.data, () => {

			// Check if the recommendations are enabled
			if (!this.#options.recommendations.enabled) return;
	
			// Show the recommendations
			this.showRecommendations();
		});
	}

	#processData(data) {

		// Initialize the data array
		let processedData = [];

		// Get the options data if not provided
		if (typeof data === 'undefined')
			data = this.options.data;
		
		// Check if the data is an array
		if (Array.isArray(data)) {
			
			// Check if the data is all an array of strings or objects
			if (data.every(item => typeof item === 'string' || (typeof item === 'object' && (typeof item?.title === 'string' || typeof item?.title === 'number')))) {
				
				// Loop through the data and process each item
				data.forEach(item => {

					// Convert the strings to objects
					if (typeof item === 'string')
						processedData.push({ title: item, value: item });

					// Check the object properties and fill the missing ones
					else {
						const _item = { title: item.title, value: item.title };
						if (Array.isArray(item.keywords))
							if (item.keywords.every(keyword => typeof keyword === 'string' || typeof keyword === 'number'))
								_item.keywords = item.keywords;
						if (typeof item.format === 'string' || typeof item.format === 'function')
							_item.format = item.format;
						if (typeof item.onclick === 'function')
							_item.onclick = item.onclick;
						if (typeof item.url === 'string')
							_item.url = item.url;
						if (typeof item.value === 'string' || typeof item.value === 'number')
							_item.value = item.value;

						processedData.push(_item);
					}
				});
			}
		}

		// Check if the data is an string
		else if (typeof data === 'string') {
			processedData = async function() {
				return new Promise((resolve, reject) => {
					fetcher(data, (error, response) => {
						if (error)
							reject(error);
						else
							resolve(response);
					});
					xhr.send();
				})
			}

			// Load data if live search is disabled
			if (!this.options.live)
				this.#engine();
		}

		// Check if the data is a function
		else if (typeof data === 'function') {
			
			processedData = data;

			// Load data if live search is disabled and the data is an async function
			if (!this.options.live && this.data.constructor.name === 'AsyncFunction')
				this.#engine();
		}

		// Throw an error if the data is not valid
		else
			new Error(`The value of 'data' option is not valid.`);

		// Return the processed data
		return processedData;
	}

	#generate() {
		const element = document.createElement('div');
		element.classList.add('kcsearchengine');
		element.innerHTML = `
			<div class="kcsearchengine__wrapper">
				<div class="kcsearchengine__input-group">
					<input type="text" class="kcsearchengine__input" placeholder="${this.#options.placeholder}" />
					<div class="kcsearchengine__button">
						${this.#options.button.icon ? this.#options.button.icon : ''}
					</div>
				</div>
				<div class="kcsearchengine__recommendations"></div>
			</div>`;

		this.#input = element.querySelector('.kcsearchengine__input');
		this.#element = element;

		this.input.addEventListener('input', () => {
			this.trigger();

			// Check if the input is empty
			if (this.options.recommendations.hideOnEmpty && this.input.value === '')
				this.hideRecommendations();
		});

		this.input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				if (this.options.onSubmit) {
					try {
						this.options.onSubmit(this.results, this.input.value);
					} catch (error) {
						throw new Error(error);
					}
				}
			}
			if (e.key === 'Escape') {
				e.preventDefault();
				this.clear();
			}
		});

		this.input.addEventListener('focus', () => {
			this.element.classList.add('kcsearchengine--focus');
			if (this.options.recommendations.hideOnEmpty && this.input.value === '') {
				this.hideRecommendations();
				return;
			}
			if (this.options.recommendations.showOnFocus)
				this.showRecommendations();
		});

		this.input.addEventListener('blur', () => {
			this.element.classList.remove('kcsearchengine--focus');
			if (this.options.recommendations.hideOnBlur)
				this.hideRecommendations();
		});

		this.element.querySelector('.kcsearchengine__recommendations').addEventListener('mousedown', (e) => {
			e.preventDefault();
		});
	}

	filter(text) {
		if (this.options.engine.lowercase)
			text = text.toLowerCase();
		if (this.options.engine.normalize)
			text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		if (this.options.engine.spaces)
			text = text.replace(/\s/g, '');
		if (this.options.engine.trim)
			text = text.trim();
		return text;
	}

	#engine(data, onComplete) {

		// Get the class data if not provided
		if (typeof data === 'undefined')
			data = this.data;

		// Check if the data is an array
		if (Array.isArray(data)) {

			// Do a copy of the data
			data = [...data];

			// Initialize the results and values arrays
			this.#results = [];
			this.#values = [];

			// Get the input value and filter it
			const value = this.filter(this.input.value);
			
			// Exit if the value is empty
			if (value.length === 0)
				return;

			// Loop through the data to find the equal title
			for (let i = 0; i < data.length; i++) {
				const title = this.filter(data[i].title);
				if (title === value) {
					this.results.push(data.splice(i, 1)[0]);
					i--;
				}
			}

			// Loop through the data to find titles that start with the input value
			for (let i = 0; i < data.length; i++) {
				const title = this.filter(data[i].title);
				if (title.startsWith(value)) {
					this.results.push(data.splice(i, 1)[0]);
					i--;
				}
			}

			// Loop through the data to find similar titles
			for (let i = 0; i < data.length; i++) {
				const title = this.filter(data[i].title);
				if (title.includes(value)) {
					this.results.push(data.splice(i, 1)[0]);
					i--;
				}
			}

			// Loop through the data to find keywords that are equal to the input value
			for (let i = 0; i < data.length; i++) {
				const keywords = data[i].keywords;
				if (!Array.isArray(keywords))
					continue;
				for (let j = 0; j < keywords.length; j++) {
					const keyword = this.filter(keywords[j]);
					if (keyword === value) {
						this.results.push(data.splice(i, 1)[0]);
						i--;
						break;
					}
				}
			}

			// Loop through the data to find keywords that start with the input value
			for (let i = 0; i < data.length; i++) {
				const keywords = data[i].keywords;
				if (!Array.isArray(keywords))
					continue;
				for (let j = 0; j < keywords.length; j++) {
					const keyword = this.filter(keywords[j]);
					if (keyword.startsWith(value)) {
						this.results.push(data.splice(i, 1)[0]);
						i--;
						break;
					}
				}
			}

			// Loop through the data to find similar keywords
			for (let i = 0; i < data.length; i++) {
				const keywords = data[i].keywords;
				if (!Array.isArray(keywords))
					continue;
				for (let j = 0; j < keywords.length; j++) {
					const keyword = this.filter(keywords[j]);
					if (keyword.includes(value)) {
						this.results.push(data.splice(i, 1)[0]);
						i--;
						break;
					}
				}
			}

			// Set the values from the results array
			this.#values = this.results.map(item => item.value);

			// Run the onComplete callback if provided
			if (typeof onComplete === 'function')
				onComplete();
		}

		// Check if the data is a function
		else if (typeof data === 'function') {

			// Function that show searching message
			const showSearchingMessage = () => {
				if (!this.options.recommendations.enabled) return;
				if (!this.element.classList.contains('kcsearchengine--focus')) return;
				if (!this.options.recommendations.showOnFocus) return;
				if (this.options.recommendations.hideOnEmpty && this.value == '') return;
				const recommendations = this.element.querySelector('.kcsearchengine__recommendations');
				if (!recommendations) return;
				recommendations.innerHTML = `<div class="kcsearchengine__recommendation-info">${this.options.recommendations.searchingMessage}</div>`;
				this.element.classList.add('kcsearchengine--results');
			}
			
			// Function that show error message
			const showErrorMessage = () => {
				if (!this.options.recommendations.enabled) return;
				if (!this.element.classList.contains('kcsearchengine--focus')) return;
				if (!this.options.recommendations.showOnFocus) return;
				if (this.options.recommendations.hideOnEmpty && this.value == '') return;
				const recommendations = this.element.querySelector('.kcsearchengine__recommendations');
				if (!recommendations) return;
				recommendations.innerHTML = `<div class="kcsearchengine__recommendation-info">${this.options.recommendations.errorMessage}</div>`;
				this.element.classList.add('kcsearchengine--results');
			}

			// Check if the data is an async function
			if (data.constructor.name === 'AsyncFunction') {

				// Update controller
				this.#controller.abort();
				this.#controller = new AbortController();

				const signal = this.#controller.signal;

				// Show the searching message
				showSearchingMessage();

				// Check if the data needs to be fetched every time the engine is called
				if (this.options.live) {
					data().then(data => {
						if (signal.aborted) return;
						this.#engine(this.#processData(data), onComplete);
					}).catch(error => {
						showErrorMessage();
					});
				}

				// Check if the data needs to be fetched only once
				else {
					data().then(data => {
						this.setOption('data', this.#processData(data));
					});
				}
			}

			// Check if the data is a regular function
			else {
				this.#engine(this.#processData(data()), onComplete);
			}
		}

		else {
			throw new Error('The data is not valid.');
		}
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
			case 'data':
				this.#data = this.#processData();
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
			case 'engine.lowercase':
			case 'engine.normalize':
			case 'engine.spaces':
			case 'engine.trim':
			case 'live':
			case 'onBlur':
			case 'onChange':
			case 'onFocus':
			case 'onInput':
			case 'onSearch':
			case 'onSubmit':
			case 'recommendations.errorMessage':
			case 'recommendations.format':
			case 'recommendations.hideOnBlur':
			case 'recommendations.hideOnClick':
			case 'recommendations.hideOnEmpty':
			case 'recommendations.max':
			case 'recommendations.noResultsMessage':
			case 'recommendations.searchingMessage':
			case 'recommendations.showOnFocus':
			case 'recommendations.titleToInput':
				break;
			default:
				throw new Error(`The option '${key}' does not exist.`);
		}
	}

	#renderRecommendations() {
		// Check if the element exists
		if (!this.element instanceof HTMLElement)
			throw new Error('The element has not been created yet.');

		// Check format function
		const checkFormat = (format) => {
			let result = undefined;

			// Check if the format is a function
			if (typeof format === 'function') {
				
				// Try that function works
				try {
					format({ title: 'Test', value: 'test', keywords: ['try'], url: '/test', onclick: () => {} }, 'test');
					result = format;
				} catch {}
			}

			// Check if the format is a string
			else if (typeof format === 'string') {
				result = (item, value) => {
					const element = document.createElement('div');
					element.classList.add('kcsearchengine__recommendation');
					element.innerHTML = format;
					element.setAttribute('value', item.value);
					return element;
				}
			}

			// Return the format function
			return result;
		}

		// Check if the format is valid
		let format = checkFormat(this.options.recommendations.format);
		if (!format) format = (item, value) => {
			const element = document.createElement('div');
			element.classList.add('kcsearchengine__recommendation');
			element.innerHTML = '<span class="kcsearchengine__recommendation-title"></span>';
			element.children[0].innerText = item.title;
			element.setAttribute('value', item.value);
			return element;
		};

		const value = this.value;
		const container = this.element.querySelector('.kcsearchengine__recommendations');
		container.innerHTML = '';
		for (let i = 0; i < this.results.length; i++) {
			const item = this.results[i];
			const element = format(item, value);
			element.addEventListener('click', () => {
				if (this.options.recommendations.titleToInput)
					this.input.value = item.title;
				if (typeof item.onclick === 'function')
					item.onclick();
				if (typeof item.url === 'string')
					window.location.href = item.url;
				if (this.options.recommendations.hideOnClick) {
					this.input.blur();
					this.hideRecommendations();
				}
			});
			container.appendChild(element);
			if (i >= this.options.recommendations.max) break;
		}

		if (container.innerHTML.trim() === '') {
			container.innerHTML = `<div class="kcsearchengine__recommendation-info">${this.options.recommendations.noResultsMessage}</div>`;
		}
	}

	get data() { return this.#data; }
	get defaults() { return this.#defaults; }
	get element() { return this.#element; }
	get input() { return this.#input; }
	get options() { return this.#options; }
	get placeholder() { return this.#input?.placeholder; }
	get results() { return this.#results; }
	get target() { return this.#target; }
	get themes() { return this.#themes; }
	get value() { return this.#input?.value; }
	get values() { return this.#values; }

	set placeholder(value) { if (this.#input instanceof HTMLInputElement) this.#input.placeholder = value; }
	set value(value) { if (this.#input instanceof HTMLInputElement) this.#input.value = value; }

	#data = [];
	#defaults = {};
	#controller = new AbortController();
	#element = null;
	#input = null;
	#options = {};
	#results = [];
	#target = null;
	#themes = ['light', 'dark', 'clear'];
	#values = [];
}