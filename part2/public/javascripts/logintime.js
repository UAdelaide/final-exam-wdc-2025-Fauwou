document.getElementById("formingLOGIN").addEventListener("submit",
async function(SENDITNOW){
    SENDITNOW.preventDefault()

var username = document.getElementById("username").value //gets the relevant 
var password = document.getElementById("password").value
var errorElementing = document.getElementById("errorM").value

errorElementing.style.display = "none"

try {
        var response = await fetch("/api/login", {//getting the responded with information from login
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ username, password})
            })

            var dataplease = await response.json()//putting the response into a json

            if (dataplease.success)
            {
                if (dataplease.role === "owner") //checks if owner was found in the response
                {
                    window.location.href = "owner-dashboard.html" //redirecting to owner if so
                } else {
                    window.location.href = "walker-dashboard.html" //redirecting to walker if not owner, but still valid
                }
            } else { //if all is incorrect, displays error
                errorElementing.textContent = "Wrong username or password inputted, thanks."
                errorElementing.style.display = "block"
            }
          }
catch (errorM) { //catch error for if the login doesn't work
    errorElementing.textContent = "Login could not succeed because it failed. Try again."
    errorElementing.style.display = "block"
          }
        })
