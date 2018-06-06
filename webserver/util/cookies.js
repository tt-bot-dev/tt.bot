module.exports = function checkCookieConsent(rq, rs, nx) {
    if (rq.originalUrl.startsWith("/static")) return nx(); // prevent the data consent from loading on static files
    if (rq.originalUrl.startsWith("/acceptcookie")) return nx();
    if (rq.originalUrl.startsWith("/api")) return nx(); // Allow DBL to bypass cookie consent
    if (!rq.signedCookies) return rs.render("landing-consent", rq.makeTemplatingData());
    if (rq.signedCookies.dataOk !== "ok") return rs.render("landing-consent", rq.makeTemplatingData());
    return nx();
}