!function(){return function e(t,r,n){function o(s,i){if(!r[s]){if(!t[s]){var l="function"==typeof require&&require;if(!i&&l)return l(s,!0);if(a)return a(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var d=r[s]={exports:{}};t[s][0].call(d.exports,function(e){return o(t[s][1][e]||e)},d,d.exports,e,t,r,n)}return r[s].exports}for(var a="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}}()({1:[function(e,t,r){"use strict";var n=e("./ssa.js");t.exports={name:"ass",helper:n.helper,detect:n.detect,parse:n.parse,build:n.build}},{"./ssa.js":7}],2:[function(e,t,r){"use strict";t.exports={name:"json",detect:function(e){if("string"==typeof e&&/^\[[\s\r\n]*\{[\s\S]*\}[\s\r\n]*\]$/g.test(e))return"json"},parse:function(e,t){return JSON.parse(e)},build:function(e,t){return JSON.stringify(e," ",2)}}},{}],3:[function(e,t,r){"use strict";var n={toMilliseconds:function(e){var t=/^\s*(\d+):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(e);return 60*parseInt(t[1])*1e3+1e3*parseInt(t[2])+10*(t[4]?parseInt(t[4]):0)},toTimeString:function(e){var t=Math.floor(e/1e3/60),r=Math.floor(e/1e3%60),n=Math.floor(e%1e3);return(t<10?"0":"")+t+":"+(r<10?"0":"")+r+"."+(n<100?"0":"")+(n<10?"0":Math.floor(n/10))}};t.exports={name:"lrc",helper:n,detect:function(e){if("string"==typeof e&&/\r?\n\[(\d+:\d{1,2}([.,]\d{1,3})?)\](.*)\r?\n/.test(e))return!0},parse:function(e,t){for(var r=null,o=[],a=(t.eol,e.split(/\r?\n/)),s=0;s<a.length;s++)if(a[s]&&0!=a[s].trim().length){var i=/^\[(\d{1,2}:\d{1,2}([.,]\d{1,3})?)\](.*)(\r?\n)*$/gi.exec(a[s]);if(i)(l={type:"caption"}).start=n.toMilliseconds(i[1]),l.end=l.start+2e3,l.duration=l.end-l.start,l.content=i[3],l.text=l.content,o.push(l),r&&(r.end=l.start,r.duration=r.end-r.start),r=l;else{var l,c=/^\[([\w\d]+):([^\]]*)\](\r?\n)*$/gi.exec(a[s]);c?((l={type:"meta"}).tag=c[1],c[2]&&(l.data=c[2]),o.push(l)):t.verbose&&console.log("WARN: Unknown part",a[s])}}return o},build:function(e,t){for(var r="",o=!1,a=t.eol||"\r\n",s=0;s<e.length;s++){var i=e[s];"meta"!=i.type?void 0!==i.type&&"caption"!=i.type?t.verbose&&console.log("SKIP:",i):(o||(r+=a,o=!0),r+="["+n.toTimeString(i.start)+"]"+i.text+a):i.tag&&i.data&&(r+="["+i.tag+":"+i.data.replace(/[\r\n]+/g," ")+"]"+a)}return r}}},{}],4:[function(e,t,r){"use strict";var n={toMilliseconds:function(e){var t=/^\s*(\d{1,2}):(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(e);return 3600*parseInt(t[1])*1e3+60*parseInt(t[2])*1e3+1e3*parseInt(t[3])+(t[5]?parseInt(t[5]):0)},toTimeString:function(e){var t=Math.floor(e/1e3/3600),r=Math.floor(e/1e3/60%60),n=Math.floor(e/1e3%60),o=Math.floor(e%1e3);return(t<10?"0":"")+t+":"+(r<10?"0":"")+r+":"+(n<10?"0":"")+n+"."+(o<100?"0":"")+(o<10?"0":"")+o}};t.exports={name:"sbv",helper:n,detect:function(e){if("string"!=typeof e)throw new Error("Expected string content!");if(/\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?\s*[,;]\s*\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?/g.test(e))return"sbv"},parse:function(e,t){for(var r=[],o=t.eol||"\r\n",a=e.split(/\r?\n\s+\r?\n/),s=0;s<a.length;s++){var i=/^(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\s*[,;]\s*(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\r?\n([\s\S]*)(\r?\n)*$/gi.exec(a[s]);if(i){var l={type:"caption"};l.start=n.toMilliseconds(i[1]),l.end=n.toMilliseconds(i[3]),l.duration=l.end-l.start;var c=i[5].split(/\[br\]|\r?\n/gi);l.content=c.join(o),l.text=l.content.replace(/\>\>\s*[^:]+:\s*/g,""),r.push(l)}else t.verbose&&console.log("WARN: Unknown part",a[s])}return r},build:function(e,t){for(var r="",o=t.eol||"\r\n",a=0;a<e.length;a++){var s=e[a];void 0!==s.type&&"caption"!=s.type?t.verbose&&console.log("SKIP:",s):(r+=n.toTimeString(s.start)+","+n.toTimeString(s.end)+o,r+=s.text+o,r+=o)}return r}}},{}],5:[function(e,t,r){"use strict";var n={htmlEncode:function(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/\</g,"&lt;").replace(/\>/g,"&gt;").replace(/\r?\n/g,"<BR>")},htmlDecode:function(e,t){return e.replace(/\<BR\s*\/?\>/gi,t||"\r\n").replace(/&nbsp;/g," ").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")}};t.exports={name:"smi",helper:n,detect:function(e){if("string"==typeof e&&/\<SAMI[^\>]*\>[\s\S]*\<BODY[^\>]*\>/g.test(e))return"smi"},parse:function(e,t){var r=[],o=t.eol||"\r\n",a=/\<TITLE[^\>]*\>([\s\S]*)\<\/TITLE\>/gi.exec(e);a&&((p={type:"meta",name:"title"}).data=a[1].replace(/^[\s\r\n]*/g,"").replace(/[\s\r\n]*$/g,""),r.push(p));var s=/\<STYLE[^\>]*\>([\s\S]*)\<\/STYLE\>/gi.exec(e);s&&((p={type:"meta",name:"style"}).data=s[1],r.push(p));for(var i=null,l=e.replace(/^[\s\S]*\<BODY[^\>]*\>/gi,"").replace(/\<\/BODY[^\>]*\>[\s\S]*$/gi,"").split(/\<SYNC/gi),c=0;c<l.length;c++)if(l[c]&&0!=l[c].trim().length){var d="<SYNC"+l[c],f=/^\<SYNC[^\>]+Start\s*=\s*["']?(\d+)["']?[^\>]*\>([\s\S]*)/gi.exec(d);if(f){var p;(p={type:"caption"}).start=parseInt(f[1]),p.end=p.start+2e3,p.duration=p.end-p.start,p.content=f[2].replace(/^\<\/SYNC[^\>]*>/gi,"");var u=!0,g=/^\<P[^\>]+Class\s*=\s*["']?([\w\d\-_]+)["']?[^\>]*\>([\s\S]*)/gi.exec(p.content);if(g||(g=/^\<P([^\>]*)\>([\s\S]*)/gi.exec(p.content)),g){var m=g[2].replace(/\<P[\s\S]+$/gi,"");u=0==(m=(m=m.replace(/\<BR\s*\/?\>/gi,o).replace(/\<[^\>]+\>/g,"")).replace(/^[\s\r\n]+/g,"").replace(/[\s\r\n]+$/g,"")).replace(/&nbsp;/gi," ").replace(/[\s\r\n]+/g,"").length,p.text=n.htmlDecode(m,o)}!t.preserveSpaces&&u?t.verbose&&console.log("INFO: Skipping white space caption at "+p.start):r.push(p),i&&(i.end=p.start,i.duration=i.end-i.start),i=p}else t.verbose&&console.log("WARN: Unknown part",l[c])}return r},build:function(e,t){var r=t.eol||"\r\n",o="";o+="<SAMI>"+r,o+="<HEAD>"+r,o+="<TITLE>"+(t.title||"")+"</TITLE>"+r,o+='<STYLE TYPE="text/css">'+r,o+="\x3c!--"+r,o+="P { font-family: Arial; font-weight: normal; color: white; background-color: black; text-align: center; }"+r,o+=".LANG { Name: "+(t.langName||"English")+"; lang: "+(t.langCode||"en-US")+"; SAMIType: CC; }"+r,o+="--\x3e"+r,o+="</STYLE>"+r,o+="</HEAD>"+r,o+="<BODY>"+r;for(var a=0;a<e.length;a++){var s=e[a];"meta"!=s.type&&(void 0!==s.type&&"caption"!=s.type?t.verbose&&console.log("SKIP:",s):(o+="<SYNC Start="+s.start+">"+r,o+="  <P Class=LANG>"+n.htmlEncode(s.text||"")+(t.closeTags?"</P>":"")+r,t.closeTags&&(o+="</SYNC>"+r),o+="<SYNC Start="+s.end+">"+r,o+="  <P Class=LANG>&nbsp;"+(t.closeTags?"</P>":"")+r,t.closeTags&&(o+="</SYNC>"+r)))}return o+="</BODY>"+r,o+="</SAMI>"+r}}},{}],6:[function(e,t,r){"use strict";var n="srt",o={toMilliseconds:function(e){var t=/^\s*(\d{1,2}):(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(e);return 3600*parseInt(t[1])*1e3+60*parseInt(t[2])*1e3+1e3*parseInt(t[3])+(t[5]?parseInt(t[5]):0)},toTimeString:function(e){var t=Math.floor(e/1e3/3600),r=Math.floor(e/1e3/60%60),n=Math.floor(e/1e3%60),o=Math.floor(e%1e3);return(t<10?"0":"")+t+":"+(r<10?"0":"")+r+":"+(n<10?"0":"")+n+","+(o<100?"0":"")+(o<10?"0":"")+o}};t.exports={name:n,helper:o,detect:function(e){if("string"==typeof e&&/\d+\r?\n\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?\s*\-\-\>\s*\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?/g.test(e))return n},parse:function(e,t){for(var r=[],n=t.eol||"\r\n",a=e.split(/\r?\n\s+\r?\n/g),s=0;s<a.length;s++){var i=/^(\d+)\r?\n(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\s*\-\-\>\s*(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\r?\n([\s\S]*)(\r?\n)*$/gi.exec(a[s]);if(i){var l={type:"caption"};l.index=parseInt(i[1]),l.start=o.toMilliseconds(i[2]),l.end=o.toMilliseconds(i[4]),l.duration=l.end-l.start;var c=i[6].split(/\r?\n/);l.content=c.join(n),l.text=l.content.replace(/\<[^\>]+\>/g,"").replace(/\{[^\}]+\}/g,"").replace(/\>\>\s*[^:]*:\s*/g,""),r.push(l)}else t.verbose&&console.log("WARN: Unknown part",a[s])}return r},build:function(e,t){for(var r="",n=t.eol||"\r\n",a=0;a<e.length;a++){var s=e[a];void 0!==s.type&&"caption"!=s.type?t.verbose&&console.log("SKIP:",s):(r+=(a+1).toString()+n,r+=o.toTimeString(s.start)+" --\x3e "+o.toTimeString(s.end)+n,r+=s.text+n,r+=n)}return r}}},{}],7:[function(e,t,r){"use strict";var n={toMilliseconds:function(e){var t=/^\s*(\d+:)?(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(e);return 3600*(t[1]?parseInt(t[1].replace(":","")):0)*1e3+60*parseInt(t[2])*1e3+1e3*parseInt(t[3])+10*(t[5]?parseInt(t[5]):0)},toTimeString:function(e){var t=Math.floor(e/1e3/3600),r=Math.floor(e/1e3/60%60),n=Math.floor(e/1e3%60),o=Math.floor(e%1e3/10);return t+":"+(r<10?"0":"")+r+":"+(n<10?"0":"")+n+"."+(o<10?"0":"")+o}};t.exports={name:"ssa",helper:n,detect:function(e){if("string"!=typeof e)throw new Error("Expected string content!");if(/^[\s\r\n]*\[Script Info\]\r?\n/g.test(e)&&/[\s\r\n]*\[Events\]\r?\n/g.test(e))return e.indexOf("[V4+ Styles]")>0?"ass":"ssa"},parse:function(e,t){for(var r,o,a,s,i=null,l=[],c=t.eol||"\r\n",d=e.split(/\r?\n\s*\r?\n/),f=0;f<d.length;f++){var p=/^\s*\[([^\]]+)\]\r?\n([\s\S]*)(\r?\n)*$/gi.exec(d[f]);if(p)for(var u=p[1],g=p[2].split(/\r?\n/),m=0;m<g.length;m++){var v=g[m];if(!/^\s*;/.test(v)){var h=/^\s*([^:]+):\s*(.*)(\r?\n)?$/.exec(v);if(h){if("Script Info"==u){r||((r={}).type="meta",r.data={},l.push(r));var S=h[1].trim(),y=h[2].trim();r.data[S]=y;continue}if("V4 Styles"==u||"V4+ Styles"==u){if(S=h[1].trim(),y=h[2].trim(),"Format"==S){i=y.split(/\s*,\s*/g);continue}if("Style"==S){for(var b=y.split(/\s*,\s*/g),x={type:"style",data:{}},T=0;T<i.length&&T<b.length;T++)x.data[i[T]]=b[T];l.push(x);continue}}if("Events"==u){if(S=h[1].trim(),y=h[2].trim(),"Format"==S){i=y.split(/\s*,\s*/g);continue}if("Dialogue"==S){for(b=y.split(/\s*,\s*/g),x={type:"caption",data:{}},T=0;T<i.length&&T<b.length;T++)x.data[i[T]]=b[T];x.start=n.toMilliseconds(x.data.Start),x.end=n.toMilliseconds(x.data.End),x.duration=x.end-x.start,x.content=x.data.Text;var w=(o=y,a=",",s=i.length-1,o.split(a,s).join(a).length+1);x.content=y.substr(w),x.data.Text=x.content,x.text=x.content.replace(/\\N/g,c).replace(/\{[^\}]+\}/g,""),l.push(x);continue}}}}}t.verbose&&console.log("WARN: Unknown part",d[f])}return l},build:function(e,t){for(var r=t.eol||"\r\n",o="ass"==t.format,a="",s=0;s<e.length;s++){var i=e[s];if("meta"!=i.type)if("style"!=i.type)a.includes("[Events]")||(a+=`${r}[Events]${r}Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text${r}`),void 0!==i.type&&"caption"!=i.type?t.verbose&&console.log("SKIP:",i):a+="Dialogue: "+(o?"0":"Marked=0")+","+n.toTimeString(i.start)+","+n.toTimeString(i.end)+`,${i.data.Style},${i.data.Name},0000,0000,0000,,`+i.text.replace(/\r?\n/g,"\\N")+r;else{var l=Object.entries(i.data),c="Style: ";l.forEach((e,t)=>{t+1!==l.length?c+=`${e[1]},`:c+=`${e[1]}`}),a+=`${c}${r}`}else a+=`[Script Info]${r}`,(l=Object.entries(i.data)).forEach(e=>{a+=`${e[0]}: ${e[1]}${r}`}),a+=`${r}[V4+ Styles]${r}Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding${r}`}return a}}},{}],8:[function(e,t,r){"use strict";var n="sub",o=25;t.exports={name:n,detect:function(e){if("string"==typeof e&&/^\{\d+\}\{\d+\}(.*)/.test(e))return n},parse:function(e,t){for(var r=t.fps>0?t.fps:o,n=[],a=t.eol||"\r\n",s=e.split(/\r?\n/g),i=0;i<s.length;i++){var l=/^\{(\d+)\}\{(\d+)\}(.*)$/gi.exec(s[i]);if(l){var c={type:"caption"};c.index=i+1,c.frame={start:parseInt(l[1]),end:parseInt(l[2])},c.frame.count=c.frame.end-c.frame.start,c.start=Math.round(c.frame.start/r),c.end=Math.round(c.frame.end/r),c.duration=c.end-c.start;var d=l[3].split(/\|/g);c.content=d.join(a),c.text=c.content.replace(/\{[^\}]+\}/g,""),n.push(c)}else t.verbose&&console.log("WARN: Unknown part",s[i])}return n},build:function(e,t){for(var r=t.fps>0?t.fps:o,n="",a=t.eol||"\r\n",s=0;s<e.length;s++){var i=e[s];void 0!==i.type&&"caption"!=i.type?t.verbose&&console.log("SKIP:",i):n+="{"+("object"==typeof i.frame&&i.frame.start>=0?i.frame.start:i.start*r)+"}{"+("object"==typeof i.frame&&i.frame.end>=0?i.frame.end:i.end*r)+"}"+i.text.replace(/\r?\n/,"|")+a}return n}}},{}],9:[function(e,t,r){"use strict";var n={toMilliseconds:function(e){var t=/^\s*(\d{1,2}:)?(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(e);return 3600*(t[1]?parseInt(t[1].replace(":","")):0)*1e3+60*parseInt(t[2])*1e3+1e3*parseInt(t[3])+(t[5]?parseInt(t[5]):0)},toTimeString:function(e){var t=Math.floor(e/1e3/3600),r=Math.floor(e/1e3/60%60),n=Math.floor(e/1e3%60),o=Math.floor(e%1e3);return(t<10?"0":"")+t+":"+(r<10?"0":"")+r+":"+(n<10?"0":"")+n+","+(o<100?"0":"")+(o<10?"0":"")+o}};t.exports={name:"vtt",helper:n,detect:function(e){if("string"!=typeof e)throw new Error("Expected string content!");if(/^[\s\r\n]*WEBVTT\r?\n/g.test(e))return"vtt"},parse:function(e,t){for(var r=1,o=[],a=t.eol||"\r\n",s=e.split(/\r?\n\s+\r?\n/),i=0;i<s.length;i++){var l=/^([^\r\n]+\r?\n)?((\d{1,2}:)?\d{1,2}:\d{1,2}([.,]\d{1,3})?)\s*\-\-\>\s*((\d{1,2}:)?\d{1,2}:\d{1,2}([.,]\d{1,3})?)\r?\n([\s\S]*)(\r?\n)*$/gi.exec(s[i]);if(l){(d={type:"caption"}).index=r++,l[1]&&(d.cue=l[1].replace(/[\r\n]*/gi,"")),d.start=n.toMilliseconds(l[2]),d.end=n.toMilliseconds(l[5]),d.duration=d.end-d.start;var c=l[8].split(/\r?\n/);d.content=c.join(a),d.text=d.content.replace(/\<[^\>]+\>/g,"").replace(/\{[^\}]+\}/g,""),o.push(d)}else{var d,f=/^([A-Z]+)(\r?\n([\s\S]*))?$/.exec(s[i]);f||(f=/^([A-Z]+)\s+([^\r\n]*)?$/.exec(s[i])),f?((d={type:"meta"}).name=f[1],f[3]&&(d.data=f[3]),o.push(d)):t.verbose&&console.log("WARN: Unknown part",s[i])}}return o},build:function(e,t){for(var r=t.eol||"\r\n",o="WEBVTT"+r+r,a=0;a<e.length;a++){var s=e[a];if("meta"!=s.type)void 0!==s.type&&"caption"!=s.type?t.verbose&&console.log("SKIP:",s):(o+=(a+1).toString()+r,o+=n.toTimeString(s.start)+" --\x3e "+n.toTimeString(s.end)+r,o+=s.text+r,o+=r);else{if("WEBVTT"==s.name)continue;o+=s.name+r,o+=s.data?s.data+r:"",o+=r}}return o}}},{}],10:[function(e,t,r){"use strict";var n={format:{vtt:e("./format/vtt.js"),lrc:e("./format/lrc.js"),smi:e("./format/smi.js"),ssa:e("./format/ssa.js"),ass:e("./format/ass.js"),sub:e("./format/sub.js"),srt:e("./format/srt.js"),sbv:e("./format/sbv.js"),json:e("./format/json.js")}};function o(e){return JSON.parse(JSON.stringify(e))}n.list=function(){return Object.keys(n.format)},n.detect=function(e){for(var t=n.list(),r=0;r<t.length;r++){var o=t[r],a=n.format[o];if(void 0!==a&&"function"==typeof a.detect){var s=a.detect(e);if(!0===s)return o;if(o==s)return s}}},n.parse=function(e,t){var r=(t=t||{}).format||n.detect(e);if(!r||0==r.trim().length)throw new Error("Cannot determine subtitle format!");var o=n.format[r];if(void 0===o)throw new Error("Unsupported subtitle format: "+r);var a=o.parse;if("function"!=typeof a)throw new Error("Subtitle format does not support 'parse' op: "+r);return a(e,t)},n.build=function(e,t){var r=(t=t||{}).format||"srt";if(!r||0==r.trim().length)throw new Error("Cannot determine subtitle format!");var o=n.format[r];if(void 0===o)throw new Error("Unsupported subtitle format: "+r);var a=o.build;if("function"!=typeof a)throw new Error("Subtitle format does not support 'build' op: "+r);return a(e,t)},n.convert=function(e,t){"string"==typeof t&&(t={to:t});var r=o(t=t||{});delete r.format,r.from&&(r.format=r.from);var a=n.parse(e,r);return r.resync&&(a=n.resync(a,r.resync)),r.format=r.to||t.format,n.build(a,r)},n.resync=function(e,t){var r,n,a,s;if("function"==typeof(t=t||{}))r=t;else if("number"==typeof t)s=t,r=function(e){return[e[0]+s,e[1]+s]};else{if("object"!=typeof t)throw new Error("Argument 'options' not defined!");s=(t.offset||0)*(t.frame?t.fps||25:1),n=t.ratio||1,a=t.frame,r=function(e){return[Math.round(e[0]*n+s),Math.round(e[1]*n+s)]}}for(var i=[],l=0;l<e.length;l++){var c,d=o(e[l]);if(void 0===d.type||"caption"==d.type)if(a)(c=r([d.frame.start,d.frame.end]))&&2==c.length&&(d.frame.start=c[0],d.frame.end=c[1],d.frame.count=d.frame.end-d.frame.start);else(c=r([d.start,d.end]))&&2==c.length&&(d.start=c[0],d.end=c[1],d.duration=d.end-d.start);i.push(d)}return i},document.addEventListener("DOMContentLoaded",function(){function e(e,t,r){var n=new Blob([e],{type:r});if(window.navigator.msSaveOrOpenBlob)window.navigator.msSaveOrOpenBlob(n,t);else{var o=document.createElement("a"),a=URL.createObjectURL(n);o.href=a,o.download=t,document.body.appendChild(o),o.click(),setTimeout(function(){document.body.removeChild(o),window.URL.revokeObjectURL(a)},0)}}"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").then(function(e){console.log("ServiceWorker registration successful with scope: ",e.scope)},function(e){console.log("ServiceWorker registration failed: ",e)})});const t=async e=>{const t=n.convert(e,{format:"json",fps:25}),r=JSON.parse(t).map(e=>"caption"===e.type?e.content:e);document.querySelector(".dropzone-text").classList.add("disable");const o=r.map(async(e,t)=>{if(!(e instanceof Object))try{const n=new FormData;n.append("localization","be"),n.append("text",`${e}`),n.append("romanizationType","geographicRomanization");const o=await fetch("https://corpus.by/Romanizator/api.php",{method:"POST",body:n}),a=await o.json();return localStorage.setItem("loading",JSON.stringify({done:t+1,total:r.length})),a.result}catch(e){console.log(e)}});return Promise.all(o).then(e=>{const r=e,o=JSON.parse(t).map((e,t)=>r[t]&&"caption"===e.type?{...e,data:{...e.data,Text:r[t]},text:r[t],content:r[t]}:e);return n.build(o,{format:"ass"})})},r=document.querySelector("#file");document.querySelector("#drop-down").addEventListener("drop",async function(r){if(r.preventDefault(),r.dataTransfer.items){for(var n=0;n<r.dataTransfer.items.length;n++)if("file"===r.dataTransfer.items[n].kind){var o=r.dataTransfer.items[n].getAsFile();setInterval(function(){var e=localStorage.getItem("loading"),t=document.querySelector("#progress"),r=JSON.parse(e);return r&&r.done===r.total?(t.classList.add("finished"),t.innerHTML="завершана",void localStorage.removeItem("loading")):r&&r.done?(t.classList.remove("finished"),void(t.innerHTML=`${r.done+1}/${r.total}`)):void 0},10),document.querySelector("#file-name").innerHTML=o.name,document.querySelector("#file-info").classList.add("active");var a=new FileReader;a.onload=async function(r){try{e(await t(r.target.result),`[anibel latin] ${o.name}`)}catch(e){console.log("Huston we have problem...:",e)}},a.readAsText(o)}}else for(n=0;n<r.dataTransfer.files.length;n++)console.log("2... file["+n+"].name = "+r.dataTransfer.files[n].name)}),r.addEventListener("change",async()=>{setInterval(function(){var e=localStorage.getItem("loading"),t=document.querySelector("#progress"),r=JSON.parse(e);return r&&r.done===r.total?(t.classList.add("finished"),t.innerHTML="завершана",void localStorage.removeItem("loading")):r&&r.done?(t.classList.remove("finished"),void(t.innerHTML=`${r.done+1}/${r.total}`)):void 0},10);const r=document.querySelector("#file").files[0];document.querySelector("#file-name").innerHTML=r.name,document.querySelector("#file-info").classList.add("active");var n=new FileReader;n.onload=async function(n){try{e(await t(n.target.result),`[anibel latin] ${r.name}`)}catch(e){console.log("Huston we have problem...:",e)}},n.readAsText(r)})})},{"./format/ass.js":1,"./format/json.js":2,"./format/lrc.js":3,"./format/sbv.js":4,"./format/smi.js":5,"./format/srt.js":6,"./format/ssa.js":7,"./format/sub.js":8,"./format/vtt.js":9}]},{},[10]);