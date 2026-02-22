import {store, saveResult, setHomework, getHomeworkFor, defaultEmbeds} from "./data.js";

export function qs(sel){return document.querySelector(sel);}
export function qsa(sel){return [...document.querySelectorAll(sel)];}
export function params(){return Object.fromEntries(new URLSearchParams(location.search).entries());}

export function formatDate(d=new Date()){
  const yyyy=d.getFullYear();
  const mm=String(d.getMonth()+1).padStart(2,"0");
  const dd=String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

export function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

export function renderStars(count){
  return `<div class="starbar">${"★".repeat(count).split("").map(()=>`<span class="star">⭐</span>`).join("")}</div>`;
}

export function confettiBurst(){
  const wrap = document.createElement("div");
  wrap.className = "confetti";
  const colors = ["#7c3aed","#22c55e","#fb923c","#38bdf8","#facc15","#ec4899"];
  for(let i=0;i<32;i++){
    const piece = document.createElement("i");
    piece.style.left = `${Math.random()*100}%`;
    piece.style.top = `${-10 - Math.random()*30}vh`;
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    piece.style.animationDelay = `${Math.random()*0.25}s`;
    wrap.appendChild(piece);
  }
  document.body.appendChild(wrap);
  setTimeout(()=>wrap.remove(), 1600);
}

export function renderEmbedSmart(url){
  const box = qs("#embedBox");
  if(!box) return;

  if(!url){
    box.innerHTML = `<div class="notice">Бұл тақырыпқа интерактив ресурс әлі қосылмаған. Мұғалім teacher.html арқылы iframe-сілтемені қояды.</div>`;
    return;
  }

  // Кейбір сайттар iframe-ты блоктауы мүмкін → fallback link
  box.innerHTML = `
    <div class="embed">
      <iframe src="${url}" title="Interactive resource" loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="fullscreen"
        allowfullscreen></iframe>
    </div>
    <div class="badges">
      <span class="badge">🧩 Интерактив ресурс</span>
      <a class="badge" target="_blank" rel="noreferrer" href="${url}">↗️ Жаңа бетте ашу</a>
    </div>
  `;
}

// ====== тапсырма генераторы (қарапайым, кеңейте бересің) ======
function genTask(topicId, level){
  // теңдеу
  if(topicId.includes("eq")){
    if(level==="L1"){
      const a=rand(3,9), b=rand(1,9);
      return {q:`x + ${b} = ${a+b}. x = ?`, a:String(a)};
    }
    if(level==="L2"){
      const a=rand(10,30), b=rand(5,15);
      return {q:`${a} - x = ${a-b}. x = ?`, a:String(b)};
    }
    const a=rand(6,12), b=rand(2,9);
    return {q:`${b}x = ${b*a}. x = ?`, a:String(a)};
  }

  // бөлшек
  if(topicId.includes("frac")){
    if(level==="L1"){
      const d=rand(2,6);
      return {q:`Бөлшекті жаз: 1/${d}`, a:`1/${d}`};
    }
    if(level==="L2"){
      return {q:`Қайсысы үлкен: 1/3 әлде 1/4? (жаз: 1/3 немесе 1/4)`, a:`1/3`};
    }
    return {q:`1/2 мен 3/6 тең бе? (ИӘ/ЖОҚ)`, a:`ИӘ`};
  }

  // амал тәртібі
  if(topicId.includes("order")){
    if(level==="L1"){
      return {q:`2 + 3 × 2 = ?`, a:`8`};
    }
    if(level==="L2"){
      return {q:`(12 - 4) ÷ 2 = ?`, a:`4`};
    }
    return {q:`18 ÷ 3 + 4 × 2 = ?`, a:`14`};
  }

  // жылдамдық-уақыт-қашықтық
  if(topicId.includes("sdt")){
    if(level==="L1"){
      const v=rand(3,8), t=rand(2,6);
      return {q:`Жылдамдық ${v} км/сағ, уақыт ${t} сағ. Қашықтық = ? км`, a:String(v*t)};
    }
    if(level==="L2"){
      const s=rand(20,60), t=rand(2,6);
      return {q:`Қашықтық ${s} км, уақыт ${t} сағ. Жылдамдық = ? км/сағ`, a:String(Math.floor(s/t))};
    }
    const s=rand(30,96), v=rand(6,12);
    return {q:`Қашықтық ${s} км, жылдамдық ${v} км/сағ. Уақыт = ? сағ (жақын бүтін)`, a:String(Math.round(s/v))};
  }

  // деректер (кесте/диаграмма) — жеңіл
  if(topicId.includes("data")){
    if(level==="L1") return {q:`Кесте деген не? (жаз: деректер)`, a:`деректер`};
    if(level==="L2") return {q:`Диаграмма не үшін керек? (жаз: салыстыру)`, a:`салыстыру`};
    return {q:`Орташа мән қалай табылады? (жаз: қосу/бөлу)`, a:`қосу/бөлу`};
  }

  // жалпы сандар
  if(level==="L1"){
    const a=rand(10,99), b=rand(1,9);
    return {q:`${a} + ${b} = ?`, a:String(a+b)};
  }
  if(level==="L2"){
    const a=rand(100,999), b=rand(10,99);
    return {q:`${a} - ${b} = ?`, a:String(a-b)};
  }
  const a=rand(12,99), b=rand(2,9);
  return {q:`${a} × ${b} = ?`, a:String(a*b)};
}

export function buildQuiz(topicId, level, count=10){
  const tasks=[];
  for(let i=0;i<count;i++) tasks.push(genTask(topicId, level));
  return tasks;
}

// ====== helpers for embeds/homework ======
export function getEmbedUrl(grade, topicId){
  const embeds = store.get("embeds", {});
  return embeds?.[grade]?.[topicId] || defaultEmbeds?.[grade]?.[topicId] || "";
}

export function setEmbedUrl(grade, topicId, url){
  const embeds = store.get("embeds", {});
  embeds[grade] = embeds[grade] || {};
  embeds[grade][topicId] = url;
  store.set("embeds", embeds);
}

// re-export storage funcs
export {store, saveResult, setHomework, getHomeworkFor};
