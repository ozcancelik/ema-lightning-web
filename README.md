# ema-lightning-web

Türkçe metin okuma modeli [EMA Lightning](https://huggingface.co/canberkkkkkk/ema-lightning), tamamen tarayıcıda.
Model ekran kartında (WebGPU) ya da işlemcide (WASM) çalışır; yazdığınız metin cihazınızdan çıkmaz. Sayılar,
tarihler, saatler ve para birimleri [normalizer-tr](https://github.com/erdemtuna/normalizer-tr) ile okunur hale
getirilir ("14:30" → "on dört otuz").

**Canlı:** https://ema-lightning-web.vercel.app/

A browser demo of EMA Lightning, the 8.6M-parameter Turkish TTS model: ONNX graphs on onnxruntime-web (WebGPU,
WASM fallback) and normalizer-tr compiled to WebAssembly. First audio in ~140 ms and ~20–30× faster than real time
on an Apple laptop GPU.

## Run

Any static file server works; WebGPU needs `localhost` or HTTPS.

```sh
python3 -m http.server 8765    # then open http://localhost:8765
```

Deployed on Vercel as a static site, no build step. GitHub Pages works too: Settings → Pages → Deploy from a branch →
`main`, `/ (root)`.

Model files are stored in Cache Storage on first load, so later visits and settings changes do not download them
again. When anything in `models/` changes, bump `CACHE` in `tts.js`.

## iPhone and iPad

On iOS and iPadOS Safari the WebGPU build of onnxruntime-web (`ort.webgpu.min.mjs`, 27 MB of wasm) gets the tab
killed a few seconds after speaking starts, with "A problem repeatedly occurred". It is not the model's memory: the
wasm heap stays around 64–82 MB. The plain WASM build (`ort.wasm.min.mjs`, 14 MB) runs fine, so iPhone and iPad
start on the CPU (WASM) backend; the WebGPU option is still there, marked as unstable. Slower than WebGPU, but it
works.

## Files

- `index.html`, `app.js` the page; `aura.js` the WebGL2 background, driven by the audio
- `tts.js` the engine: text handling, chunking, frame timeline, windowed decoding, per-word timings
- `normalizer.js` loads `models/normalizer.wasm`
- `models/` ONNX graphs (`text`, `sound`, `decoder`; `fp16/sound.onnx` is a half-size acoustic model) and `meta.json`
- `og.jpg`, `favicon.svg`, `robots.txt`, `sitemap.xml` share card, icon and crawler files; the canonical URL is the
  Vercel address above

The same seed does not give the same audio as the Python package: noise comes from a JavaScript PRNG, not
`torch.randn`.

## Credits and license

Apache-2.0, see `LICENSE` and `NOTICE`.

- Model: [EMA Lightning](https://huggingface.co/canberkkkkkk/ema-lightning) by canberkkkkkk, Apache-2.0. The ONNX
  files are conversions of its weights.
- Text normalization: [normalizer-tr](https://github.com/erdemtuna/normalizer-tr) by Erdem Tuna, Apache-2.0.
  Notices for the compiled WebAssembly are in `licenses/`.
- Runtime: [onnxruntime-web](https://github.com/microsoft/onnxruntime) (MIT), loaded from jsDelivr.
- Font: [Unbounded](https://fonts.google.com/specimen/Unbounded) (OFL), also used in `og.jpg`.
