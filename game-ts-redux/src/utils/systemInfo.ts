
export function getSystemInfo() {
    // console.log("in_root --> ", window.navigator)
    const details = window.navigator.userAgent;

    /* Creating a regular expression
    containing some mobile devices keywords
    to search it in details string*/
    const regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    const isMobileDevice = regexp.test(details);
    // console.log("in_root --> ", isMobileDevice)
    return isMobileDevice;
}

export function checkIpad() {
    if(!(/iphone/i).test(window.navigator.userAgent)){
        if (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints){
            return true
        }
    }
    return false;
}