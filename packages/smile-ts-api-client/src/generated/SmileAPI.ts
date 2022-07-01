import * as request from "superagent";

type CallbackHandler = (err: any, res?: request.Response) => void;
export type DateRange = {
  endDate: string;

  startDate: string;
};
export type Library = {
  barcodeId: string;

  barcodeIndex: string;

  captureConcentrationNm: string;

  captureInputNg: string;

  captureName: string;

  dnaInputNg: number;

  libraryConcentrationNgul: number;

  libraryIgoId: string;

  libraryVolume: number;

  numFastQs: number;

  runs: Array<Run>;
};
export type ModelAndView = {
  empty: boolean;

  model: {};

  modelMap: {};

  reference: boolean;

  status:
    | "100 CONTINUE"
    | "101 SWITCHING_PROTOCOLS"
    | "102 PROCESSING"
    | "103 CHECKPOINT"
    | "200 OK"
    | "201 CREATED"
    | "202 ACCEPTED"
    | "203 NON_AUTHORITATIVE_INFORMATION"
    | "204 NO_CONTENT"
    | "205 RESET_CONTENT"
    | "206 PARTIAL_CONTENT"
    | "207 MULTI_STATUS"
    | "208 ALREADY_REPORTED"
    | "226 IM_USED"
    | "300 MULTIPLE_CHOICES"
    | "301 MOVED_PERMANENTLY"
    | "302 FOUND"
    | "302 MOVED_TEMPORARILY"
    | "303 SEE_OTHER"
    | "304 NOT_MODIFIED"
    | "305 USE_PROXY"
    | "307 TEMPORARY_REDIRECT"
    | "308 PERMANENT_REDIRECT"
    | "400 BAD_REQUEST"
    | "401 UNAUTHORIZED"
    | "402 PAYMENT_REQUIRED"
    | "403 FORBIDDEN"
    | "404 NOT_FOUND"
    | "405 METHOD_NOT_ALLOWED"
    | "406 NOT_ACCEPTABLE"
    | "407 PROXY_AUTHENTICATION_REQUIRED"
    | "408 REQUEST_TIMEOUT"
    | "409 CONFLICT"
    | "410 GONE"
    | "411 LENGTH_REQUIRED"
    | "412 PRECONDITION_FAILED"
    | "413 PAYLOAD_TOO_LARGE"
    | "413 REQUEST_ENTITY_TOO_LARGE"
    | "414 URI_TOO_LONG"
    | "414 REQUEST_URI_TOO_LONG"
    | "415 UNSUPPORTED_MEDIA_TYPE"
    | "416 REQUESTED_RANGE_NOT_SATISFIABLE"
    | "417 EXPECTATION_FAILED"
    | "418 I_AM_A_TEAPOT"
    | "419 INSUFFICIENT_SPACE_ON_RESOURCE"
    | "420 METHOD_FAILURE"
    | "421 DESTINATION_LOCKED"
    | "422 UNPROCESSABLE_ENTITY"
    | "423 LOCKED"
    | "424 FAILED_DEPENDENCY"
    | "425 TOO_EARLY"
    | "426 UPGRADE_REQUIRED"
    | "428 PRECONDITION_REQUIRED"
    | "429 TOO_MANY_REQUESTS"
    | "431 REQUEST_HEADER_FIELDS_TOO_LARGE"
    | "451 UNAVAILABLE_FOR_LEGAL_REASONS"
    | "500 INTERNAL_SERVER_ERROR"
    | "501 NOT_IMPLEMENTED"
    | "502 BAD_GATEWAY"
    | "503 SERVICE_UNAVAILABLE"
    | "504 GATEWAY_TIMEOUT"
    | "505 HTTP_VERSION_NOT_SUPPORTED"
    | "506 VARIANT_ALSO_NEGOTIATES"
    | "507 INSUFFICIENT_STORAGE"
    | "508 LOOP_DETECTED"
    | "509 BANDWIDTH_LIMIT_EXCEEDED"
    | "510 NOT_EXTENDED"
    | "511 NETWORK_AUTHENTICATION_REQUIRED";

  view: View;

  viewName: string;
};
export type PatientAlias = {
  namespace: string;

  value: string;
};
export type PublishedSmileRequest = {
  bicAnalysis: boolean;

  dataAccessEmails: string;

  dataAnalystEmail: string;

  dataAnalystName: string;

  genePanel: string;

  igoProjectId: string;

  igoRequestId: string;

  investigatorEmail: string;

  investigatorName: string;

  isCmoRequest: boolean;

  labHeadEmail: string;

  labHeadName: string;

  libraryType: string;

  otherContactEmails: string;

  piEmail: string;

  pooledNormals: Array<string>;

  projectManagerName: string;

  qcAccessEmails: string;

  requestJson: string;

  samples: Array<PublishedSmileSample>;

  smileRequestId: string;

  strand: string;
};
export type PublishedSmileSample = {
  additionalProperties: {};

  baitSet: string;

  cfDNA2dBarcode: string;

  cmoInfoIgoId: string;

  cmoPatientId: string;

  cmoSampleIdFields: {};

  cmoSampleName: string;

  collectionYear: string;

  datasource: string;

  genePanel: string;

  igoComplete: boolean;

  importDate: string;

  investigatorSampleId: string;

  libraries: Array<Library>;

  oncotreeCode: string;

  patientAliases: Array<PatientAlias>;

  preservation: string;

  primaryId: string;

  qcReports: Array<QcReport>;

  sampleAliases: Array<SampleAlias>;

  sampleClass: string;

  sampleName: string;

  sampleOrigin: string;

  sampleType: string;

  sex: string;

  smilePatientId: string;

  smileSampleId: string;

  species: string;

  tissueLocation: string;

  tubeId: string;

  tumorOrNormal: string;
};
export type QcReport = {
  IGORecommendation: string;

  comments: string;

  investigatorDecision: string;

  qcReportType: "DNA" | "RNA" | "LIBRARY";
};
export type Run = {
  fastqs: Array<string>;

  flowCellId: string;

  flowCellLanes: Array<number>;

  readLength: string;

  runDate: string;

  runId: string;

  runMode: string;
};
export type SampleAlias = {
  namespace: string;

  value: string;
};
export type SmileSampleIdMapping = {
  cmoSampleName: string;

  importDate: string;

  primaryId: string;

  smileSampleId: string;
};
export type View = {
  contentType: string;
};

/**
 *
 * @class SmileAPI
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export default class SmileAPI {
  private domain: string = "";
  private errorHandlers: CallbackHandler[] = [];

  constructor(domain?: string) {
    if (domain) {
      this.domain = domain;
    }
  }

  getDomain() {
    return this.domain;
  }

  addErrorHandler(handler: CallbackHandler) {
    this.errorHandlers.push(handler);
  }

  private request(
    method: string,
    url: string,
    body: any,
    headers: any,
    queryParameters: any,
    form: any,
    reject: CallbackHandler,
    resolve: CallbackHandler,
    errorHandlers: CallbackHandler[]
  ) {
    let req = (new (request as any).Request(
      method,
      url
    ) as request.Request).query(queryParameters);
    Object.keys(headers).forEach(key => {
      req.set(key, headers[key]);
    });

    if (body) {
      req.send(body);
    }

    if (typeof body === "object" && !(body.constructor.name === "Buffer")) {
      req.set("Content-Type", "application/json");
    }

    if (Object.keys(form).length > 0) {
      req.type("form");
      req.send(form);
    }

    req.end((error, response) => {
      if (error || !response.ok) {
        reject(error);
        errorHandlers.forEach(handler => handler(error));
      } else {
        resolve(response);
      }
    });
  }

  errorUsingGETURL(parameters: { $queryParameters?: any }): string {
    let queryParameters: any = {};
    let path = "/error";

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingGET
   */
  errorUsingGETWithHttpInfo(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/error";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "*/*";
      headers["Content-Type"] = "application/json";

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "GET",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingGET
   */
  errorUsingGET(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<{}> {
    return this.errorUsingGETWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  errorUsingHEADURL(parameters: { $queryParameters?: any }): string {
    let queryParameters: any = {};
    let path = "/error";

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingHEAD
   */
  errorUsingHEADWithHttpInfo(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/error";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "*/*";
      headers["Content-Type"] = "application/json";

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "HEAD",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingHEAD
   */
  errorUsingHEAD(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<{}> {
    return this.errorUsingHEADWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  errorUsingPOSTURL(parameters: { $queryParameters?: any }): string {
    let queryParameters: any = {};
    let path = "/error";

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingPOST
   */
  errorUsingPOSTWithHttpInfo(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/error";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "*/*";
      headers["Content-Type"] = "application/json";

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "POST",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingPOST
   */
  errorUsingPOST(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<{}> {
    return this.errorUsingPOSTWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  errorUsingPUTURL(parameters: { $queryParameters?: any }): string {
    let queryParameters: any = {};
    let path = "/error";

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingPUT
   */
  errorUsingPUTWithHttpInfo(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/error";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "*/*";
      headers["Content-Type"] = "application/json";

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "PUT",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingPUT
   */
  errorUsingPUT(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<{}> {
    return this.errorUsingPUTWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  errorUsingDELETEURL(parameters: { $queryParameters?: any }): string {
    let queryParameters: any = {};
    let path = "/error";

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingDELETE
   */
  errorUsingDELETEWithHttpInfo(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/error";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "*/*";
      headers["Content-Type"] = "application/json";

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "DELETE",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingDELETE
   */
  errorUsingDELETE(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<{}> {
    return this.errorUsingDELETEWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  errorUsingOPTIONSURL(parameters: { $queryParameters?: any }): string {
    let queryParameters: any = {};
    let path = "/error";

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingOPTIONS
   */
  errorUsingOPTIONSWithHttpInfo(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/error";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "*/*";
      headers["Content-Type"] = "application/json";

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "OPTIONS",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingOPTIONS
   */
  errorUsingOPTIONS(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<{}> {
    return this.errorUsingOPTIONSWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  errorUsingPATCHURL(parameters: { $queryParameters?: any }): string {
    let queryParameters: any = {};
    let path = "/error";

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingPATCH
   */
  errorUsingPATCHWithHttpInfo(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/error";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "*/*";
      headers["Content-Type"] = "application/json";

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "PATCH",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * error
   * @method
   * @name SmileAPI#errorUsingPATCH
   */
  errorUsingPATCH(parameters: {
    $queryParameters?: any;
    $domain?: string;
  }): Promise<{}> {
    return this.errorUsingPATCHWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  fetchSmileRequestListPOSTURL(parameters: {
    requestIds: Array<string>;
    $queryParameters?: any;
  }): string {
    let queryParameters: any = {};
    let path = "/request";

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * Returns a list of SmileRequest given a list of Request IDs.
   * @method
   * @name SmileAPI#fetchSmileRequestListPOST
   * @param {} requestIds - List of Request IDs
   */
  fetchSmileRequestListPOSTWithHttpInfo(parameters: {
    requestIds: Array<string>;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/request";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";

      if (parameters["requestIds"] !== undefined) {
        body = parameters["requestIds"];
      }

      if (parameters["requestIds"] === undefined) {
        reject(new Error("Missing required  parameter: requestIds"));
        return;
      }

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "POST",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * Returns a list of SmileRequest given a list of Request IDs.
   * @method
   * @name SmileAPI#fetchSmileRequestListPOST
   * @param {} requestIds - List of Request IDs
   */
  fetchSmileRequestListPOST(parameters: {
    requestIds: Array<string>;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<Array<PublishedSmileRequest>> {
    return this.fetchSmileRequestListPOSTWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  fetchSmileRequestGETURL(parameters: {
    requestId: string;
    $queryParameters?: any;
  }): string {
    let queryParameters: any = {};
    let path = "/request/{requestId}";

    path = path.replace("{requestId}", parameters["requestId"] + "");

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * Returns a SmileRequest given a Request ID
   * @method
   * @name SmileAPI#fetchSmileRequestGET
   * @param {string} requestId - Request ID to retrieve
   */
  fetchSmileRequestGETWithHttpInfo(parameters: {
    requestId: string;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/request/{requestId}";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";

      path = path.replace("{requestId}", parameters["requestId"] + "");

      if (parameters["requestId"] === undefined) {
        reject(new Error("Missing required  parameter: requestId"));
        return;
      }

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "GET",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * Returns a SmileRequest given a Request ID
   * @method
   * @name SmileAPI#fetchSmileRequestGET
   * @param {string} requestId - Request ID to retrieve
   */
  fetchSmileRequestGET(parameters: {
    requestId: string;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<PublishedSmileRequest> {
    return this.fetchSmileRequestGETWithHttpInfo(parameters).then(function(
      response: request.Response
    ) {
      return response.body;
    });
  }
  fetchRequestListByImportDatePOSTURL(parameters: {
    dateRange: DateRange;
    returnType?: "REQUEST_ID_LIST" | "REQUEST_SUMMARY_LIST";
    $queryParameters?: any;
  }): string {
    let queryParameters: any = {};
    let path = "/requestsByImportDate";

    if (parameters["returnType"] !== undefined) {
      queryParameters["returnType"] = parameters["returnType"];
    }

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * Returns a list of request summaries or list of request IDs importedinto the database within the provided date range.
   * @method
   * @name SmileAPI#fetchRequestListByImportDatePOST
   * @param {} dateRange - JSON with 'startDate' (required) and 'endDate' (optional) to query for.
   * @param {string} returnType - returnType
   */
  fetchRequestListByImportDatePOSTWithHttpInfo(parameters: {
    dateRange: DateRange;
    returnType?: "REQUEST_ID_LIST" | "REQUEST_SUMMARY_LIST";
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/requestsByImportDate";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";

      if (parameters["dateRange"] !== undefined) {
        body = parameters["dateRange"];
      }

      if (parameters["dateRange"] === undefined) {
        reject(new Error("Missing required  parameter: dateRange"));
        return;
      }

      if (parameters["returnType"] !== undefined) {
        queryParameters["returnType"] = parameters["returnType"];
      }

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "POST",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * Returns a list of request summaries or list of request IDs importedinto the database within the provided date range.
   * @method
   * @name SmileAPI#fetchRequestListByImportDatePOST
   * @param {} dateRange - JSON with 'startDate' (required) and 'endDate' (optional) to query for.
   * @param {string} returnType - returnType
   */
  fetchRequestListByImportDatePOST(parameters: {
    dateRange: DateRange;
    returnType?: "REQUEST_ID_LIST" | "REQUEST_SUMMARY_LIST";
    $queryParameters?: any;
    $domain?: string;
  }): Promise<{}> {
    return this.fetchRequestListByImportDatePOSTWithHttpInfo(parameters).then(
      function(response: request.Response) {
        return response.body;
      }
    );
  }
  fetchSmileSampleByInputIdGETURL(parameters: {
    inputId: string;
    $queryParameters?: any;
  }): string {
    let queryParameters: any = {};
    let path = "/sampleById/{inputId}";

    path = path.replace("{inputId}", parameters["inputId"] + "");

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * Fetch SmileSample by inputId
   * @method
   * @name SmileAPI#fetchSmileSampleByInputIdGET
   * @param {string} inputId - input id to search with
   */
  fetchSmileSampleByInputIdGETWithHttpInfo(parameters: {
    inputId: string;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/sampleById/{inputId}";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";

      path = path.replace("{inputId}", parameters["inputId"] + "");

      if (parameters["inputId"] === undefined) {
        reject(new Error("Missing required  parameter: inputId"));
        return;
      }

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "GET",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * Fetch SmileSample by inputId
   * @method
   * @name SmileAPI#fetchSmileSampleByInputIdGET
   * @param {string} inputId - input id to search with
   */
  fetchSmileSampleByInputIdGET(parameters: {
    inputId: string;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<PublishedSmileSample> {
    return this.fetchSmileSampleByInputIdGETWithHttpInfo(parameters).then(
      function(response: request.Response) {
        return response.body;
      }
    );
  }
  fetchSampleMetadataListByCmoPatientIdGETURL(parameters: {
    cmoPatientId: string;
    $queryParameters?: any;
  }): string {
    let queryParameters: any = {};
    let path = "/samples/{cmoPatientId}";

    path = path.replace("{cmoPatientId}", parameters["cmoPatientId"] + "");

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * Fetch SampleMetadata list by CMO Patient ID
   * @method
   * @name SmileAPI#fetchSampleMetadataListByCmoPatientIdGET
   * @param {string} cmoPatientId - CMO Patient ID
   */
  fetchSampleMetadataListByCmoPatientIdGETWithHttpInfo(parameters: {
    cmoPatientId: string;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/samples/{cmoPatientId}";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";

      path = path.replace("{cmoPatientId}", parameters["cmoPatientId"] + "");

      if (parameters["cmoPatientId"] === undefined) {
        reject(new Error("Missing required  parameter: cmoPatientId"));
        return;
      }

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "GET",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * Fetch SampleMetadata list by CMO Patient ID
   * @method
   * @name SmileAPI#fetchSampleMetadataListByCmoPatientIdGET
   * @param {string} cmoPatientId - CMO Patient ID
   */
  fetchSampleMetadataListByCmoPatientIdGET(parameters: {
    cmoPatientId: string;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<Array<PublishedSmileSample>> {
    return this.fetchSampleMetadataListByCmoPatientIdGETWithHttpInfo(
      parameters
    ).then(function(response: request.Response) {
      return response.body;
    });
  }
  fetchSmileSampleIdMappingListByInputDateGETURL(parameters: {
    importDate: string;
    $queryParameters?: any;
  }): string {
    let queryParameters: any = {};
    let path = "/samplesByDate/{importDate}";

    path = path.replace("{importDate}", parameters["importDate"] + "");

    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    let keys = Object.keys(queryParameters);
    return (
      this.domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * Fetch SmileSampleIdMapping list by inputDate
   * @method
   * @name SmileAPI#fetchSmileSampleIdMappingListByInputDateGET
   * @param {string} importDate - Import date to search from
   */
  fetchSmileSampleIdMappingListByInputDateGETWithHttpInfo(parameters: {
    importDate: string;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    const errorHandlers = this.errorHandlers;
    const request = this.request;
    let path = "/samplesByDate/{importDate}";
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise(function(resolve, reject) {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";

      path = path.replace("{importDate}", parameters["importDate"] + "");

      if (parameters["importDate"] === undefined) {
        reject(new Error("Missing required  parameter: importDate"));
        return;
      }

      if (parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(
          parameterName
        ) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
      }

      request(
        "GET",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        errorHandlers
      );
    });
  }

  /**
   * Fetch SmileSampleIdMapping list by inputDate
   * @method
   * @name SmileAPI#fetchSmileSampleIdMappingListByInputDateGET
   * @param {string} importDate - Import date to search from
   */
  fetchSmileSampleIdMappingListByInputDateGET(parameters: {
    importDate: string;
    $queryParameters?: any;
    $domain?: string;
  }): Promise<Array<SmileSampleIdMapping>> {
    return this.fetchSmileSampleIdMappingListByInputDateGETWithHttpInfo(
      parameters
    ).then(function(response: request.Response) {
      return response.body;
    });
  }
}
