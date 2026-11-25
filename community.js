(() => {
  "use strict";
  const data = window.templeCommunity;
  if (!data) return;
  const id = s => document.getElementById(s);
  const make = (tag, text, cls, lang) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (cls) el.className = cls;
    if (lang) el.lang = lang;
    return el;
  };
  const button = (text, fn) => {
    const el = make("button", text, "community-button");
    el.type = "button";
    el.addEventListener("click", fn);
    return el;
  };
  const pacific = new Intl.DateTimeFormat("en-US", {timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",hourCycle:"h23"});
  const values = Object.fromEntries(pacific.formatToParts(new Date()).map(p=>[p.type,p.value]));
  const today = [values.year, values.month, values.day].join("-");
  const restoreFocus = new Map();
  const dialogs = [id("announcement-dialog"), id("album-dialog")];
  const show = (dialog, opener) => {
    if (dialog.open || dialogs.some(d=>d.open) || typeof dialog.showModal !== "function") return false;
    restoreFocus.set(dialog, opener || document.activeElement);
    dialog.showModal();
    return true;
  };
  dialogs.forEach(dialog => {
    dialog.querySelector("[data-close]").addEventListener("click",()=>dialog.close());
    dialog.addEventListener("click",e=>{if(e.target === dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close();}});
    dialog.addEventListener("close",()=>restoreFocus.get(dialog)?.focus?.());
  });

  const a = data.announcement;
  const announce = id("announcement-dialog");
  if (a && (!a.expires || today <= a.expires)) {
    const panels = [];
    let language = "ko";
    const selectLanguage = choice => {
      language = choice;
      for(const item of panels){
        item.img.src = choice==="ko" ? a.flyerKo : a.flyerEn;
        item.img.alt = choice==="ko" ? a.titleKo+" 행사 안내 포스터" : a.titleEn+" event flyer";
        item.img.lang = choice;
        item.link.href = item.img.getAttribute("src");
        item.ko.setAttribute("aria-pressed",String(choice==="ko"));
        item.en.setAttribute("aria-pressed",String(choice==="en"));
      }
    };
    const addFlyer = (host, onHome) => {
      const card = make("div",null,"community-feature flyer-feature");
      const copy = make("div",null,"flyer-copy");
      copy.append(make(onHome?"h3":"p",a.titleKo,"flyer-name"),make("p",a.titleEn,"flyer-en","en"),
        make("p",a.dateKo,"flyer-date"),make("p",a.dateEn,null,"en"),make("p",a.location),
        make("p",a.descriptionKo,"flyer-description"),make("p",a.descriptionEn,null,"en"));
      const controls=make("div",null,"flyer-controls");
      const ko=button("한국어",()=>selectLanguage("ko")),en=button("English",()=>selectLanguage("en"));en.lang="en";
      controls.append(ko,en);
      if(onHome) controls.append(button("크게 보기 / Enlarge",e=>show(announce,e.currentTarget)));
      copy.append(controls);
      const img=make("img",null,"flyer-image"); img.loading=onHome?"lazy":"eager";
      const link=make("a",null,"flyer-art-link");link.target="_blank";link.rel="noopener noreferrer";link.append(img);
      card.append(copy,link);host.append(card);panels.push({ko,en,img,link});
    };
    addFlyer(id("homepage-flyer"),true);addFlyer(id("dialog-flyer"),false);selectLanguage(language);
    if(a.autoOpen){
      const key="yeolaisah-announcement-"+a.id;
      let seen=false; try{seen=sessionStorage.getItem(key)==="1";}catch{}
      if(!seen && !location.hash) setTimeout(()=>{
        if(id("noticeModal")?.classList.contains("flex")) return;
        if(show(announce)){try{sessionStorage.setItem(key,"1");}catch{}}
      },600);
    }
  } else id("homepage-flyer").append(make("p","새로운 공지가 올라오면 이곳에서 확인하실 수 있습니다.","community-empty"),make("p","New announcements will appear here.","community-empty","en"));

  const day = s => Date.parse(s+"T00:00:00Z") / 86400000;
  const iso = n => new Date(n*86400000).toISOString().slice(0,10);
  const nextOccurrence = (event) => {
    const anchor=day(event.anchorDate), interval=Number(event.everyDays);
    if(!Number.isFinite(anchor)||!Number.isInteger(interval)||interval<1) return null;
    const now=day(today)+(Number(values.hour)>=21?1:0);
    let next=anchor+Math.max(0,Math.ceil((now-anchor)/interval))*interval;
    for(let i=0;i<366;i++,next+=interval){ const date=iso(next); if(!(event.skipDates??[]).includes(date))return date; }
    return null;
  };
  for(const event of data.recurring ?? []){
    const card=make("article",null,"community-feature recurring-card");
    card.append(make("h3",event.titleKo),make("p",event.titleEn,"flyer-en","en"),
      make("p",event.cadenceKo,"flyer-date"), make("p",event.cadenceEn,null,"en"), make("p",event.location));
    const next=nextOccurrence(event);
    if(next){
      const dt=new Date(next+"T12:00:00Z"), opts={timeZone:"America/Los_Angeles",year:"numeric",month:"long",day:"numeric",weekday:"long"};
      const upcoming=make("p",null,"recurring-next");
      upcoming.append(make("strong","다음 정기 일정 (방문 전 확인) / Next regular date (please confirm before visiting)"),make("span",new Intl.DateTimeFormat("ko-KR",opts).format(dt)),make("span",new Intl.DateTimeFormat("en-US",opts).format(dt),null,"en"));
      card.append(upcoming);
    }
    const schedule=make("details",null,"recurring-schedule");
    schedule.append(make("summary","모임 시간표 / Session schedule"));
    const list=make("ul");
    for(const [time,ko,en] of event.schedule??[]){
      const row=make("li",null,"schedule-line");row.append(make("strong",time,null,"en"),make("span",ko),make("span",en,null,"en")); list.append(row);
    }
    schedule.append(list);card.append(schedule,make("p",event.welcomeKo),make("p",event.welcomeEn,null,"en"));
    id("regular-list").append(card);
  }

  const albumDialog=id("album-dialog"), picture=id("album-image"),caption=id("album-caption"),play=id("play-photos");
  let album=null, index=0, interval=null, touchX=null;
  const stop = () => {
    clearInterval(interval); interval=null;
    play.textContent="재생 / Play";play.setAttribute("aria-pressed","false"); caption.setAttribute("aria-live","polite");
  };
  const paint = () => {
    const photo=album.photos[index];
    const description=[photo.ko,photo.en].filter(Boolean).join(" / ");
    picture.src=photo.src;picture.alt=description||album.titleEn||album.titleKo||"";
    caption.textContent=(index+1)+" / "+album.photos.length+(description?" · "+description:"");
  };
  const step = delta => {if(album){index=(index+delta+album.photos.length)%album.photos.length;paint();}};
  for(const a of data.albums??[]){
    if(!a.photos?.length)continue;
    const card=make("button",null,"community-album");card.type="button";
    const cover=make("img");cover.src=a.cover||a.photos[0].src;cover.alt="";cover.loading="lazy";
    const label=make("span",null,"community-album-label");
    label.append(make("strong",a.titleKo),make("span",a.titleEn,null,"en"), make("span",a.photos.length+"장 · 앨범 열기 / Open album","album-count"));
    card.append(cover,label);
    card.addEventListener("click",()=>{album=a;index=0;stop();id("album-title").textContent=a.titleKo+" | "+a.titleEn;paint();for(const node of [play,id("previous-photo"),id("next-photo")])node.disabled=a.photos.length<2;show(albumDialog,card);});
    id("album-list").append(card);
  }
  id("previous-photo").addEventListener("click",()=>{stop();step(-1);});
  id("next-photo").addEventListener("click",()=>{stop();step(1);});
  play.addEventListener("click",()=>{if(interval){stop();return;} play.textContent="일시정지 / Pause";play.setAttribute("aria-pressed","true");caption.setAttribute("aria-live","off");interval=setInterval(()=>step(1),3500);});
  albumDialog.addEventListener("close",stop);
  albumDialog.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();stop();step(e.key==="ArrowLeft"?-1:1);}});
  picture.addEventListener("touchstart",e=>{touchX=e.changedTouches[0].clientX;},{passive:true});
  picture.addEventListener("touchend",e=>{const dx=touchX===null?0:e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(dx)>55){stop();step(dx<0?1:-1);}},{passive:true});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();});
  id("copy-zelle").addEventListener("click",async()=>{
    const phone=id("donation-phone");
    try{await navigator.clipboard.writeText(phone.textContent.trim());id("copy-result").textContent="복사되었습니다 / Number copied";}
    catch{const range=document.createRange();range.selectNodeContents(phone);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);id("copy-result").textContent="선택한 번호를 복사해 주세요 / Copy the selected number";}
  });
})();
