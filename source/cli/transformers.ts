import * as libts from "typescript";
import * as is from "./is";
import * as shared from "./shared";

// Transforms `var/let/const <import> = __importStar(require(<path>));` into `import * as <import> from <path>;`.
export function esmImportStarFromImportStarRequire(node: libts.Node, factory: libts.NodeFactory, options: shared.Options): libts.Node {
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
	if (options.debug) console.log("esmImportStarFromImportStarRequire", requireArgument.getText());
	return factory.createImportDeclaration(
		undefined,
		undefined,
		factory.createImportClause(
			false,
			undefined,
			factory.createNamespaceImport(importIdentifier)
		),
		requireArgument
	);
};

// Transforms `__exportStar(require(<path>), exports);` into `export * from <path>;`.
export function esmExportStarFromExportStarRequire(node: libts.Node, factory: libts.NodeFactory, options: shared.Options): libts.Node {
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
	if (options.debug) console.log("esmExportStarFromExportStarRequire", requireArgument.getText());
	return factory.createExportDeclaration(
		undefined,
		undefined,
		false,
		undefined,
		requireArgument
	);
};

// Transforms `var/let/const <import> = require(<path>);` into `import * as <import> from <path>;`.
export function esmImportFromCjsRequire(node: libts.Node, factory: libts.NodeFactory, options: shared.Options): libts.Node {
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
	if (options.debug) console.log("esmImportFromCjsRequire", requireArgument.getText());
	return factory.createImportDeclaration(
		undefined,
		undefined,
		factory.createImportClause(
			false,
			undefined,
			factory.createNamespaceImport(importIdentifier)
		),
		requireArgument
	);
};

// Transforms `exports.<export> = require(<path>);` into `export * as <export> from <path>;`.
export function esmExportFromCjsRequire(node: libts.Node, factory: libts.NodeFactory, options: shared.Options): libts.Node {
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
	if (options.debug) console.log("esmExportFromCjsRequire", requireArgument.getText());
	return factory.createExportDeclaration(
		undefined,
		undefined,
		false,
		factory.createNamespaceExport(exportIdentifier),
		requireArgument
	);
};

// Transforms `exports.<export> = __importStar(require(<path>));` into `export * as <export> from <path>;`.
export function esmExportStarFromImportStarRequire(node: libts.Node, factory: libts.NodeFactory, options: shared.Options): libts.Node {
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
	if (options.debug) console.log("esmExportStarFromImportStarRequire", requireArgument.getText());
	return factory.createExportDeclaration(
		undefined,
		undefined,
		false,
		factory.createNamespaceExport(exportIdentifier),
		requireArgument
	);
};
