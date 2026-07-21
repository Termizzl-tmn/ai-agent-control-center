const fs = require('fs')
const path = require('path')

const gyp = path.join(__dirname, '../node_modules/node-pty/deps/winpty/src/winpty.gyp')
const gen = path.join(__dirname, '../node_modules/node-pty/deps/winpty/src/gen/GenVersion.h')

if (!fs.existsSync(gyp)) {
  console.log('node-pty not found, skipping winpty patch')
  process.exit(0)
}

let content = fs.readFileSync(gyp, 'utf8')
content = content.replace(
  `'<!(cmd /c "cd shared && GetCommitHash.bat")'`,
  `'none'`
)
content = content.replace(
  `'<!(cmd /c "cd shared && UpdateGenVersion.bat <(WINPTY_COMMIT_HASH)")'`,
  `'gen'`
)
fs.writeFileSync(gyp, content)

fs.mkdirSync(path.dirname(gen), { recursive: true })
fs.writeFileSync(gen, [
  '// AUTO-GENERATED',
  'const char GenVersion_Version[] = "0.4.4-dev";',
  'const char GenVersion_Commit[] = "none";',
  ''
].join('\n'))

console.log('winpty.gyp patched successfully')
