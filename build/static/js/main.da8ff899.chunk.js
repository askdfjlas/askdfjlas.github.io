(this.webpackJsonpwahtever=this.webpackJsonpwahtever||[]).push([[0],{10:function(e,t,n){e.exports=n(16)},16:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),s=n(7),c=n.n(s),o=n(1),u=n.n(o),i=n(2),h=n(3),l=n(4),p=n(5),f=n(9),m=n(8),v="https://2a0jyll2t9.execute-api.us-east-1.amazonaws.com/poc/messages",g=function(){function e(){Object(h.a)(this,e)}return Object(l.a)(e,null,[{key:"getMessages",value:function(){var e=Object(i.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(v);case 2:return t=e.sent,e.next=5,t.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"postMessage",value:function(){var e=Object(i.a)(u.a.mark((function e(t){var n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(v,"?message=").concat(t),{method:"POST"});case 2:return n=e.sent,e.next=5,n.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),d=function(e){Object(f.a)(n,e);var t=Object(m.a)(n);function n(){var e;return Object(h.a)(this,n),(e=t.call(this)).state={messages:[]},e.sendMessage=e.sendMessage.bind(Object(p.a)(e)),e}return Object(l.a)(n,[{key:"refresh",value:function(){var e=Object(i.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.getMessages();case 2:t=e.sent,this.setState({messages:t});case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"sendMessage",value:function(){var e=Object(i.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=prompt("Say something"),e.next=3,g.postMessage(t);case 3:this.refresh();case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var e=this;this.refresh(),setInterval((function(){e.refresh()}),4e3)}},{key:"render",value:function(){var e=[];return this.state.messages.forEach((function(t,n){var a=new Date(t.timestamp);e.push(r.a.createElement("p",{key:n},r.a.createElement("b",null,a.toString()," "),t.message))})),r.a.createElement("div",{className:"Message-list"},e,r.a.createElement("button",{onClick:this.sendMessage},"Send Message"))}}]),n}(a.Component);var w=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(d,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(w,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[10,1,2]]]);
//# sourceMappingURL=main.da8ff899.chunk.js.map