const packageJson = require('./example-package.json')
const { promises: fs } = require('fs');
const YAML = require('json-to-pretty-yaml')
const path = require('path')

module.exports = async function createPackage(core) {
  try {
    const app = core.getInput('app')
    const component = core.getInput('component')
    const name = core.getInput('name')
    const lib = core.getInput('lib')
    const region = core.getInput('region')
    const runtime = core.getInput('runtime')
    const environment =core.getInput('environment') || 'release'
    const main = core.getInput('main') || 'main.js'
    packageJson.name = app
    packageJson.main = main
    core.info(`dir path ${process.cwd()}`)
    core.info(`write path ${path.join('./', lib,'package.json')}`);
    await fs.writeFile(path.join('./', lib,'package.json'), JSON.stringify(packageJson), { encoding: 'utf8' })
    core.info("write path success");
    const jsonData = YAML.stringify({
      app,
      stage: "${env:STAGE}",
      component,
      name,
      inputs: {
        src: {
          src: lib
        },
        region,
        runtime,
        apigw: {
          protocols:[{ http: true }],
          environment
        }
      }
    })
    core.info(`YAML data ${jsonData}`)
    core.info(`write path ${path.join('./', 'serverless.yml')}`);
    await fs.writeFile(path.join('./', 'serverless.yml'), jsonData);
    core.info("write path success");
    core.setOutput("create serverless packages success")
  } catch (error) {
    core.setFailed(error.message)
  }
}