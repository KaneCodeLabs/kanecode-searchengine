// Initialize all accordions
$('.ui.accordion').accordion();

// Initialize all code blocks
hljs.configure({tabReplace: '  '});
hljs.highlightAll();

// Initialize examples
$('.example-wrapper').each((i, wrapper) => {
	const button = document.createElement('div');
	button.className = 'ui left labeled example button';
	button.innerHTML = '<div class="ui basic label">Example</div><div class="ui button"><i class="code icon"></i></div>';

	//wrapper.classList.toggle('show-code');
	
	wrapper.prepend(button);
	if (wrapper.classList.contains('show-code'))
		button.children[1].classList.add('blue');
	else
		button.children[1].classList.remove('blue');

	button.children[1].addEventListener('click', () => {
		wrapper.classList.toggle('show-code');
		if (wrapper.classList.contains('show-code'))
			button.children[1].classList.add('blue');
		else
			button.children[1].classList.remove('blue');
	});

	const canvas = wrapper.querySelector('.example-canvas');
	if (canvas)
		canvas.style.maxWidth = '400px';
});

// Remove the loader when the page is loaded
setTimeout(() => {
	$('body').addClass('page-loaded');
}, 0);