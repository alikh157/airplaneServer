import validationError from "../exceptions/validationError";
import rateLimiting from "express-rate-limit";

export default rateLimiting({
    windowMs: 60 * 1000,
    max: 5, // limit each IP to 1 requests per windowMs
    handler: function (req, res, next) {
        console.log(req)
        next(
            new validationError(
                "TooManyRequest",
                "تعداد درخواست های زیادی داده اید. لطفا چند دقیقه دیگر مجددا تلاش کنید.",
                43,
                429,
                "",
                {
                    type: "many request .",
                }
            )
        )
    },
});
