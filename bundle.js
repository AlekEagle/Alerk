const FS = require("fs/promises");
const { exec: execSync } = require("child_process");
const { promisify } = require("util");

const exec = promisify(execSync);

const languageCheeseChars = "abcdefghijklmnopqrstuvwxyz_".split("");
const cheeseShred = { name: "Value", region: "Value" };

function obtainLanguageCheese(thickness, chunkiness) {
  function recursiveCheese(name, depth, cheese) {
    if (depth > 0)
      languageCheeseChars.forEach((char) =>
        recursiveCheese(`${name}${char}`, depth - 1, cheese)
      );
    else
      new Array(chunkiness)
        .fill(null)
        .forEach((_, index) => (cheese[`${name}${index}`] = cheeseShred));
  }

  const cheese = {};
  recursiveCheese("", thickness, cheese);
  return cheese;
}

async function main() {
  const cheesing = !process.argv.includes("--no-cheese");

  if (cheesing)
    console.log(
      "WARNING: Cheesing is enabled. Use --no-cheese to disable. This might take a while."
    );
  await FS.cp("./src", "./build", { recursive: true });

  if (cheesing) {
    const meta = JSON.parse(await FS.readFile("./build/pack.mcmeta"));
    meta["language"] = obtainLanguageCheese(4, 5);
    await FS.writeFile("./build/pack.mcmeta", JSON.stringify(meta));
  }

  await exec(`zip -r ../Alerk-${cheesing ? "cheese" : "no-cheese"}.zip ./*`, {
    cwd: "./build",
  });
  console.log(`ok bundled @ Alerk-${cheesing ? "cheese" : "no-cheese"}.zip`);
}

main();
