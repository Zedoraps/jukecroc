export function isYoutubeUri(uri:string | undefined){
    return uri && (uri.startsWith("https://www.youtube.com") || uri.startsWith("www.youtube.com") || uri.startsWith("youtube.com") || uri.startsWith("https://youtu.be") || uri.startsWith("youtu.be"));

}