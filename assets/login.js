function ListenerLoginCheck() {
    const formLogin = document.querySelector("#logData");
    formLogin.addEventListener("submit", async function (event) {
        event.preventDefault();
        const logData = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        };
        const chargeUtile = JSON.stringify(logData);
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
        const message = await response.json();
        if (message.userId){
            sessionStorage.setItem("token", message.token);
            window.location.replace("index.html")
        }else{
            sessionStorage.setItem("token", "none");
            window.alert("Erreur dans l'identifiant ou le mot de passe.");
        }
    });
    
 }
 ListenerLoginCheck();