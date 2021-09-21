const fs = require('fs')
const package = require('../package.json')

let data = package

Object.keys(data.devDependencies).map(dep => {
    if(dep.startsWith('@types/')) {
        data.dependencies = { ...data.dependencies, [dep]: data.devDependencies[dep] };
        delete data.devDependencies[dep]
    }
});

fs.writeFile('package.json', JSON.stringify(data, null, 2), (err) => {
    if(err) console.log(err)
    else console.log('Parsing Complete')
})