const obj2gltf = require('obj2gltf')
const fs = require('fs')

const filenames = [
    'candleA', 
    'candleB', 
    'candleC', 
    'candleD', 
    'candleE', 
    'candleF',
    'star'
]

const convertToGltf = async (filename) => {
    const gltf = await obj2gltf(`./objModels/${filename}.obj`)
    const data = Buffer.from(JSON.stringify(gltf))
    fs.writeFileSync(`./public/${filename}.gltf`, data)
}


const main = async () => {
    const conversions = filenames.map(convertToGltf)
    await Promise.all(conversions)
}

main()