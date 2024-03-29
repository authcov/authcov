import Config from './config';
export default class ConfigValidator {
    config: any;
    errors: any;
    constructor(config: Config);
    valid(): boolean;
    errorKeys(): string[];
    errorMessage(): string;
    _validate(): void;
    _validateCrawlUser(): void;
    _validateIntruders(): void;
    _validateAuthorisationHeaders(): void;
    _validateBaseUrl(): void;
    _validateSaveResponses(): void;
    _validateSaveScreenshots(): void;
    _validateClickButtons(): void;
    _validateType(): void;
    _validateAuthenticationType(): void;
    _validateMaxDepth(): void;
    _validateXhrTimeout(): void;
    _validatePageTimeout(): void;
    _validateVerboseOutput(): void;
    _validateCookiesTriggeringPage(): void;
    _validateTokenTriggeringPage(): void;
    _validateUnAuthorizedStatusCodes(): void;
    _validateignoreLinksIncluding(): void;
    _validateloginConfig(): void;
    _validateFunctionOrArrayField(textFieldKey: any, funcFieldKey: any): void;
    _addErrorMessage(field: any, message: any): void;
}
