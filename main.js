let script;
let allAssets;
let sceneName = "start-common";  // First scene
let prevScene;
let context = "start";
let prevContext = context;
let pos = 0;
let options;
let scale;

// Constants
const bgWidth = 1920;  // Background size
const bgHeight = 1080;
let buttonNaturalWidth;
let opButtonNaturalWidth;
let opButtonNaturalHeight;

const title = document.getElementById("title");
const author = document.getElementById("author");
const credits = document.getElementById("credits");
const box = document.getElementById("box");
const optionContainer = document.getElementById("option-container");
const background = document.getElementById("bg");
const sprite = document.getElementById("sprite");
const dialoguebox = document.getElementById("dialoguebox");
const dialoguetext = document.getElementById("dialoguetext");
const namebox = document.getElementById("namebox");
const nametext = document.getElementById("nametext");
const endtext = document.getElementById("endtext");
const choiceContainer = document.getElementById("choice-container");

// Fetch list of assets
fetch('./assetlist.json')
	.then(response => response.json())
	.then(data => {
		allAssets = data;
		
		for (var key of Object.keys(allAssets)) {
			preloadImage(allAssets[key]);
		}
	}).catch(error => {
		console.log('Request failed:', error);
	});

// Fetch script
fetch('./script.json')
	.then(response => response.json())
	.then(data => {
		script = data;
	}).catch(error => {
		console.log('Request failed:', error);
	});

function preloadImage(name) {
	var img = new Image();
	img.src = "assets/" + name;
	img.onload = onLoadCallback;
}

var x = 0;

function onLoadCallback() {
	x += 1;
	
	if (x == Object.keys(allAssets).length) {
		// Initialise assets
		namebox.src     = "assets/" + allAssets['namebox'];
		dialoguebox.src = "assets/" + allAssets['dialoguebox'];
		sprite.src      = "assets/" + allAssets['sam-smile'];
		background.style.backgroundImage = "url(assets/" + allAssets['start']; + ")";
		
		namebox.style.display = "none";
		dialoguebox.style.display = "none";
		sprite.style.opacity = 0;
		
		var optext = ["Start", "Choice Select", "Credits"];
		
		for (var i = 0; i < 3; i++) {
			var optionButton = document.createElement("img");
			optionButton.src = 'assets/' + allAssets['startoption'];
			optionButton.style.position = "absolute";
			
			var optionText = document.createElement("div");
			optionText.style.position = "absolute";
			optionText.innerText = optext[i];
			
			optionContainer.appendChild(optionButton);
			optionContainer.appendChild(optionText);
		}
		
		for (var i = 0; i < 3; i++) {
			var choiceButton = document.createElement("img");
			choiceButton.src = 'assets/' + allAssets['choicebox'];
			choiceButton.style.position = "absolute";
			choiceButton.style.display = "none";

			var choiceText = document.createElement("div");
			choiceText.style.position = "absolute";
			choiceText.style.display = "none";
			
			choiceContainer.appendChild(choiceButton);
			choiceContainer.appendChild(choiceText);
		}
		
		// Set values for on click checking
		const dummyButton = document.createElement("img");
		dummyButton.src = 'assets/' + allAssets['choicebox'];
		
		buttonNaturalWidth = dummyButton.naturalWidth;
		
		const dummyOption = document.createElement("img");
		dummyOption.src = 'assets/' + allAssets['startoption'];
		
		opButtonNaturalWidth = dummyOption.naturalWidth;
		opButtonNaturalHeight = dummyOption.naturalHeight;
		
		// Adjust view twice to ensure visual consistency (yes, this is a hack)
		adjustView();
		adjustView();
	}
}

// Adjust elements on initialisation and window resize
function adjustView() {
	let clientWidth = document.documentElement.clientWidth;
	let clientHeight = document.documentElement.clientHeight;
	
	let ratio = bgWidth / bgHeight;
	
	let bgHeightResize, bgWidthResize;
	
	if (ratio >= clientWidth / clientHeight) {
		bgWidthResize = clientWidth;
		bgHeightResize = clientWidth / ratio;
	} else {
		bgWidthResize = clientHeight * ratio;
		bgHeightResize = clientHeight;
	}
	
	scale = bgHeightResize / bgHeight;

	let offset = (clientHeight - bgHeightResize) / 2 + 5 * scale;
	
	// Title
	title.style.paddingLeft = (clientWidth - bgWidthResize) / 2 + (130 * scale) + "px";
	title.style.paddingBottom = offset + (720 * scale) + "px";
	title.style.fontSize = (130 * scale) + "px";
	
	// Author
	author.style.paddingLeft = title.style.paddingLeft;
	author.style.paddingBottom = offset + (630 * scale) + "px";
	author.style.fontSize = (45 * scale) + "px";
	
	// Credits
	credits.style.paddingLeft = title.style.paddingLeft;
	credits.style.paddingBottom = offset + (400 * scale) + "px";
	credits.style.fontSize = (50 * scale) + "px";
	
	box.style.padding = (20 * scale) + "px";
	box.style.borderRadius = (20 * scale) + "px";
	
	// Start options
	optionContainer.style.paddingLeft = title.style.paddingLeft;
	optionContainer.style.bottom = (clientHeight - bgHeightResize) / 2 + (300 * scale) + "px";
	
	var children = optionContainer.children;
	
	for (var i = 0; i < children.length; i += 2) {
		var optionButton = children[i];
		var optionText   = children[i+1];
		
		adjustOptionStyle(i/2, optionButton, optionText);
	}

	// End text
	endtext.style.fontSize = (70 * scale) + "px";
	endtext.style.right = (clientWidth - bgWidthResize) / 2 + (50 * scale) + "px";
	endtext.style.bottom = (clientHeight - bgHeightResize) / 2 + (40 * scale) + "px";

	// Dialogue
	dialoguebox.style.bottom = offset + "px";
	dialoguebox.style.width = (dialoguebox.naturalWidth * scale) + "px";
	dialoguebox.style.height = (dialoguebox.naturalHeight * scale) + "px";
	
	let sidePadding = 100 * scale;
	
	let dialoguetextOffset = (clientWidth - bgWidthResize) / 2 + (bgWidthResize - (dialoguebox.naturalWidth * scale)) / 2 + sidePadding;
	
	dialoguetext.style.width = (dialoguebox.naturalWidth * scale - sidePadding * 2) + "px";
	dialoguetext.style.height = (dialoguebox.naturalHeight * scale - sidePadding) + "px";
	dialoguetext.style.paddingLeft = dialoguetextOffset + "px";
	dialoguetext.style.paddingBottom = offset + "px";
	dialoguetext.style.fontSize = (35 * scale) + "px";
	
	// Character name
	namebox.style.width = (namebox.naturalWidth * scale) + "px";
	namebox.style.height = (namebox.naturalHeight * scale) + "px";
	namebox.style.paddingLeft = (dialoguetextOffset - sidePadding + 10 * scale) + "px";
	namebox.style.paddingBottom = (offset + 300 * scale) + "px";
	
	nametext.style.width = namebox.style.width;
	nametext.style.height = namebox.style.height;
	nametext.style.paddingLeft = namebox.style.paddingLeft;
	nametext.style.fontSize = (32 * scale) + "px";
	nametext.style.paddingBottom = (offset + 300 * scale - ((namebox.naturalHeight - 40) * scale / 2)) + "px";
	
	// Sprite
	sprite.style.height = (sprite.naturalHeight * scale * 0.68) + "px";
	sprite.style.paddingBottom = (clientHeight - bgHeightResize) / 2 + "px";
	
	// Choice container
	choiceContainer.style.paddingLeft = (clientWidth - buttonNaturalWidth * scale) / 2 + "px";
	choiceContainer.style.bottom = (clientHeight - bgHeightResize) / 2 + bgHeightResize + "px";
	
	var children = choiceContainer.children;
	
	for (var i = 0; i < children.length; i += 2) {
		var choiceButton = children[i];
		var choiceText   = children[i+1];
		
		adjustButtonStyle(i/2, choiceButton, choiceText);
	}
}

window.addEventListener("resize", adjustView);

var n = 0;
var txt;
var speed = 30;
var clear = false;
var timerid;

var interrupt = false;

function typeWriter() {
	if (clear) {
		n = 0;
		clearTimeout(timerid);
		clear = false;
		interrupt = false;
	}
	
	if (interrupt) {
		dialoguetext.innerHTML = txt;
		context = "normal";
	} else if (n < txt.length) {  // Set typewriter effect
		dialoguetext.innerHTML += txt.charAt(n);
		n++;
		timerid = setTimeout(typeWriter, speed);
	} else {
		clearTimeout(timerid);
		context = "normal";
	}
}

var duration = 300, interval = 10;
var max = duration / interval;
var count = max;
var opacity = 1;
var optimerid;

function imgFadeOut() {
	if (count > 0) {
		count -= 1;
		sprite.style.opacity = count / max;
	} else {
		count = max;
		clearInterval(optimerid);
	}
}

function imgFadeIn() {
	if (count > 0) {
		count -= 1;
		sprite.style.opacity = 1 - count / max;
	} else {
		count = max;
		clearInterval(optimerid);
	}
}

function endTextFadeIn() {
	if (count > 0) {
		count -= 1;
		endtext.style.opacity = 1 - count / max;
	} else {
		count = max;
		clearInterval(optimerid);
	}
}

viewCredits = false;

document.addEventListener("click", function(event) {
	if (context === 'start') {
		let [picked, result] = mouseOnOption(event.clientX, event.clientY);
		
		if (picked) {
			if (result === 0 && viewCredits) {  // Restore start screen after viewing credits
				viewCredits = false;
				credits.style.display = "none";
				
				title.style.display = "block";
				author.style.display = "block";
				
				for (var i = 2; i < optionContainer.children.length; i++) {
					optionContainer.children[i].style.display = "block";
				}
				
				optionContainer.children[1].innerText = "Start";
			} else if (result === 0 || result === 1) {  // Start or Choice Select
				if (result === 1) {  // Choice select
					sceneName = 'choice-select';
				}
				
				context = 'normal';
				title.style.display = "none";
				author.style.display = "none";
				optionContainer.style.display = "none";

				setTimeout(function() { 
					dialoguebox.style.display = "block";
					dialoguetext.style.display = "block"; 
				}, 1000);
			} else if (result === 2) {
				viewCredits = true;
				credits.style.display = "block";
				
				title.style.display = "none";
				author.style.display = "none";
				
				for (var i = 2; i < optionContainer.children.length; i++) {
					optionContainer.children[i].style.display = "none";
				}
				
				optionContainer.children[1].innerText = "Back";
			}
		}
	}
	
	if (context === 'choice') {
		let [picked, result] = mouseOnChoice(options.length, event.clientX, event.clientY);
		
		if (picked) {
			sceneName = options[result]['outcome'];
			context = 'normal';
			pos = 0;
			
			var children = choiceContainer.children;
	
			for (var i = 0; i < children.length; i += 2) {
				var choiceButton = children[i];
				var choiceText   = children[i+1];
				
				choiceButton.style.display = "none";
				choiceText.style.display = "none";
			}
		}
	}
	
	var scene = script[sceneName];
	
	if (context === 'normal') {
		if (prevScene !== sceneName) {
			pos = 0;
			prevScene = sceneName;
		} else {
			pos += 1;
		}
	}
	
	if (context === 'read')  { // Click while reading
		interrupt = true;
	}
	
	if (context === 'normal' && pos < scene.length) {		
		let action = scene[pos];
		
		if ("sprite" in action) {
			sprite.src = "assets/" + allAssets[action['sprite']];
			
			// Adjust sprite height twice; prevents graphical glitches
			sprite.style.height = (sprite.naturalHeight * scale * 0.68) + "px";
			
			sprite.onload = function() {
				sprite.style.height = (sprite.naturalHeight * scale * 0.68) + "px";
			};
		}
		
		if ("background" in action) {
			background.style.backgroundImage = "url(assets/" + allAssets[action['background']] + ")";
		}
		
		if ("transition" in action) {
			var transition = action['transition'];
			var callback;
			
			if (transition === "fadeIn") {
				callback = imgFadeIn;
			} else {
				callback = imgFadeOut;
			}
			
			optimerid = setInterval(callback, interval);
		}
		
		if ("line" in action) {
			line = action['line']
			
			if (line['name'] === "") {
				namebox.style.display = "none";
			} else if (namebox.style.display === "none") {
				namebox.style.display = "block";
			}
			
			nametext.innerHTML = line['name'];	
			dialoguetext.innerHTML = "";
		
			txt = line['text'];
			clear = true;
			
			if (line['name'] !== "") {
				txt = "\u201c" + txt + "\u201d";  // Set quotation marks for character dialogue
			}
			
			context = "read";
			
			if (prevContext === 'start') {
				setTimeout(function(){ typeWriter(); }, 1000);
			} else {
				typeWriter();
			}
		}
		
		if ("choice" in action) {
			context = "choice";
			
			options = action["choice"];
			
			let choices = [];
			
			for (var i = 0; i < options.length; i++) {
				choices.push(options[i]['label']);
			}
			
			setChoices(choices);
		}
		
		if ("end" in action) {
			dialoguebox.style.display = "none";
			dialoguetext.style.display = "none";
			
			endtext.style.opacity = 0;
			endtext.style.display = "block";
			
			endtext.innerText = action["end"];
			setTimeout(function() {
				optimerid = setInterval(endTextFadeIn, interval);
			}, 500);
		}
		
		if ("jump" in action) {
			if (action['jump'] === 'start-menu') {
				endtext.style.display = "none";
				
				background.style.backgroundImage = "url(assets/" + allAssets['start']; + ")";
				
				setTimeout(function() {
					title.style.display = "block";
					author.style.display = "block";
					optionContainer.style.display = "block";
				}, 1000);
				
				context = 'start';
				
				sceneName = 'start-common';
			} else {			
				sceneName = action['jump'];
			}
		}
	}
	
	prevContext = context;
});

function setChoices(choices) {
	var children = choiceContainer.children;
	
	for (var i = 0; i < choices.length; i++) {
		var choiceButton = children[i*2];
		var choiceText   = children[i*2+1];
		
		choiceText.innerText = choices[i];
		
		choiceButton.style.display = "block";
		choiceText.style.display = "block";
	}
}

function adjustButtonStyle(n, choiceButton, choiceText) {
	const topPadding = 130;
	const spacing = 40;
	
	let yoffset = (topPadding * scale + n * ((choiceButton.naturalHeight + spacing) * scale));
	
	choiceButton.style.width = (choiceButton.naturalWidth * scale) + "px";
	choiceButton.style.paddingTop = yoffset + "px";

	choiceText.style.fontSize = (32 * scale) + "px";
	choiceText.style.width = choiceButton.style.width;
	choiceText.style.paddingTop = yoffset + (28 * scale) + "px";
}

function mouseOnChoice(n, x, y) {
	let left = parseFloat(choiceContainer.style.paddingLeft, 10);
	let right = left + buttonNaturalWidth * scale;
	
	let topOffset = (document.documentElement.clientHeight - bgHeight * scale) / 2;
	
	for (var i = 0; i < n; i++) {
		let choiceButton = choiceContainer.children[i*2];
		
		let top = topOffset + parseFloat(choiceButton.style.paddingTop, 10);
		let bottom = top + choiceButton.naturalHeight * scale;
		
		if (x >= left && x <= right && y >= top && y <= bottom)
			return [true, i];
	}
	
	return [false, -1];
}

function adjustOptionStyle(n, optionButton, optionText) {
	const spacing = 40;
	
	let xoffset = n * (spacing + optionButton.naturalWidth) * scale;
	
	optionButton.style.width = (optionButton.naturalWidth * scale) + "px";
	optionButton.style.paddingLeft = xoffset + "px";
	
	optionText.style.fontSize = (48 * scale) + "px";
	optionText.style.width = optionButton.style.width;
	optionText.style.paddingTop = (35 * scale) + "px";
	optionText.style.paddingLeft = optionButton.style.paddingLeft;
}

function mouseOnOption(x, y) {
	let top = document.documentElement.clientHeight - parseFloat(optionContainer.style.bottom, 10);
	let bottom = top + opButtonNaturalHeight * scale;
	
	for (var i = 0; i < 3; i++) {
		let optionButton = optionContainer.children[i*2];
		
		let left = parseFloat(optionContainer.style.paddingLeft, 10) + parseFloat(optionButton.style.paddingLeft, 10);
		let right = left + opButtonNaturalWidth * scale;
		
		if (x >= left && x <= right && y >= top && y <= bottom)
			return [true, i];
	}
	
	return [false, -1];
}
