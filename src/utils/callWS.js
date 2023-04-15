const baseURL = "http://localhost/konecta/api";

const callWebService = async ({ endpoint, data, method, secure = true }) => {
    let url = `${baseURL}/${endpoint}.php`;
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
    const response = await fetch(url, peticion);
    return response.json();
}

export default callWebService;