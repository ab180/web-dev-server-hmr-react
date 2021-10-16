import * as fs from 'fs/promises'

const getDependencies = async () => Object.keys(
    JSON.parse(await fs.readFile('package.json', 'utf8'))
    .dependencies
)

export { getDependencies }