// normalizer-tr (Rust) compiled to WebAssembly: reads numbers, dates, times, money, units and
// abbreviations aloud, as ema_lightning's Python frontend does. Built from normalizer-wasm/.
const enc = new TextEncoder(), dec = new TextDecoder();

// Takes the wasm bytes, or a URL to fetch them from.
export async function loadNormalizer(source) {
  const bytes = typeof source === "string" ? await (await fetch(source)).arrayBuffer() : source;
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
