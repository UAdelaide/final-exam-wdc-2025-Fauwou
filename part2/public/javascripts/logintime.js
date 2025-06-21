const { response, get } = require("../../app")

document.getElementById("formingLOGIN").addEventListener("submit",
async function(SENDITNOW){//calls for the form info
    SENDITNOW.preventDefault() //stops autoredirecting upon running

var username = document.getElementById("username").value //gets the relevant variables from the login
var password = document.getElementById("password").value
var errorElementing = document.getElementById("errorMessaging")

errorElementing.style.display = "none"//hides error message

try {
        var response = await fetch("/api/login", {//getting it responded with information from login-form
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ username, password})
            })

            var dataplease = await response.json()//putting the response into a json

            if (dataplease.success)
            {
                if (dataplease.role === "owner") //checks if owner was found in the response
                {
                    window.location.href = "/owner-dashboard.html" //redirecting to owner if so
                } else if (dataplease.role === "walker") {
                    window.location.href = "/walker-dashboard.html" //redirecting to walker if not owner, but still valid
                }
            } else { //if all is incorrect, displays error
                errorElementing.textContent = dataplease.message || "Wrong username or password inputted, thanks."
                errorElementing.style.display = "block"
            }
          }
catch (errorM) { //catch error for if the login doesn't work
    errorElementing.textContent = "Login could not succeed because it failed. Try again."
    errorElementing.style.display = "block"
    //console.error("Failed logging in moment:", errorM)
    }
})


async function DOGDISPLAY()
{
    try {
        var callingidea = await fetch("/api/dogs")
        var doggies = await response.json

        var DogListing = document.getElementById("DOGGYLIST")
        DogListing.innerHTML = ""

        for (var dog of doggies)
        {
            var URLPHOTO = await DOGPHOTOFIND(dog.size)
            var rowing = document.createElement("tr")
            rowing.innerHTML =
            `
             <td>${dog_id}</td>
             <td>${dog.name}</td>
             <td>${dog.size}</td>
             <td>${dog.owner_id}</td>
             <td><img src="${URLPHOTO}" class="doggy-photoing"></td>
             `
            DogListing.appendChild(rowing)
        }

        document.getElementById("TABLEFORDOGS").style.display = "block"
    } catch (errorM) {
        console.error("womp womp, no dogs today:", errorM)
    }
}

async function DOGPHOTOFIND()
{
    try {
        var OrganisingSize =
        {
            small: "https://dog.ceo/api/breeds/image/random",
            medium: "https://dog.ceo/api/breeds/image/random",
            large: "https://dog.ceo/api/breed/mastiff/images/random"
        }

        var photoResponding = await fetch(OrganisingSize[size] || OrganisingSize.medium) //wait
        var valuabledogdata = await response.json()
        return valuabledogdata.message
    } catch (errorM) {
        console.error("womp womp, no dogs today:", errorM)
    }
}