import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", ".well-known", "security.txt");

const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

const content = `Contact: mailto:contact@skilledscan.com
Contact: https://skilledscan.com/security
Expires: ${expires}
Preferred-Languages: en
Canonical: https://skilledscan.com/.well-known/security.txt
Policy: https://skilledscan.com/security
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, content, "utf8");

console.log(`Wrote ${outPath}`);
