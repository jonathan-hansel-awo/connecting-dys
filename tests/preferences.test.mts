import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
// Node's type stripping needs the explicit extension; excluded from app compilation below.
import {
  defaults,
  normalisePreferences,
  preferenceBootstrap,
} from "../src/lib/preferences.ts";

test("malformed and untrusted storage cannot inject CSS or invalid settings", () => {
  for (const p of [
    null,
    [],
    "bad",
    123,
    {
      font: "url(https://bad)",
      size: Infinity,
      lineHeight: -1,
      letterSpacing: 500,
      background: "red;display:none",
      reduceMotion: "true",
    },
  ])
    assert.deepEqual(normalisePreferences(p), defaults);
  assert.equal(normalisePreferences({ size: 100 }).size, 28);
  assert.equal(normalisePreferences({ size: -100 }).size, 16);
});
test("all five font choices and reading settings survive validation", () => {
  for (const font of [
    "Open Sans",
    "Arial",
    "Verdana",
    "Atkinson Hyperlegible",
    "OpenDyslexic",
  ]) {
    const p = {
      font,
      size: 28,
      lineHeight: 2,
      letterSpacing: 0.12,
      background: "#EBF4FA",
      reduceMotion: true,
    };
    assert.deepEqual(normalisePreferences(p), p);
  }
});
test("pre-paint bootstrap agrees with validation, including old and corrupted preferences", () => {
  for (const value of [
    null,
    {},
    { font: "Georgia", size: 24 },
    {
      font: "OpenDyslexic",
      size: 28,
      lineHeight: 2,
      letterSpacing: 0.12,
      background: "#FFFFFF",
      reduceMotion: true,
    },
    { size: 0, reduceMotion: "true" },
  ]) {
    const data: Record<string, string> = {},
      style: Record<string, string> = {};
    vm.runInNewContext(preferenceBootstrap, {
      document: {
        documentElement: {
          dataset: data,
          style: {
            setProperty: (key: string, value: string) => {
              style[key] = value;
            },
          },
        },
      },
      localStorage: { getItem: () => JSON.stringify(value) },
    });
    const p = normalisePreferences(value);
    assert.equal(data.readingFont, p.font);
    assert.equal(data.reduceMotion, String(p.reduceMotion));
    assert.equal(data.largeReading, String(p.size > 20));
    assert.equal(style["--reading-size"], `${p.size}px`);
    assert.equal(style["--reading-background"], p.background);
    assert.equal(style["--reading-line-height"], String(p.lineHeight));
    assert.equal(style["--reading-letter-spacing"], `${p.letterSpacing}em`);
  }
});
test("first paint remains usable when JSON is corrupt or storage access is blocked", () => {
  for (const getItem of [
    () => "{",
    () => {
      throw new Error("denied");
    },
  ])
    assert.doesNotThrow(() =>
      vm.runInNewContext(preferenceBootstrap, {
        localStorage: { getItem },
        document: {},
      }),
    );
});
