// normalizer-tr (Rust) compiled to WebAssembly: reads numbers, dates, times, money, units and
// abbreviations aloud, as ema_lightning's Python frontend does. Built from normalizer-wasm/.
const enc = new TextEncoder(), dec = new TextDecoder();

export async function loadNormalizer(url) {
  const bytes = await (await fetch(url)).arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes, {});
  return fromInstance(instance);
}

export function fromInstance(instance) {
  const w = instance.exports;
  return (text) => {
    const input = enc.encode(text);
    const ptr = w.alloc(input.length);
    new Uint8Array(w.memory.buffer, ptr, input.length).set(input);
    w.normalize(ptr, input.length);
    w.dealloc(ptr, input.length);
    return dec.decode(new Uint8Array(w.memory.buffer, w.result_ptr(), w.result_len()));
  };
}
