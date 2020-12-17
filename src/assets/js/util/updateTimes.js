
export const UPDATE_TIME_OFFLINE = 30; // 30 waiting, it should be kind of instance
export const UPDATE_TIME_OFFLINE_AUTOPLAY = 15; // we really want it to start asap - 15 seconds
export const UPDATE_TIME_ONLINE = 60; // 1 minute, it's online already, so no need to overload the server
export const UPDATE_TIME_FULLSCREEN = 1200; // 20 minutes - well, the person is watching, so no need to call all the time, as he won't notice anyway