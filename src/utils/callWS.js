const baseURL = "http://localhost/konecta/api";

const callWebService = (endpoint, data, method, secure = true) => {
    const url = `${baseURL}${endpoint}`;
    const peticion = {
        method,
    };
    if(method !== "GET"){
        peticion.body = JSON.stringify(data);
    }
    if(secure){
        const token = localStorage.getItem("token") || ""; 
        peticion.headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }
    return fetch(url, peticion);
}

export default callWebService;