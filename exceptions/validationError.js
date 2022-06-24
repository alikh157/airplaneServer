export default class JoiError extends Error {
    constructor(title, detail, code, status, source, meta) {
        super(detail);
        this.code = code || 40;
        this.detail = detail || "Some thing went wrong in validation.";
        this.status = status || 400;
        this.source = source || { pointer: "/", parameter: "input" };
        this.title = title || "ValidationError";
        this.meta = meta || {
            type: "value error .",
        };
    }
}
