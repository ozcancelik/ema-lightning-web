# ema-lightning-web

Türkçe metin okuma modeli [EMA Lightning](https://huggingface.co/canberkkkkkk/ema-lightning), tamamen tarayıcıda.
Model ekran kartında (WebGPU) ya da işlemcide (WASM) çalışır; yazdığınız metin cihazınızdan çıkmaz. Sayılar,
tarihler, saatler ve para birimleri [normalizer-tr](https://github.com/erdemtuna/normalizer-tr) ile okunur hale
getirilir ("14:30" → "on dört otuz").

A browser demo of EMA Lightning, the 8.6M-parameter Turkish TTS model: ONNX graphs on onnxruntime-web (WebGPU,
WASM fallback) and normalizer-tr compiled to WebAssembly. First audio in ~140 ms and ~20–30× faster than real time
on an Apple laptop GPU.

## Run

Any static file server works; WebGPU needs `localhost` or HTTPS.

```sh
python3 -m http.server 8765    # then open http://localhost:8765
```

On GitHub Pages: Settings → Pages → Deploy from a branch → `main`, `/ (root)`.

## Files

- `index.html`, `app.js` the page; `aura.js` the WebGL2 background, driven by the audio
- `tts.js` the engine: text handling, chunking, frame timeline, windowed decoding, per-word timings
- `normalizer.js` loads `models/normalizer.wasm`
- `models/` ONNX graphs (`text`, `sound`, `decoder`; `fp16/sound.onnx` is a half-size acoustic model) and `meta.json`

The same seed does not give the same audio as the Python package: noise comes from a JavaScript PRNG, not
`torch.randn`.

## Credits and license

Apache-2.0, see `LICENSE` and `NOTICE`.

- Model: [EMA Lightning](https://huggingface.co/canberkkkkkk/ema-lightning) by canberkkkkkk, Apache-2.0. The ONNX
  files are conversions of its weights.
- Text normalization: [normalizer-tr](https://github.com/erdemtuna/normalizer-tr) by Erdem Tuna, Apache-2.0.
  Notices for the compiled WebAssembly are in `licenses/`.
- Runtime: [onnxruntime-web](https://github.com/microsoft/onnxruntime) (MIT), loaded from jsDelivr.
