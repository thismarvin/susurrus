// @ts-nocheck

const _browserData = _getBrowserData();

export const BROWSER_NAME = _browserData.browserName;
export const IS_BLINK = _browserData.isBlink;

/**
 * An imperfect means of getting the current browser.
 * Code taken directly from this Stack Overflow post: https://stackoverflow.com/a/9851769
 * (and slightly modified by me <3).
 */
function _getBrowserData() {
	// Opera 8.0+
	const isOpera =
		(!!window.opr && !!opr.addons) ||
		!!window.opera ||
		navigator.userAgent.indexOf(" OPR/") >= 0;

	// Firefox 1.0+
	const isFirefox = typeof InstallTrigger !== "undefined";

	// Safari 3.0+ "[object HTMLElementConstructor]"
	const isSafari =
		/constructor/i.test(window.HTMLElement) ||
		(function (p) {
			return p.toString() === "[object SafariRemoteNotification]";
		})(
			!window["safari"] ||
				(typeof safari !== "undefined" && safari.pushNotification)
		);

	// Internet Explorer 6-11
	const isIE = /*@cc_on!@*/ false || !!document.documentMode;

	// Edge 20+
	const isEdge = !isIE && !!window.StyleMedia;

	// Chrome 1 - 79
	const isChrome =
		!!window.chrome &&
		(!!window.chrome.webstore ||
			!!window.chrome.runtime ||
			!!window.chrome.csi);

	// Edge (based on chromium) detection
	const isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") != -1;

	// Blink engine detection
	const isBlink = (isChrome || isOpera) && !!window.CSS;

	let browserName = "";
	browserName = isOpera ? "opera" : browserName;
	browserName = isFirefox ? "firefox" : browserName;
	browserName = isSafari ? "safari" : browserName;
	browserName = isIE ? "ie" : browserName;
	browserName = isEdge ? "edge" : browserName;
	browserName = isChrome ? "chrome" : browserName;
	browserName = isEdgeChromium ? "edgechromium" : browserName;

	return {
		browserName: browserName,
		isBlink: isBlink,
	};
}
