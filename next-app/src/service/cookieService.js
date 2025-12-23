
import { jwtExpirationTime } from './../utils/auth';
export function setCookie(name, value, hours) {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

 export function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

  export  const dropAuthToken = () => {
           deleteCookie('authToken');
    };
 export    const setAuthToken = (token)=>{
setCookie('authToken', token, jwtExpirationTime);
    }

    export const getAuthToken = () => {
    return getCookie('authToken');
}