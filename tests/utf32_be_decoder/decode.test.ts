import { assertStrictEquals, assertThrows } from "../deps.ts";
import { Utf32 } from "../../mod.ts";

Deno.test("Utf32.Be.Decoder.decode(BufferSource)", () => {
  const decoder = new Utf32.Be.Decoder();

  // decode()
  assertStrictEquals(decoder.decode(), "");

  // decode(ArrayBuffer)
  assertStrictEquals(decoder.decode(new ArrayBuffer(0)), "");
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0, 0x44)
        .buffer,
    ),
    "ABCD",
  );

  // decode(Uint8Array)
  assertStrictEquals(decoder.decode(Uint8Array.of()), "");
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0, 0x44),
    ),
    "ABCD",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0x30, 0x42, 0, 0, 0x30, 0x44, 0, 0, 0x30, 0x46),
    ),
    "あいう",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0x30,
        0x44,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "あいう",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0x30,
        0x44,
        0x00,
        0x02,
        0x00,
        0x0B,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "あい\u{2000B}う",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x44,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "あ\uFEFFいう",
  );

  assertStrictEquals(decoder.decode(Uint8Array.of(0xFF)), "\uFFFD");
  assertStrictEquals(
    decoder.decode(Uint8Array.of(0, 0, 0x30, 0x46, 0xFF)),
    "う\uFFFD",
  );
  assertStrictEquals(
    decoder.decode(Uint8Array.of(0, 0, 0x30, 0x46, 0xFF, 0xFF)),
    "う\uFFFD",
  );
  assertStrictEquals(
    decoder.decode(Uint8Array.of(0, 0, 0x30, 0x46, 0xFF, 0xFF, 0xFF)),
    "う\uFFFD",
  );
  assertStrictEquals(
    decoder.decode(Uint8Array.of(0, 0, 0x30, 0x46, 0x00, 0x10, 0xFF, 0xFF)),
    "う\u{10FFFF}",
  );
  assertStrictEquals(
    decoder.decode(Uint8Array.of(0, 0, 0x30, 0x46, 0xFF, 0xFF, 0xFF, 0xFF)),
    "う\uFFFD",
  );

  assertStrictEquals(
    decoder.decode(Uint8Array.of(0xFF, 0xFF, 0xFF, 0xFF)),
    "\uFFFD",
  );

  // decode(any)
  assertThrows(
    () => {
      decoder.decode([] as unknown as Uint8Array);
    },
    TypeError,
    //XXX "input",
  );
});

Deno.test("Utf32.Be.Decoder.decode(BufferSource) - fatal", () => {
  const decoder = new Utf32.Be.Decoder({ fatal: true });

  // decode()
  assertStrictEquals(decoder.decode(), "");

  // decode(ArrayBuffer)
  assertStrictEquals(decoder.decode(new ArrayBuffer(0)), "");
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0, 0x44)
        .buffer,
    ),
    "ABCD",
  );

  // decode(Uint8Array)
  assertStrictEquals(decoder.decode(Uint8Array.of()), "");
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0, 0x44),
    ),
    "ABCD",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0x30, 0x42, 0, 0, 0x30, 0x44, 0, 0, 0x30, 0x46),
    ),
    "あいう",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0x30,
        0x44,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "あいう",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0x30,
        0x44,
        0x00,
        0x02,
        0x00,
        0x0B,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "あい\u{2000B}う",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x44,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "あ\uFEFFいう",
  );

  assertThrows(
    () => {
      decoder.decode(Uint8Array.of(0xFF));
    },
    TypeError,
    //XXX "input",
  );

  assertThrows(
    () => {
      decoder.decode(Uint8Array.of(0xFF, 0xFF, 0xFF, 0xFF));
    },
    TypeError,
    "decode-error: 0xFFFFFFFF",
  );

  // decode(any)
  assertThrows(
    () => {
      decoder.decode([] as unknown as Uint8Array);
    },
    TypeError,
    //XXX "input",
  );
});

Deno.test("Utf32.Be.Decoder.decode(BufferSource) - ignoreBOM", () => {
  const decoder = new Utf32.Be.Decoder({ ignoreBOM: true });

  // decode()
  assertStrictEquals(decoder.decode(undefined), "");

  // decode(ArrayBuffer)
  assertStrictEquals(decoder.decode(new ArrayBuffer(0)), "");
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0, 0x44)
        .buffer,
    ),
    "ABCD",
  );

  // decode(Uint8Array)
  assertStrictEquals(decoder.decode(Uint8Array.of()), "");
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0, 0x44),
    ),
    "ABCD",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(0, 0, 0x30, 0x42, 0, 0, 0x30, 0x44, 0, 0, 0x30, 0x46),
    ),
    "あいう",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0x30,
        0x44,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "\uFEFFあいう",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0x30,
        0x44,
        0x00,
        0x02,
        0x00,
        0x0B,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "\uFEFFあい\u{2000B}う",
  );
  assertStrictEquals(
    decoder.decode(
      Uint8Array.of(
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0xFE,
        0xFF,
        0,
        0,
        0x30,
        0x44,
        0,
        0,
        0x30,
        0x46,
      ),
    ),
    "あ\uFEFFいう",
  );

  assertStrictEquals(decoder.decode(Uint8Array.of(0xFF)), "\uFFFD");

  assertStrictEquals(
    decoder.decode(Uint8Array.of(0xFF, 0xFF, 0xFF, 0xFF)),
    "\uFFFD",
  );

  // decode(any)
  assertThrows(
    () => {
      decoder.decode([] as unknown as Uint8Array);
    },
    TypeError,
    //XXX "input",
  );
});

// Deno.test("Utf32be", () => {
//   const str1 = "👪a👨‍👦👨‍👨‍👦‍👦";
//   const encoded1 = Utf32be.encode(str1);
//   assertStrictEquals(Utf32be.decode(encoded1), str1);
// });

Deno.test("Utf32.Be.Decoder.decode(BufferSource, {}) - stream", () => {
  const op = { stream: true };

  const decoder1 = new Utf32.Be.Decoder();
  assertStrictEquals(decoder1.decode(new ArrayBuffer(0), op), "");
  assertStrictEquals(decoder1.decode(), "");

  const decoder2 = new Utf32.Be.Decoder();
  assertStrictEquals(
    decoder2.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0, 0x44)
        .buffer,
      op,
    ),
    "ABCD",
  );
  assertStrictEquals(decoder2.decode(), "");

  const decoder3 = new Utf32.Be.Decoder();
  assertStrictEquals(
    decoder3.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0)
        .buffer,
      op,
    ),
    "ABC",
  );
  assertStrictEquals(decoder3.decode(undefined, op), "");
  assertStrictEquals(decoder3.decode(Uint8Array.of(0, 0, 0x44).buffer), "D");

  assertStrictEquals(
    decoder3.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0)
        .buffer,
      op,
    ),
    "ABC",
  );
  assertStrictEquals(decoder3.decode(undefined, op), "");
  assertStrictEquals(decoder3.decode(Uint8Array.of(0, 0x44).buffer), "D");

  assertStrictEquals(
    decoder3.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0)
        .buffer,
      op,
    ),
    "ABC",
  );
  assertStrictEquals(decoder3.decode(undefined, op), "");
  assertStrictEquals(decoder3.decode(Uint8Array.of(0x44).buffer), "D");

  assertStrictEquals(
    decoder3.decode(
      Uint8Array.of(0, 0, 0, 0x41, 0, 0, 0, 0x42, 0, 0, 0, 0x43, 0, 0, 0, 0x44)
        .buffer,
      op,
    ),
    "ABCD",
  );
  assertStrictEquals(decoder3.decode(undefined, op), "");
  assertStrictEquals(decoder3.decode(), "");
});
