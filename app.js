import { EMA, RATE, wavBlob } from "./tts.js";
import { createAura } from "./aura.js";

const $ = (id) => document.getElementById(id);
const SAMPLES = [
  ["Ödeme bildirimi", "15 Ekim 2026 Çarşamba günü saat 14:30'da, 1.250.000 TL tutarındaki ödemeniz hesabınıza yatırılacak."],
  ["Liman sabahı", "Sabahın erken saatlerinde liman henüz uyanmamıştı. Balıkçılar ağlarını sessizce topluyor, martılar ise teknelerin etrafında dönerek şanslarını deniyordu."],
  ["Hava durumu", "Yarın İstanbul'da hava parçalı bulutlu, sıcaklık 12 ile 18 °C arasında. Akşam saatlerinde %60 ihtimalle sağanak bekleniyor."],
  ["Randevu", "Dr. Ayşe Yılmaz ile randevunuz 3 Kasım Pazartesi 10:15'te, 4. kattaki 412 numaralı odada."],
];

let aura = null;
try { aura = createAura($("aura")); } catch (e) { console.warn("background disabled:", e); }

let ema = null, audio = null, run = 0, playing = null, lastChunks = null;

// ---------- small UI helpers ----------

function hint(msg, err = false) { $("hint").textContent = msg; $("hint").className = "hint" + (err ? " err" : ""); }
function setButton(mode) {
  const b = $("speak"), label = b.querySelector("span");
  b.classList.toggle("stop", mode === "stop");
  b.disabled = mode === "loading";
  label.textContent = { loading: "Yükleniyor", speak: "Seslendir", stop: "Durdur" }[mode];
}
const QUIPS = [
  "Boyum 34 megabayt, ama çenem düşük.",
  "Söz uçar, yazı kalır. Ben ikisini de hallederim.",
  "Ne yazarsan okurum. Doktor yazısı hariç.",
  "Ne bulut var ne sunucu. Bahane de yok.",
  "Kahve molası istemeyen tek seslendirme sanatçısı.",
  "Bin iki yüz elli lirayı bile hece hece okurum, merak etme.",
  "Hiç yorulmam, hiç sıkılmam, hiç zam istemem.",
  "Kimsenin hiçbir şey bilmediği yerde bir insan her şeyi bilebilir.",
  "Gerçeklerin bir kıymeti yok ki, genel kanı neyse onu yaşıyoruz.",
];
let quip = -1;
function idleLead() {
  let i;
  do i = Math.floor(Math.random() * QUIPS.length); while (i === quip && QUIPS.length > 1);
  quip = i;
  $("lead").className = "lead idle";
  $("lead").textContent = QUIPS[i];
  $("sub").hidden = false;
}
// click the line and the model says it itself
$("lead").addEventListener("click", () => {
  if (playing || !ema || !$("lead").classList.contains("idle")) return;
  $("text").value = QUIPS[quip]; autosize(); $("speak").click();
});
function autosize() { const t = $("text"); t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }

for (const [name, text] of SAMPLES) {
  const b = document.createElement("button");
  b.type = "button"; b.textContent = name; b.title = text;
  b.onclick = () => { $("text").value = text; autosize(); $("text").focus(); };
  $("samples").append(b);
}
$("text").addEventListener("input", autosize);
autosize();
$("speed").oninput = () => { $("speedOut").textContent = (+$("speed").value).toFixed(2) + "×"; };
$("reseed").onclick = () => { $("seed").value = Math.floor(Math.random() * 100000); };
$("toggleSettings").onclick = () => {
  const open = $("settings").hidden;
  $("settings").hidden = !open;
  $("toggleSettings").setAttribute("aria-expanded", String(open));
};
document.addEventListener("click", (e) => {
  if (!$("settings").hidden && !e.target.closest("#settings, #toggleSettings")) {
    $("settings").hidden = true; $("toggleSettings").setAttribute("aria-expanded", "false");
  }
});
$("fullscreen").onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); $("speak").click(); }
  else if (e.key === "Escape" && playing) stop();
  else if ((e.key === "f" || e.key === "F") && !e.target.closest("textarea, input, select")) $("fullscreen").click();
});
$("download").onclick = () => {
  if (!lastChunks) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(wavBlob(lastChunks)); a.download = "ema-lightning.wav"; a.click();
};

// ---------- model ----------

// onnxruntime-web cannot create two WebGPU sessions at once, so loads run one after another
let loading = Promise.resolve();
function load() { loading = loading.then(loadModel); return loading; }

async function loadModel() {
  let backend = $("backend").value;
  if (backend === "webgpu" && !navigator.gpu) {
    backend = "wasm"; $("backend").value = "wasm";
    hint("Bu tarayıcıda WebGPU yok; model işlemcide çalışacak, biraz daha yavaş olur.");
  }
  setButton("loading");
  ema = null;
  $("mBackend").textContent = "Model yükleniyor…";
  try {
    const precision = $("precision").value;
    ema = await EMA.load(backend, "models/", (_, p) => {
      aura?.setCharge(p);
      $("mBackend").textContent = `Model yükleniyor, %${Math.round(p * 100)}`;
    }, precision);
    for await (const _ of ema.stream("Merhaba.")) {} // compiles the GPU shaders once
    aura?.setCharge(1);
    $("mBackend").innerHTML = (backend === "webgpu" ? "<b>Ekran kartında</b> çalışıyor" : "<b>İşlemcide</b> çalışıyor")
      + `, <b>${ema.precision}</b>`;
    setButton("speak");
    if (backend === "webgpu" || $("hint").textContent.startsWith("⌘")) hint("⌘/Ctrl + Enter ile seslendirin");
  } catch (e) {
    console.error(e);
    $("mBackend").textContent = "Model yüklenemedi";
    hint(`Model yüklenemedi: ${e.message}. Sayfayı yenileyin ya da ayarlardan İşlemci'yi seçin.`, true);
  }
}
$("backend").onchange = load;
$("precision").onchange = () => { if (playing) stop(); load(); };

function audioGraph() {
  if (audio) return audio;
  const ctx = new AudioContext({ sampleRate: RATE });
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  const master = ctx.createGain();
  master.connect(analyser);
  analyser.connect(ctx.destination);
  aura?.setAnalyser(analyser);
  audio = { ctx, master };
  return audio;
}

// ---------- speaking ----------

function stop() {
  run++;
  if (playing) for (const s of playing.sources) try { s.stop(); } catch {}
  playing = null;
  setButton("speak");
  idleLead();
}

$("speak").onclick = async () => {
  if (playing) return stop();
  const text = $("text").value.trim();
  if (!ema) return;
  if (!text) { hint("Seslendirmek için bir şey yazın.", true); $("text").focus(); return; }
  const { ctx, master } = audioGraph();
  await ctx.resume();

  const id = ++run;
  const p = playing = { sources: [], pieces: [], pending: null, at: ctx.currentTime + 0.08, done: false, shown: null, word: -1 };
  const chunks = [], stats = {}, t0 = performance.now();
  let first = null;
  setButton("stop");
  hint("Esc ile durdurabilirsiniz");
  $("sub").hidden = true;
  requestAnimationFrame(() => follow(id));

  try {
    const stream = ema.stream(text, {
      speed: +$("speed").value, seed: Math.max(0, +$("seed").value || 0), stats,
      onPiece: (info) => { p.pending = { ...info, start: null }; p.pieces.push(p.pending); },
    });
    for await (const chunk of stream) {
      if (id !== run) return;
      if (first === null) first = performance.now() - t0;
      const buf = ctx.createBuffer(1, chunk.length, RATE);
      buf.copyToChannel(chunk, 0);
      const src = ctx.createBufferSource();
      src.buffer = buf; src.connect(master);
      p.at = Math.max(p.at, ctx.currentTime + 0.02);
      src.start(p.at);
      if (p.pending) { p.pending.start = p.at; p.pending = null; }
      p.at += buf.duration;
      p.sources.push(src);
      chunks.push(chunk);
    }
    p.done = true;
    const secs = chunks.reduce((a, c) => a + c.length, 0) / RATE, total = performance.now() - t0;
    $("mFirst").hidden = $("mRtf").hidden = false;
    $("mFirst").querySelector("b").textContent = `${Math.round(first)} ms`;
    $("mRtf").querySelector("b").textContent = `${Math.round(secs / (total / 1000))}×`;
    lastChunks = chunks; $("download").hidden = false;
  } catch (e) {
    console.error(e);
    if (id === run) { stop(); hint(`Seslendirilemedi: ${e.message}`, true); }
  }
};

// Light each word as it is heard: the piece's word start times are exact, from the model's frame timeline.
function follow(id) {
  if (id !== run || !playing) return;
  const p = playing, t = audio.ctx.currentTime;
  const piece = p.pieces.filter((x) => x.start !== null && x.start <= t + 0.03).at(-1);
  if (piece && piece !== p.shown) {
    p.shown = piece; p.word = -1;
    $("lead").className = "lead";
    $("lead").replaceChildren(...piece.words.flatMap((w, i) => {
      const s = document.createElement("span");
      s.className = "w"; s.textContent = w; s.dataset.i = i;
      return i ? [" ", s] : [s];
    }));
  }
  if (piece) {
    const rel = t - piece.start;
    let w = -1;
    for (let i = 0; i < piece.words.length; i++) if ((piece.starts[i] ?? Infinity) <= rel) w = i;
    if (rel > piece.seconds) w = piece.words.length; // finished: everything said
    if (w !== p.word) {
      if (w > p.word && w < piece.words.length) aura?.pulse();
      p.word = w;
      for (const s of $("lead").children) {
        const i = +s.dataset.i;
        s.className = "w" + (i < w ? " said" : i === w ? " now" : "");
      }
    }
  }
  if (p.done && t > p.at + 0.15) {
    playing = null;
    setButton("speak");
    hint("⌘/Ctrl + Enter ile tekrar seslendirin");
    for (const s of $("lead").children) s.className = "w said";
    setTimeout(() => { if (!playing && run === id) idleLead(); }, 2500);
    return;
  }
  requestAnimationFrame(() => follow(id));
}

idleLead();
load();
