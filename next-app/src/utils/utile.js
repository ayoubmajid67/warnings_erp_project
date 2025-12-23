export function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
    });


}
export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });


}

export async function wait(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time > 0 ? time : 0);
    });
}

