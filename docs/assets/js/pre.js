// Add head meta tags
document.head.insertAdjacentHTML('beforeend', `
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<style>body{opacity:0}</style>

	<!-- jQuery libraries -->
	<script src="assets/js/jquery-3.6.0.min.js"></script>

	<!-- Semantic UI libraries -->
	<link rel="stylesheet" href="assets/semantic-ui/semantic.min.css">
	<script src="assets/semantic-ui/semantic.min.js"></script>

	<!-- Highlight libraries -->
	<link rel="stylesheet" href="assets/highlight/styles/default.min.css">
	<script src="assets/highlight/highlight.min.js"></script>
	<link rel="stylesheet" href="assets/css/highlight.css">

	<link rel="stylesheet" href="assets/css/style.min.css">`);

// Reload head scripts
[...document.head.querySelectorAll('script')].forEach(script => {
	const newScript = document.createElement('script');
	newScript.src = script.src;
	document.head.replaceChild(newScript, script);
});

// Modify head title
document.title += ' - SearchEngine Documentation';

// Add preloader
document.body.insertAdjacentHTML('afterbegin', `
	<div class="ui active inverted dimmer page-loader">
		<div class="ui loader"></div>
	</div>`);

// Add menu after preloader
document.body.insertAdjacentHTML('afterbegin', `
	<div class="ui left fixed vertical menu">
		<div class="item">
			<img class="ui tiny image" src="assets/img/logo.svg">
			<h5 style="margin-top: 2px;">Search Engine</h5>
		</div>
		<div class="item">
			Get started
			<div class="menu">
				<a class="item" href="./index.html">Introduction</a>
				<a class="item" href="./installation.html">Installation</a>
			</div>
		</div>
		<div class="item">
			Configuration
			<div class="menu">
				<a class="item" href="./data.html">Data</a>
				<a class="item" href="./results.html">Show results</a>
				<!-- <a class="item" href="./options.html">Options</a>
				<a class="item" href="./functions.html">Functions</a> -->
			</div>
		</div>
		<div class="item"><small>v2.0.0-alpha1</small></div>
	</div>`);

// Add script when page is loaded
window.addEventListener('load', () => {
	const script = document.createElement('script');
	script.src = 'assets/js/script.js';
	document.body.appendChild(script);
});