//one function that every page uses to talk to backend

const BASE_URL = "http://localhost:8080"; //backend address

export async function api(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token"); //read token from local storage
    const headers: Record<string, string> = {};
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token){
        headers["Authorization"] = "Bearer " + token; //send token from Auth with Bearer in front
    }
    const response = await fetch(BASE_URL + path, {
        ...options, //copy everything the caller gave (POST)
        headers: headers,
    });
    if (response.status === 401 && !path.startsWith("/api/auth")){ //auto return to login when the token is missing or dead
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    if (!response.ok){ //the answer was a not success (200 - 299). ! : NOT
        const problem = await response.json().catch(() => ({})); //.catch(().. : handles the fact some errors (like 401) come with no body
        throw new Error(problem.detail ?? "Something went wrong"); //?? : if thats missing, use this instead
    }                                                              //throw... :stops and passes the message to the page
    if (response.status === 204){ //204 : "No Content"
        return null;
    }
    return response.json();
}

export async function downloadFile(path: string, fileName: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(BASE_URL + path, { headers: { Authorization: "Bearer " + token } });
    if (!response.ok) throw new Error("Could not download the file");
    const blob = await response.blob(); // the file, in memory
    const url = URL.createObjectURL(blob); // a temporary address for it
    const link = document.createElement("a"); // an invisible link
    link.href = url;
    link.download = fileName + (blob.type === "application/pdf" ? ".pdf" : ".docx");
    link.click(); //that clicks itself
    URL.revokeObjectURL(url); // clean up
}