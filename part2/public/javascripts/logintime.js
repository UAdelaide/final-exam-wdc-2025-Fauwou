document.getElementById("formingLOGIN").addEventListener("submit",
async function(SENDITNOW){
    SENDITNOW.preventDefault()

var username = document.getElementById("username").value
var password = document.getElementById("password").value
var errorElementing = document.getElementById("errorM").value

errorElementing.style.display = "none"

try {
        var response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ username, password})
            })

            var dataplease = await response.json()

            if (dataplease.success)
            {
                if (dataplease.role === "owner")
                {
                    window.location.href = "owner-dashboard.html"
                } else {
                    window.location.href = "walker-dashboard.html"
                }
            } else {
                errorElementing.textContent = "Wrong username or password inputted, thanks."
                errorElementing.style.display = "block"
            }
          }
catch (errorM) { //catch error for if the login doesn't work
    errorElementing.textContent = "Login could not succeed because it failed. Try again."
    errorElementing.classList.remove("")
          }
        })
