"use strict";window.addEventListener("load",function(){localStorage.getItem("tt.bot::hasConsentedToCookies")||(()=>{const e=document.createElement("section");e.className="box is-marginless is-radiusless";const t=document.createElement("div");t.className="container";const n=document.createElement("div");n.className="level";const c=document.createElement("div");c.className="level-left";const o=document.createElement("div");o.className="level-item";const a=document.createElement("p");a.innerHTML='We make use of cookies in order to provide tt.bot\'s web panel. <a href="https://tttie.cz/privacy/tt.bot.html">Learn more</a>';const s=document.createElement("div");s.className="level-right";const m=document.createElement("div");m.className="level-item";const d=document.createElement("div");d.className="buttons";const l=document.createElement("button");l.className="button is-primary";const i=document.createElement("span");i.className="icon";const r=document.createElement("i");r.className="fas fa-check";const p=document.createElement("span");p.innerText="OK",l.addEventListener("click",()=>{localStorage.setItem("tt.bot::hasConsentedToCookies","true"),e.remove()});const u=document.createElement("button");u.className="button is-danger";const E=document.createElement("span");E.className="icon";const v=document.createElement("i");v.className="fas fa-times";const N=document.createElement("span");N.innerText="No",u.addEventListener("click",()=>{window.history.back()}),E.append(v),u.append(E,N),i.append(r),l.append(i,p),d.append(l,u),m.append(d),s.append(m),o.append(a),c.append(o),n.append(c,s),t.append(n),e.append(t),document.body.prepend(e)})();const e=document.querySelector("#yes"),t=document.querySelector("#no");e.addEventListener("click",function(){window.location="/acceptcookie"}),t.addEventListener("click",function(){window.location="https://google.com"})});