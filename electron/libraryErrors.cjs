class LibraryAppError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "LibraryAppError";
    this.code = code;
    this.details = details;
  }
}

class LibraryValidationError extends LibraryAppError {
  constructor(message, details = null) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "LibraryValidationError";
  }
}

class LibraryNotFoundError extends LibraryAppError {
  constructor(message = "Library item not found.", details = null) {
    super(message, "NOT_FOUND", details);
    this.name = "LibraryNotFoundError";
  }
}

class LibraryStorageError extends LibraryAppError {
  constructor(message = "Library storage operation failed.", details = null) {
    super(message, "STORAGE_ERROR", details);
    this.name = "LibraryStorageError";
  }
}

function serializeLibraryError(error) {
  if (error instanceof LibraryAppError) {
    return {
      name: error.name,
      code: error.code,
      message: error.message,
      details: error.details ?? null,
    };
  }

  return {
    name: "Error",
    code: "UNKNOWN_ERROR",
    message: error?.message || "Unknown error.",
    details: null,
  };
}

module.exports = {
  LibraryAppError,
  LibraryValidationError,
  LibraryNotFoundError,
  LibraryStorageError,
  serializeLibraryError,
};
