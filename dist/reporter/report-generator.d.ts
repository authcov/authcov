declare const Ejs: any;
declare const fs: any;
declare const ApiEndpointsPresenter: any;
declare const deleteFolderRecursive: (path: any) => void;
declare class ReportGenerator {
    apiEndpointsPresenter: any;
    pageData: any;
    packagePath: any;
    reportPath: any;
    constructor(apiEndpoints: any, pageData: any, packagePath: any);
    generate(reportPath: any): void;
    _clearReportDir(): void;
    _createReportDir(): void;
    _generateResourcePages(): void;
    _generateRequestPages(): void;
    _generatePagePages(): void;
    _generateIndex(): void;
    _generateAuthGroups(): void;
    _generatePagesCrawled(): void;
    _generateFile(templatePath: any, outputPath: any, data: any): void;
    _copyAssets(): void;
}
