const getMobileDetect = (userAgent: string) => {
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i));
  const isOpera = (): boolean => Boolean(userAgent.match(/Opera Mini/i));
  const isIOS = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isWindows = (): boolean => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i));
  const isFirefox = (): boolean => Boolean(userAgent.match(/Firefox/i));
  const isSafari = (): boolean => {
    return Boolean(userAgent.match(/Safari/i)) && !userAgent.match(/Chrome/i);
  };

  const isMobile = (): boolean =>
    Boolean(isAndroid() || isIOS() || isOpera() || isWindows());
  const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR());
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isFirefox,
    isSSR,
    isIOS,
    isSafari,
  };
};

export const useMobileDetect = () => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  return getMobileDetect(userAgent);
};
