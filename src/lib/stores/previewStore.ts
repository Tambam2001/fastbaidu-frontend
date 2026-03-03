export function loadPreviewState() {
    if (typeof sessionStorage !== 'undefined') {
        const saved = sessionStorage.getItem("fastbaidu_preview_state");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

export function savePreviewState(state: any) {
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem("fastbaidu_preview_state", JSON.stringify(state));
    }
}

export function clearPreviewState() {
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem("fastbaidu_preview_state");
    }
}
