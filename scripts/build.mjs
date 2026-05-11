import { cp, mkdir, rm, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { build } from 'vite';

const projectRoot = process.cwd();
const tempRoot = join(tmpdir(), 'bass-chord-tone-finder-build');

await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

await Promise.all([
  cp(join(projectRoot, 'src'), join(tempRoot, 'src'), { recursive: true }),
  cp(join(projectRoot, 'index.html'), join(tempRoot, 'index.html')),
  cp(join(projectRoot, 'vite.config.ts'), join(tempRoot, 'vite.config.ts')),
]);

await symlink(join(projectRoot, 'node_modules'), join(tempRoot, 'node_modules'), 'junction');

await build({
  configFile: join(tempRoot, 'vite.config.ts'),
  root: tempRoot,
  build: {
    outDir: join(tempRoot, 'dist'),
    emptyOutDir: true,
  },
});

await rm(join(projectRoot, 'dist'), { recursive: true, force: true });
await cp(join(tempRoot, 'dist'), join(projectRoot, 'dist'), { recursive: true });
