//================================================
/*

Ambient Aurea
Instantly craft stunning photo galleries with ambient lighting effects in a single click.
Copyright (C) 2024 Stefan vd
www.stefanvd.net

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/

*/
//================================================

function $(id){ return document.getElementById(id); }
var el;
function SD(id){ return el.shadowRoot.getElementById(id); }

// settings
var default_opacity = null, interval = null, fadein = null, fadeout = null, lightcolor = null, ambilight = null, ambilightrangeblurradius = null, ambilightrangespreadradius = null, ambilightfixcolor = null, ambilight4color = null, ambilightvarcolor = null, ambilightcolorhex = null, ambilight1colorhex = null, ambilight2colorhex = null, ambilight3colorhex = null, ambilight4colorhex = null, sharebar = null, count = null, slideshow = null, slideshowrefresh = null, atmosvivid = null;

var stefanvdaavivideffect;
var countss; // slideshow counter
var sourceImageWidth;
var sourceImageHeight;

var jcurrent = 0;
var kmax;

var p1;
var p2;
var p3;
var p4;

var hex1;
var hex2;
var hex3;
var hex4;

chrome.storage.sync.get(["interval", "fadein", "fadeout", "lightcolor", "ambilight", "ambilightrangeblurradius", "ambilightrangespreadradius", "ambilightfixcolor", "ambilightvarcolor", "ambilightcolorhex", "ambilight4color", "ambilight1colorhex", "ambilight2colorhex", "ambilight3colorhex", "ambilight4colorhex", "sharebar", "atmosvivid", "slideshow"], function(response){
	interval = response["interval"]; if(interval == null)interval = 80; default_opacity = interval; // default interval 80%
	fadein = response["fadein"]; if(fadein == null)fadein = true;
	fadeout = response["fadeout"]; if(fadeout == null)fadeout = true;
	lightcolor = response["lightcolor"]; if(lightcolor == null)lightcolor = "#000000";
	ambilight = response["ambilight"]; if(ambilight == null)ambilight = true;
	ambilightrangeblurradius = response["ambilightrangeblurradius"]; if(ambilightrangeblurradius == null)ambilightrangeblurradius = 25;
	ambilightrangespreadradius = response["ambilightrangespreadradius"]; if(ambilightrangespreadradius == null)ambilightrangespreadradius = 15;
	ambilightfixcolor = response["ambilightfixcolor"]; if(ambilightfixcolor == null)ambilightfixcolor = false;
	ambilight4color = response["ambilight4color"]; if(ambilight4color == null)ambilight4color = false;
	ambilightvarcolor = response["ambilightvarcolor"]; if(ambilightvarcolor == null)ambilightvarcolor = true;
	ambilightcolorhex = response["ambilightcolorhex"]; if(ambilightcolorhex == null)ambilightcolorhex = "#CCCCCC";
	ambilight1colorhex = response["ambilight1colorhex"]; if(ambilight1colorhex == null)ambilight1colorhex = "#FF0000";
	ambilight2colorhex = response["ambilight2colorhex"]; if(ambilight2colorhex == null)ambilight2colorhex = "#FFEE00";
	ambilight3colorhex = response["ambilight3colorhex"]; if(ambilight3colorhex == null)ambilight3colorhex = "#00FF00";
	ambilight4colorhex = response["!ambilight4colorhex"]; if(ambilight4colorhex == null)ambilight4colorhex = "#0000FF";
	sharebar = response["sharebar"]; if(sharebar == null)sharebar = true;
	count = response["count"]; if(count == null)count = true;
	slideshow = response["slideshow"];
	slideshowrefresh = response["slideshowrefresh"]; if(slideshowrefresh == null)slideshowrefresh = 5;
	atmosvivid = response["atmosvivid"]; if(atmosvivid == null)atmosvivid = true;

	var firstimage = document.getElementsByTagName("img")[0];
	if(firstimage){
		// calc screen size
		var screenwidth = document.documentElement.clientWidth; var screenheight = document.documentElement.clientHeight;

		if($("stefanvdambientaurea") == null){
			var newmaster = document.createElement("ambient-aurea");
			newmaster.setAttribute("id", "stefanvdambientaurea");
			document.body.appendChild(newmaster);

			//------
			el = document.querySelector("#stefanvdambientaurea");
			el.attachShadow({mode: "open"});
			// Just like prototype & constructor bi-directional references, we have...
			// el.shadowRoot // the shadow root.
			// el.shadowRoot.host // the element itself.

			var link = document.createElement("link");
			link.id = "csspalette";
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = chrome.runtime.getURL("styles/aa.css");
			link.media = "all";
			el.shadowRoot.appendChild(link);
			//----
		}else{
			if(fadeout == true){ ReducingFinished = false; fader("hide"); }else{ var dodo = SD("stefanvdaalightareoff1"); el.shadowRoot.removeChild(dodo); }
		}


		var blackon = SD("stefanvdaagallery");
		if(blackon == null){
			// build gallery frame
			var newaagallery = document.createElement("div");
			newaagallery.setAttribute("id", "stefanvdaagallery");
			el.shadowRoot.appendChild(newaagallery);

			if(SD("stefanvdaavivideffect") == null){
				stefanvdaavivideffect = document.createElement("canvas");
				stefanvdaavivideffect.setAttribute("id", "stefanvdaavivideffect");
				newaagallery.appendChild(stefanvdaavivideffect);
			}

			var img = document.querySelectorAll("img");
			for(var s = 0; s < img.length; s++){
			// calc if size is not zero
				var height = img[s].naturalHeight;
				var width = img[s].naturalWidth;
				if((width > 1 || height > 1) && (img[s].src != "")){
					var newaaimage = document.createElement("img");
					jcurrent += 1;
					if(width > screenwidth){ // autozoom
						var c1 = width - screenwidth;
						var c3 = screenwidth - c1;
						newaaimage.width = c3 - 50;
					}else if(height > screenheight){
						var c2 = height - screenheight;
						var c4 = screenheight - c2;
						newaaimage.height = c4 - 50;
					}else if((height >= screenheight) && (width >= screenwidth)){ newaaimage.height = screenheight / 1.5; }else if((height == screenheight - 1)){ newaaimage.height = screenheight / 1.5; }
					newaaimage.onload = function(){ resizeframe(); refreshambilight(); refreshcounter(); };
					newaaimage.setAttribute("id", "stefanvdaagalleryimage" + jcurrent + "");
					newaaimage.setAttribute("class", "stefanvdaagalleryimagehide");
					newaaimage.src = img[s].src;
					newaagallery.appendChild(newaaimage);
				}
			}

			// first receive the show
			SD("stefanvdaagalleryimage" + "1" + "").setAttribute("class", "stefanvdaagalleryimageshow");
			sourceImageWidth = SD("stefanvdaagalleryimage" + "1" + "").clientWidth;
			sourceImageHeight = SD("stefanvdaagalleryimage" + "1" + "").clientHeight;
			newaagallery.style.left = (screenwidth / 2) - (sourceImageWidth / 2) + "px";
			newaagallery.style.top = (screenheight / 2) - (sourceImageHeight / 2) + "px";
			refreshambilight();

			// button next and previous image
			kmax = jcurrent;
			// button left
			var newaagalleryleft = document.createElement("div");
			newaagalleryleft.setAttribute("id", "stefanvdaagallerybuttonleft");
			newaagalleryleft.style.backgroundImage = "url('" + chrome.runtime.getURL("/images/arrow.png") + "')";
			newaagalleryleft.style.left = "20px";
			newaagalleryleft.style.top = (screenheight / 2) - 42 + "px";
			newaagalleryleft.addEventListener("click", function(){
				SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimagehide");
				if(jcurrent == 1){ jcurrent = kmax; }else{ jcurrent -= 1; }
				SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimageshow");
				resizeframe(); refreshambilight(); refreshcounter();
			});
			el.shadowRoot.appendChild(newaagalleryleft);
			// button right
			var newaagalleryright = document.createElement("div");
			newaagalleryright.setAttribute("id", "stefanvdaagallerybuttonright");
			newaagalleryright.style.backgroundImage = "url('" + chrome.runtime.getURL("/images/arrow.png") + "')";
			newaagalleryright.style.right = "20px";
			newaagalleryright.style.top = (screenheight / 2) - 42 + "px";
			newaagalleryright.addEventListener("click", function(){
				SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimagehide");
				if(jcurrent == kmax){ jcurrent = 1; }else{ jcurrent += 1; }
				SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimageshow");
				resizeframe(); refreshambilight(); refreshcounter();
			});
			el.shadowRoot.appendChild(newaagalleryright);

			window.addEventListener("keydown", function(e){
				var lightareoff = SD("stefanvdaalightareoff1");
				if(lightareoff != null){
					if(e.which == 37){
						SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimagehide");
						if(jcurrent == 1){ jcurrent = kmax; }else{ jcurrent -= 1; }
						SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimageshow");
						resizeframe(); refreshambilight(); refreshcounter();
					}else if(e.which == 39){
						SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimagehide");
						if(jcurrent == kmax){ jcurrent = 1; }else{ jcurrent += 1; }
						SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimageshow");
						resizeframe(); refreshambilight(); refreshcounter();
					}
				}
			}, false);

			// reset jcurrent to 1 first slide in the counter text
			jcurrent = 1;

			if(count == true){
				var newcounter = document.createElement("div");
				newcounter.setAttribute("id", "stefanvdaagallerycounter");
				newcounter.innerText = "" + jcurrent + "/" + kmax + "";
				el.shadowRoot.appendChild(newcounter);
			}

			window.addEventListener("resize", function(){ resizeframe(); }, false);

			var newdiv = document.createElement("div");
			newdiv.setAttribute("id", "stefanvdaalightareoff1");
			newdiv.setAttribute("class", "stefanvdaalightareoff");
			newdiv.style.width = "100%";
			newdiv.style.height = "100%";
			newdiv.style.left = 0;
			newdiv.style.top = 0;
			newdiv.style.position = "fixed";
			newdiv.style.background = lightcolor;
			newdiv.style.opacity = 0;
			newdiv.style.zIndex = 999;
			el.shadowRoot.appendChild(newdiv);

			// fade out effect
			if(fadeout == true){
				newdiv.addEventListener("click", function(){ ReducingFinished = false; fader("hide"); });
			}else{
				newdiv.addEventListener("click", function(){ removenewframe(); });
			}

			// fade in effect
			if(fadein == true){ fader("show"); }else{ newdiv.style.opacity = default_opacity / 100; } // no fade effect

			// ambilight time
			if(ambilight == true){ // yes show time
				refreshambilight();
			}

			// sharebar
			if(sharebar == true){
				var currenturl = window.location.href;
				var currentencodeurl = encodeURIComponent(currenturl);

				var newdivshare = document.createElement("div");
				newdivshare.setAttribute("id", "stefanvdaasharepanel");
				el.shadowRoot.appendChild(newdivshare);

				var sharept = document.createElement("div");
				sharept.setAttribute("id", "stefanvdpinterestshare");
				sharept.innerText = "Pinterest";
				sharept.addEventListener("click", function(){ window.open("https://pinterest.com/pin/create/button/?url=" + currentencodeurl + "", "Share to Pinterest", "width=600,height=460,menubar=no,location=no,status=no"); });
				newdivshare.appendChild(sharept);

				var sharefb = document.createElement("div");
				sharefb.setAttribute("id", "stefanvdfacebookshare");
				sharefb.innerText = "Facebook";
				sharefb.addEventListener("click", function(){ window.open("https://www.facebook.com/sharer.php?u=" + currenturl + "&t=Try this out, I am focus the image with Ambient Aurea browser extension!", "Share to Facebook", "width=600,height=460,menubar=no,location=no,status=no"); });
				newdivshare.appendChild(sharefb);

				var sharetw = document.createElement("div");
				sharetw.setAttribute("id", "stefanvdtwittershare");
				sharetw.innerText = "X";
				sharetw.addEventListener("click", function(){ window.open("https://twitter.com/share?url=" + currentencodeurl + "&text=Try this out, I am focus the image with Ambient Aurea browser extension! @ambientaurea", "Share to Twitter", "width=600,height=460,menubar=no,location=no,status=no"); });
				newdivshare.appendChild(sharetw);
			}

			if(slideshow == true){
				var newdivslideshow = document.createElement("div");
				newdivslideshow.setAttribute("id", "stefanvdaaslideshow");
				el.shadowRoot.appendChild(newdivslideshow);

				var newdivslideshowplay = document.createElement("a");
				newdivslideshowplay.setAttribute("id", "stefanvdaaplaybutton");
				newdivslideshowplay.setAttribute("class", "play stefanvdaaicon");
				newdivslideshowplay.style.display = "";
				newdivslideshowplay.addEventListener("click", function(){
					SD("stefanvdaaplaybutton").style.display = "none"; SD("stefanvdaapreviousbutton").style.display = ""; slideshowtimernext();
				});
				newdivslideshow.appendChild(newdivslideshowplay);
				var newdivslideshowpause = document.createElement("a");
				newdivslideshowpause.setAttribute("id", "stefanvdaapreviousbutton");
				newdivslideshowpause.setAttribute("class", "pause stefanvdaaicon");
				newdivslideshowpause.style.display = "none";
				newdivslideshowpause.addEventListener("click", function(){
					SD("stefanvdaaplaybutton").style.display = ""; SD("stefanvdaapreviousbutton").style.display = "none"; window.clearTimeout(countss);
				});
				newdivslideshow.appendChild(newdivslideshowpause);
			}
		}
	}else{
		var noimagesfound = chrome.i18n.getMessage("noimagesfound");
		alert(noimagesfound);
	}
});

// functions
function refreshambilight(){
	var totlshowtime = el.shadowRoot.querySelectorAll("img.stefanvdaagalleryimageshow");
	for(var i = 0; i < totlshowtime.length; i++){ totlshowtime = totlshowtime[i]; }
	var getblur = ambilightrangeblurradius + "px";
	var getspread = ambilightrangespreadradius + "px";

	if(ambilightvarcolor == true){
		if(atmosvivid == true){
			var calcvividscale = 1 + (ambilightrangespreadradius / 100);
			var calcblur = ambilightrangeblurradius;

			if(SD("stefanvdaavivideffect") == null){
				stefanvdaavivideffect = el.shadowRoot.createElement("canvas");
				stefanvdaavivideffect.setAttribute("id", "stefanvdaavivideffect");
				SD("stefanvdaagallery").appendChild(stefanvdaavivideffect);
			}

			if(SD("stefanvdaavivideffect")){
				stefanvdaavivideffect = SD("stefanvdaavivideffect");
				stefanvdaavivideffect.style.webkitTransform = "scale(" + calcvividscale + ")";
				stefanvdaavivideffect.style.webkitFilter = "blur(" + calcblur + "px)";
				stefanvdaavivideffect.setAttribute("width", totlshowtime.clientWidth);
				stefanvdaavivideffect.setAttribute("height", totlshowtime.clientHeight);
				stefanvdaavivideffect.style.opacity = .88;
				var vividctx = stefanvdaavivideffect.getContext("2d");
				vividctx.drawImage(totlshowtime, 0, 0, totlshowtime.clientWidth, totlshowtime.clientHeight);
			}
		}else{
			var sourceWidth = totlshowtime.width;
			var sourceHeight = totlshowtime.height;

			var totlcheckcanvas = SD("aaCanvas1");
			if(totlcheckcanvas == null){
				var totlnewcanvas = document.createElement("canvas");
				totlnewcanvas.setAttribute("id", "aaCanvas1");
				totlnewcanvas.width = "4";
				totlnewcanvas.height = "1";
				totlnewcanvas.style.display = "none";
				el.shadowRoot.appendChild(totlnewcanvas);
			}

			var canvas = SD("aaCanvas1");
			var context = canvas.getContext("2d");

			var colorlamp1X = (sourceWidth * 50) / 100; // up midden
			var colorlamp1Y = (sourceHeight * 95) / 100;
			var colorlamp2X = (sourceWidth * 95) / 100; // right midden
			var colorlamp2Y = (sourceHeight * 50) / 100;
			var colorlamp3X = (sourceWidth * 50) / 100; // down midden
			var colorlamp3Y = (sourceHeight * 5) / 100;
			var colorlamp4X = (sourceWidth * 5) / 100; // left midden
			var colorlamp4Y = (sourceHeight * 50) / 100;

			context.drawImage(totlshowtime, colorlamp1X, colorlamp1Y, 1, 1, 0, 0, 1, 1);
			context.drawImage(totlshowtime, colorlamp2X, colorlamp2Y, 1, 1, 1, 0, 1, 1);
			context.drawImage(totlshowtime, colorlamp3X, colorlamp3Y, 1, 1, 2, 0, 1, 1);
			context.drawImage(totlshowtime, colorlamp4X, colorlamp4Y, 1, 1, 3, 0, 1, 1);

			try{
				p1 = context.getImageData(0, 0, 1, 1).data;
				p2 = context.getImageData(1, 0, 1, 1).data;
				p3 = context.getImageData(2, 0, 1, 1).data;
				p4 = context.getImageData(3, 0, 1, 1).data;
				hex1 = "#" + ("000000" + rgbToHex(p1[0], p1[1], p1[2])).slice(-6);
				hex2 = "#" + ("000000" + rgbToHex(p2[0], p2[1], p2[2])).slice(-6);
				hex3 = "#" + ("000000" + rgbToHex(p3[0], p3[1], p3[2])).slice(-6);
				hex4 = "#" + ("000000" + rgbToHex(p4[0], p4[1], p4[2])).slice(-6);

				totlshowtime.style.boxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + hex3 + ", 0px 20px " + getblur + " " + getspread + " " + hex1 + ", 20px 0px " + getblur + " " + getspread + " " + hex2 + ", -20px 0px " + getblur + " " + getspread + " " + hex4 + "";
			}catch(e){
				totlshowtime.style.boxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + ambilightcolorhex + ", 0px 20px " + getblur + " " + getspread + " " + ambilightcolorhex + ", 20px 0px " + getblur + " " + getspread + " " + ambilightcolorhex + ", -20px 0px " + getblur + " " + getspread + " " + ambilightcolorhex + "";
			}
		}
	}else if(ambilightfixcolor == true){
		totlshowtime.style.boxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + ambilightcolorhex + ", 0px 20px " + getblur + " " + getspread + " " + ambilightcolorhex + ", 20px 0px " + getblur + " " + getspread + " " + ambilightcolorhex + ", -20px 0px " + getblur + " " + getspread + " " + ambilightcolorhex + "";
	}else if(ambilight4color == true){
		hex1 = ambilight1colorhex;
		hex2 = ambilight2colorhex;
		hex3 = ambilight3colorhex;
		hex4 = ambilight4colorhex;
		totlshowtime.style.boxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + hex3 + ", 0px 20px " + getblur + " " + getspread + " " + hex1 + ", 20px 0px " + getblur + " " + getspread + " " + hex2 + ", -20px 0px " + getblur + " " + getspread + " " + hex4 + "";
	}
}

// functions
function rgbToHex(r, g, b){
	if(r > 255 || g > 255 || b > 255)
		throw"Invalid color component";
	return((r << 16) | (g << 8) | b).toString(16);
}

function refreshcounter(){
	if(SD("stefanvdaagallerycounter")){ SD("stefanvdaagallerycounter").innerText = "" + jcurrent + "/" + kmax + ""; }
}

function resizeframe(){
	var newscreenheight = document.documentElement.clientHeight;
	var newscreenwidth = document.documentElement.clientWidth;
	if(SD("stefanvdaagalleryimage" + jcurrent + "")){
		sourceImageWidth = SD("stefanvdaagalleryimage" + jcurrent + "").width;
		sourceImageHeight = SD("stefanvdaagalleryimage" + jcurrent + "").height;
		SD("stefanvdaagallery").style.left = (newscreenwidth / 2) - (sourceImageWidth / 2) + "px";
		SD("stefanvdaagallery").style.top = (newscreenheight / 2) - (sourceImageHeight / 2) + "px";
	}
}

function slideshownext(){
	SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimagehide");
	if(jcurrent == kmax){ jcurrent = 1; }else{ jcurrent += 1; }
	SD("stefanvdaagalleryimage" + jcurrent + "").setAttribute("class", "stefanvdaagalleryimageshow");
	slideshowtimernext();
	resizeframe(); refreshambilight(); refreshcounter();
}
function slideshowtimernext(){ countss = setTimeout(slideshownext, slideshowrefresh * 1000); }

// --- cleanup service
function cleanup(){
	// DOM
	var stefanvdambientaurea = $("stefanvdambientaurea");
	if(stefanvdambientaurea){ document.body.removeChild(stefanvdambientaurea); }
	jcurrent = 0;
	window.clearTimeout(countss);
}
//---

function removenewframe(){
	// dark layer
	removeId("stefanvdaalightareoff1");
	// the complete gallery
	cleanup();
}

function removeId(idname){
	var elem = document.getElementById(idname);
	if(elem){ elem.parentNode.removeChild(elem); }
}

// /////////
// animation browser engine
window.requestAnimFrame = function(){
	return(
		window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(/* function */ callback){ window.setTimeout(callback, 1000 / 60); }
	);
}();

// Fade engine
// Variable for the fade in and out effect
var opacity = 0;
var ReducingFinished = true;
var OpacityLevelIncrement = 10; // Percentage value: 1-100
var DIVElementById = null;

// Function determines whether we show or hide the item referenced by ElementID
function fader(ActionToTake){
	DIVElementById = SD("stefanvdaalightareoff1");
	if(ActionToTake == "hide"){ opacity = default_opacity; reduceOpacity(); }else if(ActionToTake == "show"){ increaseOpacity(); }
}

function setallopacity(opacity){
	// Control opacity for all <div>
	var div = document.querySelectorAll("div.stefanvdaalightareoff"), i, l = div.length;
	for(i = 0; i < l; i++){ div[i].style.opacity = opacity / 100; }
}

// Makes div increase
function increaseOpacity(){
	// If opacity level is less than default_opacity, we can still increase the opacity
	if((opacity < default_opacity) && (ReducingFinished == true)){
		(opacity > (default_opacity - 10)) ? opacity += (default_opacity - opacity) : opacity += OpacityLevelIncrement;
		DIVElementById.style.opacity = opacity / 100;
		window.requestAnimFrame(increaseOpacity);
	}else{ ReducingFinished = false; }
	setallopacity(opacity);
}

// Makes div reduce
function reduceOpacity(){
	// If opacity level is greater than 0, we can still reduce the opacity
	if((opacity > 0) && (ReducingFinished == false)){
		opacity -= OpacityLevelIncrement;
		DIVElementById.style.opacity = opacity / 100;
		window.requestAnimFrame(reduceOpacity);
	}else{
		ReducingFinished = true;
		// When finished, make sure the DIVElementById is set to remove element
		if(DIVElementById.style.opacity <= 0){ removenewframe(); }
	}
	setallopacity(opacity);
}