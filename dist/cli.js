#!/usr/bin/env node
define("is", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.present = exports.absent = void 0;
    function absent(subject) {
        return subject == null;
    }
    exports.absent = absent;
    ;
    function present(subject) {
        return subject != null;
    }
    exports.present = present;
    ;
});
define("transformers", ["require", "exports", "typescript", "is"], function (require, exports, libts, is) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.esmExportStarFromImportStarRequire = exports.esmExportFromCjsRequire = exports.esmImportFromCjsRequire = exports.esmExportStarFromExportStarRequire = exports.esmImportStarFromImportStarRequire = void 0;
    // Transforms `var/let/const <import> = __importStar(require(<path>));` into `import * as <import> from <path>;`.
    function esmImportStarFromImportStarRequire(node, factory, options) {
        if (!libts.isVariableStatement(node)) {
            return node;
        }
        let variableStatement = node;
        let variableDeclarationList = variableStatement.declarationList;
        // TODO: Support more than one declaration per statement.
        if (variableDeclarationList.declarations.length !== 1) {
            return node;
        }
        let variableDeclaration = variableDeclarationList.declarations[0];
        let importIdentifier = variableDeclaration.name;
        if (!libts.isIdentifier(importIdentifier)) {
            return node;
        }
        let importStarCall = variableDeclaration.initializer;
        if (is.absent(importStarCall)) {
            return node;
        }
        if (!libts.isCallExpression(importStarCall)) {
            return node;
        }
        let importStarIdentifier = importStarCall.expression;
        if (!libts.isIdentifier(importStarIdentifier)) {
            return node;
        }
        if (importStarIdentifier.getText() !== "__importStar") {
            return node;
        }
        let importStarArguments = importStarCall.arguments;
        if (importStarArguments.length !== 1) {
            return node;
        }
        let requireCall = importStarArguments[0];
        if (!libts.isCallExpression(requireCall)) {
            return node;
        }
        let requireIdentifier = requireCall.expression;
        if (!libts.isIdentifier(requireIdentifier)) {
            return node;
        }
        if (requireIdentifier.getText() !== "require") {
            return node;
        }
        let requireArguments = requireCall.arguments;
        if (requireArguments.length !== 1) {
            return node;
        }
        let requireArgument = requireArguments[0];
        if (!libts.isStringLiteral(requireArgument)) {
            return node;
        }
        let newNode = factory.createImportDeclaration(undefined, undefined, factory.createImportClause(false, undefined, factory.createNamespaceImport(factory.createIdentifier(importIdentifier.getText()))), factory.createStringLiteralFromNode(requireArgument));
        if (options.debug) {
            console.log(`Transformed:`);
            console.log(`\t${node.getText()}`);
            console.log(`\timport * as ${importIdentifier.getText()} from ${requireArgument.getText()};`);
        }
        return newNode;
    }
    exports.esmImportStarFromImportStarRequire = esmImportStarFromImportStarRequire;
    ;
    // Transforms `__exportStar(require(<path>), exports);` into `export * from <path>;`.
    function esmExportStarFromExportStarRequire(node, factory, options) {
        if (!libts.isExpressionStatement(node)) {
            return node;
        }
        let exportStarCall = node.expression;
        if (!libts.isCallExpression(exportStarCall)) {
            return node;
        }
        let exportStarIdentifier = exportStarCall.expression;
        if (!libts.isIdentifier(exportStarIdentifier)) {
            return node;
        }
        if (exportStarIdentifier.getText() !== "__exportStar") {
            return node;
        }
        let exportStarArguments = exportStarCall.arguments;
        if (exportStarArguments.length !== 2) {
            return node;
        }
        let requireCall = exportStarArguments[0];
        if (!libts.isCallExpression(requireCall)) {
            return node;
        }
        let requireIdentifier = requireCall.expression;
        if (!libts.isIdentifier(requireIdentifier)) {
            return node;
        }
        if (requireIdentifier.getText() !== "require") {
            return node;
        }
        let requireArguments = requireCall.arguments;
        if (requireArguments.length !== 1) {
            return node;
        }
        let requireArgument = requireArguments[0];
        if (!libts.isStringLiteral(requireArgument)) {
            return node;
        }
        let exportsIdentifier = exportStarArguments[1];
        if (!libts.isIdentifier(exportsIdentifier)) {
            return node;
        }
        if (exportsIdentifier.getText() !== "exports") {
            return node;
        }
        let newNode = factory.createExportDeclaration(undefined, undefined, false, undefined, factory.createStringLiteralFromNode(requireArgument));
        if (options.debug) {
            console.log(`Transformed:`);
            console.log(`\t${node.getText()}`);
            console.log(`\texport * from ${requireArgument.getText()};`);
        }
        return newNode;
    }
    exports.esmExportStarFromExportStarRequire = esmExportStarFromExportStarRequire;
    ;
    // Transforms `var/let/const <import> = require(<path>);` into `import * as <import> from <path>;`.
    function esmImportFromCjsRequire(node, factory, options) {
        if (!libts.isVariableStatement(node)) {
            return node;
        }
        let variableStatement = node;
        let variableDeclarationList = variableStatement.declarationList;
        // TODO: Support more than one declaration per statement.
        if (variableDeclarationList.declarations.length !== 1) {
            return node;
        }
        let variableDeclaration = variableDeclarationList.declarations[0];
        let importIdentifier = variableDeclaration.name;
        if (!libts.isIdentifier(importIdentifier)) {
            return node;
        }
        let requireCall = variableDeclaration.initializer;
        if (is.absent(requireCall)) {
            return node;
        }
        if (!libts.isCallExpression(requireCall)) {
            return node;
        }
        let requireIdentifier = requireCall.expression;
        if (!libts.isIdentifier(requireIdentifier)) {
            return node;
        }
        if (requireIdentifier.getText() !== "require") {
            return node;
        }
        let requireArguments = requireCall.arguments;
        if (requireArguments.length !== 1) {
            return node;
        }
        let requireArgument = requireArguments[0];
        if (!libts.isStringLiteral(requireArgument)) {
            return node;
        }
        let newNode = factory.createImportDeclaration(undefined, undefined, factory.createImportClause(false, undefined, factory.createNamespaceImport(factory.createIdentifier(importIdentifier.getText()))), factory.createStringLiteralFromNode(requireArgument));
        if (options.debug) {
            console.log(`Transformed:`);
            console.log(`\t${node.getText()}`);
            console.log(`\timport * as ${importIdentifier.getText()} from ${requireArgument.getText()};`);
        }
        return newNode;
    }
    exports.esmImportFromCjsRequire = esmImportFromCjsRequire;
    ;
    // Transforms `exports.<export> = require(<path>);` into `export * as <export> from <path>;`.
    function esmExportFromCjsRequire(node, factory, options) {
        if (!libts.isExpressionStatement(node)) {
            return node;
        }
        let expression = node.expression;
        if (!libts.isBinaryExpression(expression)) {
            return node;
        }
        if (expression.operatorToken.kind !== libts.SyntaxKind.EqualsToken) {
            return node;
        }
        let exportsExpression = expression.left;
        if (!libts.isPropertyAccessExpression(exportsExpression)) {
            return node;
        }
        let exportsIdentifier = exportsExpression.expression;
        if (!libts.isIdentifier(exportsIdentifier)) {
            return node;
        }
        if (exportsIdentifier.getText() !== "exports") {
            return node;
        }
        let exportIdentifier = exportsExpression.name;
        if (!libts.isIdentifier(exportIdentifier)) {
            return node;
        }
        let requireCall = expression.right;
        if (!libts.isCallExpression(requireCall)) {
            return node;
        }
        let requireIdentifier = requireCall.expression;
        if (!libts.isIdentifier(requireIdentifier)) {
            return node;
        }
        if (requireIdentifier.getText() !== "require") {
            return node;
        }
        let requireArguments = requireCall.arguments;
        if (requireArguments.length !== 1) {
            return node;
        }
        let requireArgument = requireArguments[0];
        if (!libts.isStringLiteral(requireArgument)) {
            return node;
        }
        let newNode = factory.createExportDeclaration(undefined, undefined, false, factory.createNamespaceExport(factory.createIdentifier(exportIdentifier.getText())), factory.createStringLiteralFromNode(requireArgument));
        if (options.debug) {
            console.log(`Transformed:`);
            console.log(`\t${node.getText()}`);
            console.log(`\texport * as ${exportIdentifier.getText()} from ${requireArgument.getText()};`);
        }
        return newNode;
    }
    exports.esmExportFromCjsRequire = esmExportFromCjsRequire;
    ;
    // Transforms `exports.<export> = __importStar(require(<path>));` into `export * as <export> from <path>;`.
    function esmExportStarFromImportStarRequire(node, factory, options) {
        if (!libts.isExpressionStatement(node)) {
            return node;
        }
        let expression = node.expression;
        if (!libts.isBinaryExpression(expression)) {
            return node;
        }
        if (expression.operatorToken.kind !== libts.SyntaxKind.EqualsToken) {
            return node;
        }
        let exportsExpression = expression.left;
        if (!libts.isPropertyAccessExpression(exportsExpression)) {
            return node;
        }
        let exportsIdentifier = exportsExpression.expression;
        if (!libts.isIdentifier(exportsIdentifier)) {
            return node;
        }
        if (exportsIdentifier.getText() !== "exports") {
            return node;
        }
        let exportIdentifier = exportsExpression.name;
        if (!libts.isIdentifier(exportIdentifier)) {
            return node;
        }
        let importStarCall = expression.right;
        if (!libts.isCallExpression(importStarCall)) {
            return node;
        }
        let importStarIdentifier = importStarCall.expression;
        if (!libts.isIdentifier(importStarIdentifier)) {
            return node;
        }
        if (importStarIdentifier.getText() !== "__importStar") {
            return node;
        }
        let importStarArguments = importStarCall.arguments;
        if (importStarArguments.length !== 1) {
            return node;
        }
        let requireCall = importStarArguments[0];
        if (!libts.isCallExpression(requireCall)) {
            return node;
        }
        let requireIdentifier = requireCall.expression;
        if (!libts.isIdentifier(requireIdentifier)) {
            return node;
        }
        if (requireIdentifier.getText() !== "require") {
            return node;
        }
        let requireArguments = requireCall.arguments;
        if (requireArguments.length !== 1) {
            return node;
        }
        let requireArgument = requireArguments[0];
        if (!libts.isStringLiteral(requireArgument)) {
            return node;
        }
        let newNode = factory.createExportDeclaration(undefined, undefined, false, factory.createNamespaceExport(factory.createIdentifier(exportIdentifier.getText())), factory.createStringLiteralFromNode(requireArgument));
        if (options.debug) {
            console.log(`Transformed:`);
            console.log(`\t${node.getText()}`);
            console.log(`\texport * as ${exportIdentifier.getText()} from ${requireArgument.getText()};`);
        }
        return newNode;
    }
    exports.esmExportStarFromImportStarRequire = esmExportStarFromImportStarRequire;
    ;
});
define("bundler", ["require", "exports", "typescript", "is", "transformers"], function (require, exports, libts, is, transformers) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bundle = void 0;
    const DEFINE = `function define(e,t,l){let n=define;function u(e){return require(e)}null==n.moduleStates&&(n.moduleStates=new Map),null==n.dependentsMap&&(n.dependentsMap=new Map);let d=n.moduleStates.get(e);if(null!=d)throw"Duplicate module found with name "+e+"!";d={callback:l,dependencies:t,module:null},n.moduleStates.set(e,d);for(let l of t){let t=n.dependentsMap.get(l);null==t&&(t=new Set,n.dependentsMap.set(l,t)),t.add(e)}!function e(t){let l=n.moduleStates.get(t);if(null==l||null!=l.module)return;let d=Array(),o={exports:{}};for(let e of l.dependencies){if("require"===e){d.push(u);continue}if("module"===e){d.push(o);continue}if("exports"===e){d.push(o.exports);continue}try{d.push(u(e));continue}catch(e){}let t=n.moduleStates.get(e);if(null==t||null==t.module)return;d.push(t.module.exports)}l.callback(...d),l.module=o;let p=n.dependentsMap.get(t);if(null!=p)for(let t of p)e(t)}(e)}`;
    function createTransformers(options) {
        return {
            before: [
                (context) => {
                    let factory = context.factory;
                    return {
                        transformBundle(node) {
                            return node;
                        },
                        transformSourceFile(node) {
                            return libts.visitEachChild(node, (node) => {
                                node = transformers.esmImportFromCjsRequire(node, factory, options);
                                node = transformers.esmExportFromCjsRequire(node, factory, options);
                                node = transformers.esmExportStarFromExportStarRequire(node, factory, options);
                                node = transformers.esmImportStarFromImportStarRequire(node, factory, options);
                                node = transformers.esmExportStarFromImportStarRequire(node, factory, options);
                                return node;
                            }, context);
                        }
                    };
                }
            ]
        };
    }
    function createCompilerHost(compilerOptions, pkg, options) {
        var _a;
        let dependencies = (_a = pkg === null || pkg === void 0 ? void 0 : pkg.dependencies) !== null && _a !== void 0 ? _a : {};
        let host = libts.createCompilerHost(compilerOptions);
        let declarationFiles = new Array();
        host.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, compilerOptions) => {
            return moduleNames.map((moduleName) => {
                let result = libts.resolveModuleName(moduleName, containingFile, compilerOptions, libts.sys);
                if (is.absent(result.resolvedModule)) {
                    return;
                }
                let resolvedFileName = result.resolvedModule.resolvedFileName;
                let packageId = result.resolvedModule.packageId;
                let isExternalLibraryImport = false;
                if (resolvedFileName.endsWith(".d.ts")) {
                    let resolvedFileNameJs = resolvedFileName.slice(0, -5) + `.js`;
                    if (host.fileExists(resolvedFileNameJs)) {
                        resolvedFileName = resolvedFileNameJs;
                    }
                    else {
                        declarationFiles.push(moduleName);
                        return;
                    }
                }
                if (is.present(packageId) && (packageId.name in dependencies)) {
                    isExternalLibraryImport = true;
                }
                if (options.debug) {
                    console.log(`Resolved:`);
                    console.log(`\t"${moduleName}"`);
                    console.log(`\t"${resolvedFileName}"`);
                    console.log(`\t(${isExternalLibraryImport ? "external" : "internal"})`);
                }
                return {
                    resolvedFileName,
                    isExternalLibraryImport
                };
            });
        };
        host.readFile = (filename) => {
            let contents = libts.sys.readFile(filename);
            if (is.absent(contents)) {
                return;
            }
            if (!filename.endsWith(".js")) {
                return contents;
            }
            let output = libts.transpileModule(contents, {
                compilerOptions: {
                    module: libts.ModuleKind.ESNext,
                    target: libts.ScriptTarget.ESNext
                },
                transformers: createTransformers(options)
            });
            return output.outputText;
        };
        host.writeFile = (filename, data) => {
            for (let declarationFile of declarationFiles) {
                data += `define("${declarationFile}", [], function () {});\n`;
            }
            data = data + DEFINE;
            libts.sys.writeFile(filename, data);
        };
        return host;
    }
    function readPackageJson(entry) {
        let path = libts.findConfigFile(entry, libts.sys.fileExists, "package.json");
        if (is.absent(path)) {
            return;
        }
        let contents = libts.sys.readFile(path);
        if (is.absent(contents)) {
            return;
        }
        return JSON.parse(contents);
    }
    function bundle(options) {
        let config = {
            allowJs: true,
            esModuleInterop: false,
            isolatedModules: true,
            module: libts.ModuleKind.AMD,
            moduleResolution: libts.ModuleResolutionKind.NodeJs,
            outFile: options.bundle,
            resolveJsonModule: true,
            target: libts.ScriptTarget.ESNext
        };
        let pkg = readPackageJson(options.entry);
        let compiler = createCompilerHost(config, pkg, options);
        let program = libts.createProgram([options.entry], config, compiler);
        let result = program.emit();
        let errors = result.diagnostics.map((diagnostic) => {
            if (is.present(diagnostic.file) && is.present(diagnostic.start)) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                let message = libts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
            }
            else {
                return libts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            }
        });
        let log = errors.join("\n");
        if (result.emitSkipped) {
            throw log;
        }
        else {
            process.stderr.write(`${log}\n`);
        }
    }
    exports.bundle = bundle;
    ;
});
define("index", ["require", "exports", "bundler", "is"], function (require, exports, bundler, is) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var _a;
        let options = {};
        let foundUnrecognizedArgument = false;
        for (let argv of process.argv.slice(2)) {
            let parts = null;
            if (false) {
            }
            else if ((parts = /^--entry=(.+)$/.exec(argv)) != null) {
                options.entry = parts[1];
            }
            else if ((parts = /^--bundle=(.+)$/.exec(argv)) != null) {
                options.bundle = parts[1];
            }
            else if ((parts = /^--debug=(true|false)$/.exec(argv)) != null) {
                options.debug = parts[1] === "true";
            }
            else {
                foundUnrecognizedArgument = true;
                process.stderr.write(`Unrecognized argument \"${argv}\"!\n`);
            }
        }
        let entry = options.entry;
        let bundle = options.bundle;
        let debug = (_a = options.debug) !== null && _a !== void 0 ? _a : false;
        if (foundUnrecognizedArgument || is.absent(entry) || is.absent(bundle)) {
            process.stderr.write(`Arguments:\n`);
            process.stderr.write(`	--entry=string\n`);
            process.stderr.write(`		Set entry point (input file) for bundling.\n`);
            process.stderr.write(`	--bundle=string\n`);
            process.stderr.write(`		Set bundle (output file) for bundling.\n`);
            process.stderr.write(`	--debug=boolean\n`);
            process.stderr.write(`		Set debug mode.\n`);
            return 1;
        }
        try {
            bundler.bundle({
                entry,
                bundle,
                debug
            });
            return 0;
        }
        catch (error) {
            process.stderr.write(String(error) + "\n");
            return 1;
        }
    }
    process.exit(run());
});
function define(e,t,l){let n=define;function u(e){return require(e)}null==n.moduleStates&&(n.moduleStates=new Map),null==n.dependentsMap&&(n.dependentsMap=new Map);let d=n.moduleStates.get(e);if(null!=d)throw"Duplicate module found with name "+e+"!";d={callback:l,dependencies:t,module:null},n.moduleStates.set(e,d);for(let l of t){let t=n.dependentsMap.get(l);null==t&&(t=new Set,n.dependentsMap.set(l,t)),t.add(e)}!function e(t){let l=n.moduleStates.get(t);if(null==l||null!=l.module)return;let d=Array(),o={exports:{}};for(let e of l.dependencies){if("require"===e){d.push(u);continue}if("module"===e){d.push(o);continue}if("exports"===e){d.push(o.exports);continue}try{d.push(u(e));continue}catch(e){}let t=n.moduleStates.get(e);if(null==t||null==t.module)return;d.push(t.module.exports)}l.callback(...d),l.module=o;let p=n.dependentsMap.get(t);if(null!=p)for(let t of p)e(t)}(e)}