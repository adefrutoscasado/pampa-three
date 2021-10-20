const { promisify } = require('util');
const { exec } = require('child_process')
const promisedExec = promisify(exec)

const execute = async (command) => {
    return (await promisedExec(command)).stdout
}

const filenames = [
    'candleA', 
    'candleB', 
    'candleC', 
    'candleD', 
    'candleE', 
    'candleF',
    'star'
]

const convertToGlb = async (filename) => {
    console.log(await execute(`node node_modules/gltfpack/cli.js -i public/${filename}.gltf -o public/${filename}.glb`))
}

const main = async () => {
    const conversions = filenames.map(convertToGlb)
    await Promise.all(conversions)
}

main()