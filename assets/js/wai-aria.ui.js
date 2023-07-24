docReady(function() {
	waiAriaTab();
	waiAriaBtns();
	waiAriaBtnPress();
	waiAriaBtnExpand();
	waiAriaCheckBox();
	waiAriaRadioBox();
	waiAriaListBox();
	waiAriaSlider();
	waiAriaHasPopupMenu();
	waiAriaMenuBar();
	waiAriaFormInvalid();
	// waiAriaCurrent();
});

// document ready 
function docReady(fn) {
	if (document.readyState === "complete" || document.readyState === "interactive") {
		setTimeout(fn, 1);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

// expanded event
function expandedEvent(btn){
	if(btn.expandEvent){
		return false;
	}
	btn.expandEvent = true;
	btn.addEventListener("click", () => {
		const expandEl = document.querySelector(`#${btn.getAttribute("aria-controls")}`);
		if(!expandEl) return;
		
		if(btn.getAttribute("aria-expanded") === 'true') {
			expandedClose(btn,expandEl);
		}else{
			expandedOpen(btn,expandEl);
		}
	});
	btn.addEventListener("keydown", e => {
		if (e.keyCode === 32 || e.keyCode === 13 ) { // space, enter
			btn.click();
			e.preventDefault();
		}
	});
}
function expandedOpen(btn,expandEl){
	btn.setAttribute("aria-expanded", true);
	if(expandEl) expandEl.style.display = "revert";
}
function expandedClose(btn,expandEl){
	btn.setAttribute("aria-expanded", false);
	if(expandEl) expandEl.style.display = "none";
}

// wai-aria tab ui
var waiAriaTab = function(){
	const tabs = document.querySelectorAll('[role="tab"]');
	const tabLists = document.querySelectorAll('[role="tablist"]');
	
	tabs.forEach(tab => {
		if(tab.getAttribute("aria-selected") == "true") {
			tab.tabIndex = 0;
		}else{
			tab.tabIndex = -1;
		}
		tab.addEventListener("click", e => {
			const parent = tab.parentNode.tagName === "LI" ? tab.parentNode.parentNode : tab.parentNode;
			const panelWrap = document.querySelector(`#${tab.getAttribute("aria-controls")}`).parentNode;
			
			parent.querySelectorAll('[aria-selected="true"]').forEach(t => {
				t.setAttribute("aria-selected", false)
				t.tabIndex = -1;
			});

			tab.setAttribute("aria-selected", true);
			tab.tabIndex = 0;
			
			panelWrap.querySelectorAll(':scope > [role="tabpanel"]').forEach(p => p.style.display = "none");
			
			panelWrap.querySelector(`#${tab.getAttribute("aria-controls")}`).style.display = "revert"
			
			e.preventDefault();
		});
	});

	
	
	tabLists.forEach(tabList => {
		tabList.addEventListener("keydown", e => {
			const parent = tabList.parentNode.tagName === "LI" ? tabList.parentNode.parentNode : tabList.parentNode;
			const innerTabs = parent.querySelectorAll('[role="tab"]');
			let tabFocus = 0;
			for(let i=0; i < innerTabs.length; i++){
				if(innerTabs[i].getAttribute("aria-selected") == "true") {
					tabFocus = i;
				}
			}
			if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 36 || e.keyCode === 35) {
				innerTabs[tabFocus].tabIndex = -1;
				if (e.keyCode === 39) { // right
					tabFocus++;
					if (tabFocus >= innerTabs.length) {
						tabFocus = 0;
					}
				} else if (e.keyCode === 37) { // left
					tabFocus--;
					if (tabFocus < 0) {
						tabFocus = innerTabs.length - 1;
					}
				} else if (e.keyCode === 36) { // home
					tabFocus = 0;
				} else if (e.keyCode === 35) { // end
					tabFocus = innerTabs.length - 1;
				}
				innerTabs[tabFocus].tabIndex = 0;
				innerTabs[tabFocus].click();
				innerTabs[tabFocus].focus();
				e.preventDefault();
			}
		});
	});
};

//wai-aria button
var waiAriaBtns = function(){
	const btns = document.querySelectorAll('[role="button"]');
	btns.forEach(btn => {
		btn.addEventListener("keydown", e => {
			if (e.keyCode === 32 || e.keyCode === 13) {
				btn.click();
				e.preventDefault();
			}
		});
	});
}

//wai-aria toggle button
var waiAriaBtnPress = function(){
	const pressButtons = document.querySelectorAll('[role="button"][aria-pressed], button[aria-pressed]');
	pressButtons.forEach(pressButton => {
		pressButton.addEventListener("click", () => {
			if(pressButton.getAttribute("aria-pressed") === 'true') {
				pressButton.setAttribute("aria-pressed", false);
			}else{
				pressButton.setAttribute("aria-pressed", true);
			}
		});
		
		pressButton.addEventListener("keydown", (e) => {
			if (e.keyCode === 32 || e.keyCode === 13 ) { // space, enter
				pressButton.click();
				e.preventDefault();
			}
		});
	});
};

//wai-aria expand button
var waiAriaBtnExpand = function(){
	const expandButtons = document.querySelectorAll('[role="button"][aria-expanded], button[aria-expanded]');
	expandButtons.forEach(expandButton => {
		expandedEvent(expandButton);
	});
};

//wai-aria checkbox
var waiAriaCheckBox = function(){
	const checkBoxes = document.querySelectorAll('[role="checkbox"]');
	
	checkBoxes.forEach(checkBox => {
		checkBox.tabIndex = 0;
		
		checkBox.addEventListener("click", () => {
			checkBoxEvent(checkBox);
		});
		
		checkBox.addEventListener("keydown", e => {
			if (e.keyCode === 32 ) { // space, enter
				checkBox.click();
				e.preventDefault();
			}
		});
	});
	
	function checkBoxEvent(target){
		if(target.hasAttribute("aria-controls")){
			const restBoxes = target.getAttribute("aria-controls").split(" ");
			let checkedBoxes = 0;
			let allChecked = false;
			for(let i=0; i < restBoxes.length; i++){
				const singleBox = document.getElementById(restBoxes[i]);
				checkedBoxes = singleBox.getAttribute("aria-checked") == "true" ? checkedBoxes = checkedBoxes+1 : checkedBoxes;
				allChecked = checkedBoxes == restBoxes.length ? "true" : "false";
			}
			if(allChecked=== 'true') {
				for(let i=0; i < restBoxes.length; i++){
					const singleBox = document.getElementById(restBoxes[i]);
					singleBox.setAttribute("aria-checked",false);
				}
				target.setAttribute("aria-checked", false);
			}else{
				for(let i=0; i < restBoxes.length; i++){
					const singleBox = document.getElementById(restBoxes[i]);
					singleBox.setAttribute("aria-checked",true);
				}
				target.setAttribute("aria-checked", true);
			}
		}else{
			if(target.getAttribute("aria-checked") === 'true') {
				target.setAttribute("aria-checked", false);
			}else{
				target.setAttribute("aria-checked", true);
			}
		}
	}
};

//wai-aria radiobox
var waiAriaRadioBox = function(){
	const radioGroups = document.querySelectorAll('[role="radiogroup"]');
	
	radioGroups.forEach(radioGroup => {
		const radioBox = radioGroup.querySelectorAll('[role="radio"]');
		const firstRadio = radioBox[0];
		const lastRadio = radioBox[radioBox.length-1];
		let hasChecked = false;
		for(let i=0; i < radioBox.length; i++){
			if(radioBox[i].getAttribute("aria-checked") == "true") {
				radioBox[i].tabIndex = 0;
				hasChecked = true;
			}else {
				radioBox[i].tabIndex =  -1;
			}
			
			radioBox[i].addEventListener("click", e => {
				const target = e.currentTarget;
				radioBox.forEach(radio => {
					if(radio !== target) {
						radio.setAttribute("aria-checked", false);
						radio.tabIndex = -1;
					}
				});
				target.setAttribute("aria-checked", true);
				target.tabIndex = 0;
			});
			
			radioBox[i].addEventListener("keydown", e => {
				const target = e.currentTarget;
				if (e.keyCode === 37 || e.keyCode === 38) { // previous : left,up
					target.setAttribute("aria-checked", false);
					target.tabIndex = -1;
					if(target == firstRadio){
						lastRadio.setAttribute("aria-checked", true);
						lastRadio.tabIndex = 0;
						lastRadio.focus();
					}else{
						radioBox[i-1].setAttribute("aria-checked", true);
						radioBox[i-1].tabIndex = 0;
						radioBox[i-1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 39 || e.keyCode === 40) { // next : right,down
					target.setAttribute("aria-checked", false);
					target.tabIndex = -1;
					if(target == lastRadio){
						firstRadio.setAttribute("aria-checked", true);
						firstRadio.tabIndex = 0;
						firstRadio.focus();
					}else{
						radioBox[i+1].setAttribute("aria-checked", true);
						radioBox[i+1].tabIndex = 0;
						radioBox[i+1].focus();
					}
					e.preventDefault();
				}
				
				if (e.keyCode === 13 || e.keyCode === 32) { // select: enter, space
					if(target.getAttribute("aria-checked") !== 'true') {
						target.setAttribute("aria-checked", true);
					}
					e.preventDefault();
				}
			});
			
		}
		if(!hasChecked) radioBox[0].tabIndex = 0; 
	});
	
};


//wai-aria listbox
var waiAriaListBox = function(){
	const boxBtns = document.querySelectorAll('[aria-haspopup="listbox"]');
	boxBtns.forEach(boxBtn => {
		expandedEvent(boxBtn);
		const listBox = document.querySelector(`#${boxBtn.getAttribute("aria-controls")}`);
		const listOptions = listBox.querySelectorAll('[role="option"]');
		
		boxBtn.addEventListener("click", e => {
			const listSelected = listBox.querySelector('[role="option"][aria-selected="true"]');
			if(listSelected){
				listSelected.focus();
			}else{
				listOptions[0].focus();
			}
		});
		
		boxBtn.addEventListener("keydown", e => {
			if(e.keyCode === 38) { // up
				boxBtn.click();
				const listSelected = listBox.querySelector('[role="option"][aria-selected="true"]');
				if(listSelected){
					listSelected.focus();
				}else{
					listOptions[listOptions.length-1].focus();
				}
				e.preventDefault();
			}
			if(e.keyCode === 40) { // down
				boxBtn.click();
				e.preventDefault();
			}
		});
		
		for(let i=0; i < listOptions.length; i++){
			listOptions[i].tabIndex = -1;
			listOptions[i].addEventListener("click", e => {
				listSelectEvent(listBox,boxBtn,listOptions[i]);
				boxBtn.click();
				boxBtn.focus();
				e.preventDefault();
			});
			
			listOptions[i].addEventListener("keydown", e => {
				if(e.keyCode === 13) { // enter
					listOptions[i].click();
					e.preventDefault();
					e.stopPropagation();
				}
				if(e.keyCode === 38) { // up
					if(i == 0) {
						listOptions[listOptions.length-1].focus();
						listSelectEvent(listBox,boxBtn,listOptions[listOptions.length-1]);
					}else{
						listOptions[i-1].focus();
						listSelectEvent(listBox,boxBtn,listOptions[i-1]);
					}
					e.preventDefault();
				}
				if(e.keyCode === 40) { // down
					if(i == listOptions.length-1) {
						listOptions[0].focus();
						listSelectEvent(listBox,boxBtn,listOptions[0]);
					}else{
						listOptions[i+1].focus();
						listSelectEvent(listBox,boxBtn,listOptions[i+1]);
					}
					e.preventDefault();
				}
				if (e.keyCode === 9 || e.keyCode === 27) { // tab, esc
					boxBtn.click();
					boxBtn.focus();
					e.preventDefault();
				}
			});
		}
	});
	
	function listSelectEvent(listBox,boxBtn,listOption){
		const selected = listBox.querySelector('[role="option"][aria-selected="true"]');
		const currentTxt = boxBtn.innerText;
		const newTxt = listOption.innerText;
		if(!selected){
			listOption.setAttribute("aria-selected",true);
			boxBtn.innerHTML = boxBtn.innerHTML.replace(currentTxt,newTxt);
		}
		if(selected !== listOption) {
			selected.setAttribute("aria-selected",false);
			listOption.setAttribute("aria-selected",true);
			boxBtn.innerHTML = boxBtn.innerHTML.replace(currentTxt,newTxt);
		}
	}
}


//wai aria slider
var waiAriaSlider = function(){
	const sliders = document.querySelectorAll('[role="slider"]');
	
	sliders.forEach(slider => {
		
		const maxVal = slider.getAttribute("aria-valuemax") ? slider.getAttribute("aria-valuemax") : 100;
		const sliderWrap = slider.parentNode;
		const slideTo = slider.getAttribute("aria-orientation") ? slider.getAttribute("aria-orientation") : null;
		
		if(window.getComputedStyle(sliderWrap).getPropertyValue('position') !== "relative")  sliderWrap.style.position = "relative";
		sliders.tabIndex = 0;
		
		sliderWrap.addEventListener("drag", e => {
			sliderMouseEvent(slideTo, slider, sliderWrap, maxVal, e, true)
		});
		
		sliderWrap.addEventListener("dragend", e => {
			sliderMouseEvent(slideTo, slider, sliderWrap, maxVal, e)
		});
		
		sliderWrap.addEventListener("mouseup", e => {
			sliderMouseEvent(slideTo, slider, sliderWrap, maxVal, e)
		});
		
		slider.addEventListener("keydown", e => {
			if (e.keyCode === 37 || e.keyCode === 40) { // minus : left,up
				sliderKeyEvent(slideTo, slider, maxVal, false);
				e.preventDefault();
			}
			if (e.keyCode === 39 || e.keyCode === 38) { // add : right,down
				sliderKeyEvent(slideTo, slider, maxVal, true);
				e.preventDefault();
			}
		});
	});
	
	function sliderMouseEvent(slideTo, slider, sliderWrap, maxVal, e, mouseMove=false){
		const sliderWidth = slideTo && slideTo == "vertical" ? slider.offsetHeight : slider.offsetWidth;
		const wrapWidth = slideTo && slideTo == "vertical" ? sliderWrap.offsetHeight : sliderWrap.offsetWidth;
		const wrapPos = slideTo && slideTo == "vertical" ? sliderWrap.getBoundingClientRect().top : sliderWrap.getBoundingClientRect().left;
		const mousePos = slideTo && slideTo == "vertical" ? e.pageY : e.pageX;
		const leftPos = mousePos - wrapPos < 0 ? 0 : mousePos - wrapPos > wrapWidth ? wrapWidth :  mousePos - wrapPos;
		const nowVal = Math.round(leftPos * (maxVal/wrapWidth));
		if(mouseMove){
			if(e.which == 1) {
				if(slideTo && slideTo == "vertical"){
					slider.style.top = leftPos + "px";
					slider.style.marginTop = -(sliderWidth/2)+"px";
				}else{
					slider.style.left = leftPos + "px";
					slider.style.marginLeft = -(sliderWidth/2)+"px";
				}
				slider.setAttribute("aria-valuenow", nowVal); 
			}
		}else{
			if(slideTo && slideTo == "vertical"){
				slider.style.top = Math.round(nowVal/maxVal*100) + "%";
				slider.style.marginTop = -(sliderWidth/2)+"px";
			}else{
				slider.style.left = Math.round(nowVal/maxVal*100) + "%";
				slider.style.marginLeft = -(sliderWidth/2)+"px";
			}
			slider.setAttribute("aria-valuenow", nowVal);
		}
	}
	
	function sliderKeyEvent(slideTo, slider, maxVal, addition){
		const nowVal = parseInt(slider.getAttribute("aria-valuenow")) ? Number(slider.getAttribute("aria-valuenow")) : 0;
		let changePos = 0;
		if(addition) {
			changePos = nowVal+1 > maxVal ? maxVal : nowVal+1;
		}else{
			changePos = Number(nowVal)-1 < 0 ? 0 : nowVal-1;
		}
		const stylePos = maxVal < changePos ? 100 : Math.round((changePos/maxVal)*100);
		const sliderWidth = slideTo && slideTo == "vertical" ? slider.offsetHeight : slider.offsetWidth;
		if(slideTo && slideTo == "vertical"){
			slider.style.top = stylePos + "%";
			slider.style.marginTop = -(sliderWidth/2)+"px";
		}else{
			slider.style.left = stylePos + "%";
			slider.style.marginLeft = -(sliderWidth/2)+"px";
		}
		slider.setAttribute("aria-valuenow",changePos); 
	}
	
};

//wai aria menubar
var waiAriaMenuBar = function(){
	const menuBars = document.querySelectorAll('[role="menubar"]');
	menuBars.forEach(menuBar => {
		let menus = Array.from(menuBar.querySelectorAll('[role="menuitem"]'));
		if(menus.length < 1) return;
		const hasSubs =menuBar.querySelectorAll('[aria-haspopup="true"]');
		const subPops =[];
		for(let i=0; i < hasSubs.length; i++){
			subPops.push(menuBar.querySelector(`#${hasSubs[i].getAttribute("aria-controls")}`));
		}
		for(let i=0; i < subPops.length; i++){
			menus = menus.filter(menu => !subPops[i].contains(menu));
		}
		
		for(let i=0; i < menus.length; i++){
			menus[i].addEventListener("keydown", e => {
				if (e.keyCode === 39) {  // right
					if(menus[i] == menus[menus.length-1]){
						menus[0].focus();
					}else{
						menus[i+1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 37) { // left
					if(menus[i] == menus[0]){
						menus[menus.length-1].focus();
					}else{
						menus[i-1].focus();
					}
					e.preventDefault();
				}
			});
		}
	});
}

//wai aria menu haspopup
var waiAriaHasPopupMenu = function(){
	const haspops = document.querySelectorAll('[aria-haspopup="true"]');
	let mainBtn =false;
	haspops.forEach((haspop, index) => {
		const popup = document.querySelector(`#${haspop.getAttribute("aria-controls")}`);
		const isSub = !haspop.closest('[role="menu"]') ? false : true;
		if(!popup) return;
		let menus = Array.from(popup.querySelectorAll('[role="menuitem"]'));
		if(menus.length < 1) return;
		
		expandedEvent(haspop);
		
		const hasSubs =Array.from(popup.querySelectorAll('[aria-haspopup="true"]'));
		const subPops =[];
		for(let i=0; i < hasSubs.length; i++){
			subPops.push(popup.querySelector(`#${hasSubs[i].getAttribute("aria-controls")}`));
		}
		for(let i=0; i < subPops.length; i++){
			menus = menus.filter(menu => !subPops[i].contains(menu));
		}
		
		for(let i=0; i < menus.length; i++){
			menus[i].isSub = true;
			menus[i].addEventListener("keydown", e => {
				if(e.keyCode === 38) { // up
					if(menus[i] == menus[0]){
						menus[menus.length-1].focus();
					}else{
						menus[i-1].focus();
					}
					e.stopPropagation();
					e.preventDefault();
				}
				if(e.keyCode === 40) { // down
					if(menus[i] == menus[menus.length-1]){
						menus[0].focus();
					}else{
						menus[i+1].focus();
					}
					e.stopPropagation();
					e.preventDefault();
				}
				if (e.keyCode === 37) { // left
					haspop.click();
					haspop.focus();
					e.preventDefault();
				}
				if (e.keyCode === 9 || e.keyCode === 27) { // tab
					if(mainBtn){
						mainBtn.click();
						mainBtn.focus();
						e.preventDefault();
					}
				}
			});
		}

		haspop.addEventListener("click", e => {
			if(!haspop.isSub){
				mainBtn = haspop;
			}
			menus[0].focus();
			e.preventDefault();
			if(popup.style.display == "none"){
				hasSubs.forEach(hasSub => {
					const subpop = popup.querySelector(`#${hasSub.getAttribute("aria-controls")}`);
					if(!subpop) return;
					hasSub.setAttribute("aria-expanded", false);
					subpop.style.display = "none";
				})
			}else{
				
			}
		});
		
		haspop.addEventListener("keydown", e => {
			if(haspop.isSub){
				if (e.keyCode === 39) {  // right
					haspop.click();
					e.preventDefault();
				}
			}else{
				if(e.keyCode === 38) { // up
					haspop.click();
					menus[menus.length-1].focus();
					e.preventDefault();
				}
				if(e.keyCode === 40) { // down
					haspop.click();
					e.preventDefault();
				}
			}
		});
		
		haspop.addEventListener("keypress", e => {
			if(e.keyCode === 32) { // space
				haspop.click();
				event.preventDefault();
			}
		});
	});
	
};

// wai aria menu haspopup
var waiAriaHasPopup = function(){
	const haspops = document.querySelectorAll('[aria-haspopup="true"]');
	let depth = 0;
	let mainBtn = new Object();
	haspops.forEach(haspop => {
		
		const menubar = haspop.closest('[role="menubar"]');
		
		const popup = document.querySelector(`#${haspop.getAttribute("aria-controls")}`);
		if(!popup) return;
		const menus = popup.querySelectorAll('[role="menuitem"]');
		if(!menus) return;
		if(menubar) return;
		haspop.addEventListener("click", e => {
			/*if(menubar){
				const menulists = menubar.querySelectorAll('[aria-haspopup="true"]');
				menulists.forEach(menulist => {
					if(haspop !== menulist){
						menulist.setAttribute("aria-expanded",false);
						document.querySelector(`#${menulist.getAttribute("aria-controls")}`).style.display = "none";
					}
				});
			}*/
			
			const subpopups = [];
			menus.forEach(menu => {
				if(menu.getAttribute("aria-haspopup") && menu.getAttribute("aria-controls") ) {
					subpopups.push(document.querySelector(`#${menu.getAttribute("aria-controls")}`));
					menu.setAttribute("aria-expanded",false);
				}
			});
			if(haspop.getAttribute("aria-expanded") == "true"){
				if(depth < 1) {
					mainBtn = haspop;
				}
				depth = depth+1;
				menus[0].focus();
			}
			if(haspop.getAttribute("aria-expanded") == "false"){
				depth = depth-1;
			}
			if(subpopups.length > 0){
				subpopups.forEach(subpopup => {
					subpopup.style.display = "none";
				})
			}
			e.preventDefault();
		});
		
		haspop.addEventListener("keydown", e => {
			if(depth == 0 && e.keyCode === 38) { // up
				haspop.click();
				e.preventDefault();
			}
			if(depth == 0 && e.keyCode === 40) { // down
				haspop.click();
				menus[menus.length-1].focus();
				e.preventDefault();
			}
			if(depth == 0 && e.keyCode === 32) { // space
				haspop.click();
				e.preventDefault();
			}
			/*if(menubar){
				const menulists = menubar.querySelectorAll('[aria-haspopup="true"]');
				if(menulists.length > 1 && e.keyCode === 37) { //left menubar
					let menuIndex = 0;
					for(let i=0; i < menulists.length; i++){
						if(menulists[i] == haspop) {
							menuIndex = i;
						}
					}
					if(menuIndex == 0) menulists[menulists.length - 1].focus()
					else menulists[menuIndex-1].focus()
				}
				if(menulists.length > 1 && e.keyCode === 39) { //right menubar
					let menuIndex = 0;
					for(let i=0; i < menulists.length; i++){
						if(menulists[i] == haspop) {
							menuIndex = i;
						}
					}
					if(menuIndex == menulists.length - 1) menulists[0].focus()
					else menulists[menuIndex+1].focus()
				}
			}*/
		});
		
		for(let i=0; i < menus.length; i++){
			menus[i].tabIndex = -1;
			menus[i].addEventListener("keydown", e => {
				if (e.keyCode === 38) { // up
					if(menus[i] == menus[0]){
						menus[menus.length-1].focus();
					}else{
						menus[i-1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 40) { // down
					if(menus[i] == menus[menus.length-1]){
						menus[0].focus();
					}else{
						menus[i+1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 39) {  // right
					if(menus[i].getAttribute("aria-haspopup") === 'true'){
						menus[i].click();
					}
				}
				if (e.keyCode === 37) { // left
					if(depth > 1) {
						haspop.focus();
						haspop.click();
						e.preventDefault();
					}
				}
				if (e.keyCode === 27) { // esc
					mainBtn.focus();
					mainBtn.click();
					depth = 0;
					e.preventDefault();
				}
				if (e.keyCode === 9) { // tab
					mainBtn.click();
					depth = 0;
				}
				if (e.keyCode === 32) { // space
					menus[i].click();
					e.preventDefault();
				}
				if (e.keyCode === 36) { // home
					menus[0].focus();
					e.preventDefault();
				}
				if (e.keyCode === 35) { // end
					menus[menus.length-1].focus();
					e.preventDefault();
				}
				e.stopPropagation();
			});
			
		}
	});
	
};

var waiAriaFormInvalid = function(){
	const forms = document.querySelectorAll('[aria-invalid]');
	if(forms.length < 1) return;
	forms.forEach(form => {
		const alert = document.querySelector(`#${form.getAttribute("aria-describedby")}`);
		if(alert instanceof HTMLElement){
			form.addEventListener("change", ()=>{
				if(form.getAttribute("aria-invalid") == "false"){
					alert.style.display = "none";
				}else{
					alert.style.display = "revert";
				}
			});
		}
	});
}

var waiAriaCurrent = function(){
	const menus = document.querySelectorAll('[role="menuitem"][aria-current]');
	
	menus.forEach(menu => {
		const menuGroup = menu.closest('[role="menu"]');
		const menulists = menuGroup.querySelectorAll('[role="menuitem"]');
		
		menu.addEventListener("click", e => {
			for(let i=0; i < menulists.length; i++){
				if(menulists[i].getAttribute("aria-current") == "true") {
					menulists[i].setAttribute("aria-current", false);
				}
			}
			menu.setAttribute("aria-current", true);
		});
		
		menu.addEventListener("keydown", e => {
			if (e.keyCode === 13 || e.keyCode === 32) { // enter, space
				menu.click();
				e.preventDefault();
			}
			if (menulists.length > 1 && e.keyCode === 37) { // left
				let menuIndex = 0;
				for(let i=0; i < menulists.length; i++){
					if(menulists[i] == menu) {
						menuIndex = i;
					}
				}
				if(menuIndex == 0) menulists[menulists.length - 1].focus()
				else menulists[menuIndex-1].focus()
			}
			if(menulists.length > 1 && e.keyCode === 39) { //right menubar
				let menuIndex = 0;
				for(let i=0; i < menulists.length; i++){
					if(menulists[i] == menu) {
						menuIndex = i;
					}
				}
				if(menuIndex == menulists.length - 1) menulists[0].focus()
				else menulists[menuIndex+1].focus()
			}
			
		});
		
	});
	
}
