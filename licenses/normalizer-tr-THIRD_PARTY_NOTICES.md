# Third-party notices

The Apache-2.0 package license applies to owned code and independently authored
tables. It does not replace third-party rights. Dependencies are obtained by
Cargo, not vendored in the package; retain their licenses and notices when
redistributing them or a binary. Upstream manifests/archives are authoritative.
No GPL/LGPL normalizer source, eSpeak rules, num2words code, bulk dictionaries,
or remote model assets are included.

## Runtime and optional dependencies

Fallback data and source rendering incorporate parts of Canberk Aslan's
Apache-2.0 contribution in PR #1, head
`0a5de68286cacc4f95c754f519899d15fc2c5e73`, under this repository's Apache-2.0
license. Source: https://github.com/erdemtuna/normalizer-tr/pull/1.

The separate local Python companion adds PyO3 0.29.3 (MIT OR Apache-2.0), its
same-version build/FFI/macro packages, heck 0.5.0 (MIT OR Apache-2.0),
target-lexicon 0.13.5 (Apache-2.0 WITH LLVM-exception), and portable-atomic 1.15.0
(Apache-2.0 OR MIT). These are not core normalizer dependencies. Maturin 1.15.0
is build tooling under MIT OR Apache-2.0. The wheel retains owned license and
third-party notices; upstream licenses for compiled Rust dependencies are
included separately under its license assets.

Release wheels also retain the Rust 1.99.0 standard-library MIT/Apache license
texts and the toolchain's `COPYRIGHT-library.html` notices under
`licenses/rust-std-1.99.0/`. Those upstream terms are separate from our owned
Apache-2.0 source. These binary redistribution assets are not core dependencies.

| Package | Locked version | Declared license |
|---|---|---|
| regex | 1.13.1 | MIT OR Apache-2.0 |
| regex-automata | 0.4.18 | MIT OR Apache-2.0 |
| regex-syntax | 0.8.11 | MIT OR Apache-2.0 |
| aho-corasick | 1.1.5 | Unlicense OR MIT |
| memchr | 2.8.3 | Unlicense OR MIT |
| unicode-normalization | 0.1.25 | MIT OR Apache-2.0 |
| tinyvec | 1.13.3 | Zlib OR Apache-2.0 OR MIT |
| unicode-segmentation | 1.13.3 | MIT OR Apache-2.0 |
| serde / serde_core / serde_derive (optional) | 1.0.229 | MIT OR Apache-2.0 |
| proc-macro2 (optional derive tooling) | 1.0.107 | MIT OR Apache-2.0 |
| quote (optional derive tooling) | 1.0.47 | MIT OR Apache-2.0 |
| syn (derive tooling) | 3.0.6 | MIT OR Apache-2.0 |
| unicode-ident (derive tooling) | 1.0.26 | (MIT OR Apache-2.0) AND Unicode-3.0 |

## Development / target-specific lockfile dependencies

Reviewed from Cargo metadata on 2026-10-01. These are not normalizer runtime
services. MIT/Apache expressions in older upstream metadata use `/` as their
dual-license separator; the expressions below retain the upstream wording.

| Package | Locked version | Declared license |
|---|---|---|
| proptest | 1.11.0 | MIT OR Apache-2.0 |
| serde_json | 1.0.151 | MIT OR Apache-2.0 |
| autocfg | 1.5.1 | Apache-2.0 OR MIT |
| bit-set / bit-vec | 0.8.0 | Apache-2.0 OR MIT |
| bitflags | 2.13.2 | MIT OR Apache-2.0 |
| cfg-if | 1.0.5 | MIT OR Apache-2.0 |
| errno | 0.3.14 | MIT OR Apache-2.0 |
| fastrand | 2.5.0 | Apache-2.0 OR MIT |
| fnv | 1.0.7 | Apache-2.0 / MIT |
| getrandom | 0.3.4 / 0.4.3 | MIT OR Apache-2.0 |
| itoa | 1.0.18 | MIT OR Apache-2.0 |
| libc | 0.2.189 | MIT OR Apache-2.0 |
| linux-raw-sys | 0.12.1 | Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT |
| num-traits | 0.2.19 | MIT OR Apache-2.0 |
| once_cell | 1.21.4 | MIT OR Apache-2.0 |
| ppv-lite86 | 0.2.21 | MIT OR Apache-2.0 |
| quick-error | 1.2.3 | MIT/Apache-2.0 |
| r-efi | 5.3.0 / 6.0.0 | MIT OR Apache-2.0 OR LGPL-2.1-or-later |
| rand | 0.9.5 | MIT OR Apache-2.0 |
| rand_chacha | 0.9.0 | MIT OR Apache-2.0 |
| rand_core | 0.9.5 | MIT OR Apache-2.0 |
| rand_xorshift | 0.4.0 | MIT OR Apache-2.0 |
| rustix | 1.1.5 | Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT |
| rusty-fork | 0.3.1 | MIT/Apache-2.0 |
| syn | 2.0.119 | MIT OR Apache-2.0 |
| tempfile | 3.27.0 | MIT OR Apache-2.0 |
| unarray | 0.1.4 | MIT OR Apache-2.0 |
| wait-timeout | 0.2.1 | MIT/Apache-2.0 |
| wasip2 | 1.0.4+wasi-0.2.12 | Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT |
| windows-link | 0.2.1 | MIT OR Apache-2.0 |
| windows-sys | 0.61.2 | MIT OR Apache-2.0 |
| wit-bindgen | 0.57.1 | Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT |
| zerocopy / zerocopy-derive | 0.8.59 | BSD-2-Clause OR Apache-2.0 OR MIT |
| zmij | 1.0.23 | MIT |

The alternate permissive MIT/Apache terms are available for r-efi; its optional
LGPL alternative does not make our owned source LGPL. This table is an inventory,
not legal advice or permission to strip upstream attribution.

Locked graph advisory review: `cargo-audit` against RustSec snapshot
`3461c0d8f85d084552dd999c58d97c7123a9e0fd`, updated 2026-10-01, reported
zero known vulnerabilities and no informational warnings for 54 lockfile
packages. This is point-in-time evidence, not a guarantee of future safety.
The checker/cache are local development artifacts and are not packaged.

## Unicode / CLDR reference notice

Turkish numeral behavior was cross-checked against CLDR release-48
`common/rbnf/tr.xml` (Copyright 1991-2025 Unicode, Inc.). No RBNF engine/rules file
is bundled. Retain this notice for the reference/derived linguistic data and
Unicode-licensed dependency data. Asset provenance is in
`src/data/provenance.md`.

UNICODE LICENSE V3

COPYRIGHT AND PERMISSION NOTICE

Copyright © 1991-2026 Unicode, Inc.

NOTICE TO USER: Carefully read the following legal agreement. BY
DOWNLOADING, INSTALLING, COPYING OR OTHERWISE USING DATA FILES, AND/OR
SOFTWARE, YOU UNEQUIVOCALLY ACCEPT, AND AGREE TO BE BOUND BY, ALL OF THE
TERMS AND CONDITIONS OF THIS AGREEMENT. IF YOU DO NOT AGREE, DO NOT
DOWNLOAD, INSTALL, COPY, DISTRIBUTE OR USE THE DATA FILES OR SOFTWARE.

Permission is hereby granted, free of charge, to any person obtaining a
copy of data files and any associated documentation (the "Data Files") or
software and any associated documentation (the "Software") to deal in the
Data Files or Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, and/or sell
copies of the Data Files or Software, and to permit persons to whom the
Data Files or Software are furnished to do so, provided that either (a)
this copyright and permission notice appear with all copies of the Data
Files or Software, or (b) this copyright and permission notice appear in
associated Documentation.

THE DATA FILES AND SOFTWARE ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF
THIRD PARTY RIGHTS.

IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE
BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES,
OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THE DATA
FILES OR SOFTWARE.

Except as contained in this notice, the name of a copyright holder shall
not be used in advertising or otherwise to promote the sale, use or other
dealings in these Data Files or Software without prior written
authorization of the copyright holder.
