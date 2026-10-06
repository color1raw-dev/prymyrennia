/* ---------- account menu ---------- */
function meIni(n){return String(n||"?").trim().split(/\s+/).map(function(w){return w.charAt(0)}).slice(0,2).join("").toUpperCase()||"?"}
function meRoleT(){var w=document.getElementById("who"),r=w?(w.textContent.split(" \u00b7 ")[1]||""):"";return r?r.charAt(0).toUpperCase()+r.slice(1):""}
function meAvH(c){var n=S.me&&S.me.name||"";return S.me&&S.me.avatarUrl?'<img class="'+c+'" src="'+esc(S.me.avatarUrl)+'" alt="">':'<span class="'+c+'">'+esc(meIni(n))+'</span>'}
function meSync(){var b=document.getElementById("meBtn"),m=document.getElementById("meBtnM");if(!b)return;var has=!!S.me;b.hidden=!has;if(m)m.hidden=!has;if(!has)return;
  var nm=S.me.name||"Без імені",ini=document.getElementById("meIn");document.getElementById("meName").textContent=nm;document.getElementById("meRole").textContent=meRoleT();
  ini.hidden=!!S.me.avatarUrl;ini.textContent=meIni(nm);
  if(m){var k=(S.me.avatarUrl||"")+"|"+nm;if(m.dataset.k!==k){m.dataset.k=k;m.innerHTML=S.me.avatarUrl?'<img src="'+esc(S.me.avatarUrl)+'" alt="">':esc(meIni(nm))}}}
function meClose(){var el=document.getElementById("meMenu");if(el)el.remove();var b=document.getElementById("meBtn");if(b)b.setAttribute("aria-expanded","false")}
function meItem(act,ic,label,id){return '<button type="button" role="menuitem"'+(id?' id="'+id+'"':' data-act="'+act+'"')+'><span class="si">'+ico(ic)+'</span><span class="grow">'+label+'</span>'+(id?"":'<span class="go">'+ico("arrow")+'</span>')+'</button>'}
function meMenu(src){if(document.getElementById("meMenu")){meClose();return}if(!S.me)return;
  var el=document.createElement("div"),nm=S.me.name||"Без імені",role=meRoleT(),nl=document.getElementById("navLog"),users=nl&&!nl.hidden;el.id="meMenu";el.setAttribute("role","menu");el.setAttribute("aria-label","Обліковий запис");
  el.innerHTML='<div class="mm-h g-ink"><div class="mm-top">'+meAvH("mm-av")+(role?'<span class="mm-r">'+esc(role)+'</span>':"")+'</div><div class="mm-t"><b>'+esc(nm)+'</b>'+(S.me.email?'<span>'+esc(S.me.email)+'</span>':"")+'</div></div>'+
    '<div class="mm-l">'+meItem("tourStart","help","Як користуватись")+meItem("meDash","sliders","Налаштувати огляд")+(users?meItem("meUsers","users",window.__SITE?"Користувачі й доступ":"Журнал і користувачі"):"")+'</div>'+
    (window.__SITE?'<div class="mm-l mm-out">'+meItem("","out","Вийти","siteOut")+'</div>':"");
  document.body.appendChild(el);var r=src.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight;
  if(src.id==="meBtnM"){var w=Math.min(320,vw-32);el.style.width=w+"px";el.style.top=(r.bottom+10)+"px";el.style.left=Math.max(16,Math.min(vw-16-w,r.right-w))+"px";el.style.transformOrigin="top right"}
  else{el.style.width=Math.max(r.width,292)+"px";el.style.left=r.left+"px";el.style.bottom=(vh-r.top+10)+"px";el.style.transformOrigin="bottom left";src.setAttribute("aria-expanded","true")}
  var f=el.querySelector(".mm-l button");if(f)f.focus({preventScroll:true})}
document.addEventListener("click",function(e){var m=document.getElementById("meMenu");if(!m)return;var t=e.target;if(t.closest("#meBtn,#meBtnM"))return;if(!m.contains(t)||t.closest("button"))setTimeout(meClose,0)});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&document.getElementById("meMenu")){meClose();var b=document.getElementById("meBtn");if(b&&b.offsetParent)b.focus()}});
window.addEventListener("resize",meClose);
(function(){var w=document.getElementById("who");if(w&&window.MutationObserver)new MutationObserver(meSync).observe(w,{childList:true,characterData:true,subtree:true});setInterval(meSync,1500);meSync()})();
