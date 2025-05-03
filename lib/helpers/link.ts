export const optimizeUrl = (url: string) => {
  const optimizedUrl = url.replace("/upload/", "/upload/w_400,q_auto,f_auto/");
  return optimizedUrl;
};
