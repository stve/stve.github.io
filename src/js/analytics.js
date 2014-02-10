var protocol, s;

window._gaq = [];
window._gaq.push(["_setAccount", "UA-6073342-1"]);
window._gaq.push(["_trackPageview"]);
window._gaq.push(["_trackPageLoadTime"]);

s = document.createElement("script");
s.type = "text/javascript";
s.async = true;
protocol = document.location.protocol === 'https:' ? 'https://ssl' : 'http://www';
s.src = protocol + ".google-analytics.com/ga.js";

document.getElementsByTagName("head")[0].appendChild(s);
