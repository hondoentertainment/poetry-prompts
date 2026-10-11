(function(){
  var D=window.PROMPTS, list=document.getElementById('list'), q=document.getElementById('q'),
      sec=document.getElementById('sec'), count=document.getElementById('count'),
      empty=document.getElementById('empty'), toast=document.getElementById('toast');
  D.sections.forEach(function(s){var o=document.createElement('option');o.value=s.name;o.textContent=s.n+' · '+s.name;sec.appendChild(o);});
  function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function hl(t,words){var h=esc(t);if(!words.length)return h;
    var re=new RegExp('('+words.map(function(w){return esc(w).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|')+')','gi');
    return h.replace(re,'<mark>$1</mark>');}
  function render(){
    var raw=q.value.trim(), s=sec.value, num=/^\d+$/.test(raw)?+raw:null;
    var words=num?[]:raw.toLowerCase().split(/\s+/).filter(Boolean);
    var hits=D.prompts.filter(function(p){
      if(s&&p.section!==s)return false;
      if(num!==null)return p.id===num;
      var t=(p.text+' '+p.section).toLowerCase();
      return words.every(function(w){return t.indexOf(w)>-1;});
    });
    var html='',cur=null;
    hits.forEach(function(p){
      if(p.section!==cur){
        if(cur!==null)html+='</ol></section>';
        cur=p.section;var m=D.sections.filter(function(x){return x.name===cur;})[0];
        html+='<section><h2>'+esc(cur)+'<small>'+m.n+'</small></h2><p class="blurb">'+esc(m.blurb)+'</p><ol>';
      }
      html+='<li id="p'+p.id+'" data-id="'+p.id+'"'+(p.id>1000?' class="new"':'')+'><span class="n">'+p.id+'</span><span class="t">'+hl(p.text,words)+'</span></li>';
    });
    if(cur!==null)html+='</ol></section>';
    list.innerHTML=html; empty.hidden=hits.length>0;
    count.textContent=(hits.length===D.prompts.length?'All ':'')+hits.length+' of '+D.prompts.length+' prompts';
    var u=new URLSearchParams();if(raw)u.set('q',raw);if(s)u.set('s',s);
    history.replaceState(null,'',(u.toString()?'?'+u:location.pathname)+location.hash);
  }
  var t;q.addEventListener('input',function(){clearTimeout(t);t=setTimeout(render,80);});
  sec.addEventListener('change',render);
  function show(msg){toast.textContent=msg;toast.hidden=false;clearTimeout(show.t);show.t=setTimeout(function(){toast.hidden=true;},1400);}
  list.addEventListener('click',function(e){
    var li=e.target.closest('li');if(!li)return;
    var p=D.prompts[li.dataset.id-1], txt=p.id+'. '+p.text;
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(txt).then(function(){show('Copied #'+p.id);},function(){show('#'+p.id);});}
    else{var ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');show('Copied #'+p.id);}catch(_){}ta.remove();}
  });
  document.getElementById('rand').addEventListener('click',function(){
    var lis=list.querySelectorAll('li');if(!lis.length)return;
    var old=list.querySelector('li.pick');if(old)old.classList.remove('pick');
    var li=lis[Math.floor(Math.random()*lis.length)];li.classList.add('pick');
    li.scrollIntoView({behavior:'smooth',block:'center'});
  });
  document.getElementById('totop').addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});
  var u=new URLSearchParams(location.search);if(u.get('q'))q.value=u.get('q');if(u.get('s'))sec.value=u.get('s');
  render();
  if(location.hash){var el=document.querySelector(location.hash);if(el){el.classList.add('pick');el.scrollIntoView({block:'center'});}}
})();
