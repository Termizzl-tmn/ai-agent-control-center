import chokidar, { FSWatcher } from 'chokidar'

type WatchCallback = (event: string, path: string) => void

const watchers = new Map<string, FSWatcher>()

export function startWatcher(dir: string, cb: WatchCallback) {
  if (watchers.has(dir)) return

  const watcher = chokidar.watch(dir, {
    ignored: /(^|[\/\\])\..|(node_modules)/,
    persistent: true,
    ignoreInitial: true,
  })

  watcher
    .on('add', (p) => cb('add', p))
    .on('change', (p) => cb('change', p))
    .on('unlink', (p) => cb('unlink', p))

  watchers.set(dir, watcher)
}

export function stopWatcher(dir: string) {
  const watcher = watchers.get(dir)
  if (watcher) {
    watcher.close()
    watchers.delete(dir)
  }
}
