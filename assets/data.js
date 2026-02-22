async function loadCurriculum(){
  const res = await fetch("data/curriculum.json", {cache:"no-store"});
  return await res.json();
}

export const store = {
  get(key, fallback=null){
    try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; }
  },
  set(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export function saveResult(result){
  const all = store.get("results", []);
  all.unshift(result);
  store.set("results", all.slice(0, 500));
}

export function setHomework(hw){
  const all = store.get("homework", []);
  all.unshift(hw);
  store.set("homework", all.slice(0, 200));
}

export function getHomeworkFor(grade){
  const all = store.get("homework", []);
  return all.filter(x => x.grade === grade);
}

/**
 * Default external resources (YouTube-сыз).
 * Егер бір ресурс iframe-та ашылмаса, teacher панельден ауыстырып қоясың.
 */
export const defaultEmbeds = {
  "4": {
    // NOTE: кейбір сайттар embed-ті блоктауы мүмкін; блоктаса — link-only fallback көрсетеміз.
    "g4-big": "https://www.mathlearningcenter.org/apps/base-ten-blocks",
    "g4-eq": "https://www.mathlearningcenter.org/apps/number-line",
    "g4-frac": "https://www.mathlearningcenter.org/apps/fraction-tiles"
  }
};
