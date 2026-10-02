class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;

  constructor(message: string, statusCode: number) {
    // Calls the Error class constructor and passes the error message to it.
    super(message);
    this.statusCode = statusCode;
    // operational error - the application knows about this situation and can handle it gracefully.
    this.isOperational = true;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default  AppError;
