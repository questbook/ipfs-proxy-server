/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/v0/cat": {
    get: operations["cat"];
  };
  "/api/v0/version": {
    get: operations["version"];
  };
}

export interface components {
  schemas: {
    Error: {
      statusCode: number;
      /** @description Specific description of the error */
      error: string;
      /** @description What the error was */
      message: string;
      /** @description Some extra information about the error */
      data?: { [key: string]: unknown };
    };
  };
  responses: {
    /** Generic error response */
    ErrorResponse: {
      content: {
        "application/json": components["schemas"]["Error"];
      };
    };
  };
}

export interface operations {
  cat: {
    parameters: {
      query: {
        /** The ipfs hash of the value to be retrieved */
        arg: string;
      };
    };
    responses: {
      400: components["responses"]["ErrorResponse"];
      500: components["responses"]["ErrorResponse"];
    };
  };
  version: {
    responses: {
      400: components["responses"]["ErrorResponse"];
      500: components["responses"]["ErrorResponse"];
    };
  };
}

export interface external {}