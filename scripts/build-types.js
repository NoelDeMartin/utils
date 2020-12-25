const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');
const { resolve } = require('path');
const fs = require('fs');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const projectPath = path => resolve(__dirname, '../', path);

async function main() {
    await usingTmp(async() => {
        await generateDeclarations();
        await rollupGeneratedDeclarations();
        await appendProjectDeclarations();
        await publishDeclarations();
    });

    console.log('Done!');
}

async function usingTmp(callback) {
    clearTmp();
    await callback();
    clearTmp();
}

function clearTmp() {
    if (!fs.existsSync(projectPath('tmp')))
        return;

    fs.rmdirSync(projectPath('tmp'), { recursive: true });
}

async function generateDeclarations() {
    console.log('Generating declarations...');

    const bundle = await rollup.rollup({
        input: projectPath('src/main.ts'),
        plugins: [
            typescript({
                rootDir: 'src',
                declaration: true,
                outDir: 'tmp',
            }),
        ],
    });

    await bundle.write({ dir: projectPath('tmp') });
}

async function rollupGeneratedDeclarations() {
    console.log('Rolling up generated declarations...');

    const extractorConfig = ExtractorConfig.loadFileAndPrepare(projectPath('api-extractor.json'));

    Extractor.invoke(extractorConfig, {
        localBuild: process.env.NODE_ENV !== 'production',
        showVerboseMessages: true,
    });
}

async function appendProjectDeclarations() {
    console.log('Appending project declarations...');

    const { dtsRollup } = require(projectPath('api-extractor.json'));
    const declarationsFilePath = projectPath(dtsRollup.untrimmedFilePath.replace('<projectFolder>/', ''));
    const declarationsFile = fs.readFileSync(declarationsFilePath);
    const projectDeclarationFilePaths = fs.readdirSync(projectPath('src/types'));
    const projectDeclarations = [
        ...projectDeclarationFilePaths
            .filter(path => path !== 'globals.d.ts')
            .map(path => fs.readFileSync(projectPath(`src/types/${path}`))),
        declarationsFile,
    ];

    fs.writeFileSync(declarationsFilePath, projectDeclarations.join(''));
}

async function publishDeclarations() {
    console.log('Moving declarations to dist folder...');

    fs.renameSync(
        projectPath('tmp/noeldemartin-utils.d.ts'),
        projectPath('dist/noeldemartin-utils.d.ts'),
    );
}

main();
