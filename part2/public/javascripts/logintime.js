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


async function DOGDISPLAY() //displays the information from users and dogs into a set table via index.html
{
    try {
        var callingidea = await fetch("/api/dogs") //fetches via app.js for dog tied info
        if (!callingidea.ok) throw new Error("did get no dogs here") //checks it

        var doggies = await callingidea.json() //saves it to a json
        console.log("Dogs received, over.", doggies) //logs it if it passes

        var DogListing = document.getElementById("DOGGYLIST") //gets the id for the list to be modified and inputted
        DogListing.innerHTML = ""

        for (var dog of doggies) //loops through each registered dog and applies the relevant information across it all
        {
            try {
            var URLPHOTO = await DOGPHOTOFIND(dog.size)
            var rowing = document.createElement("tr")
            rowing.innerHTML = `
             <td>${dog.dog_id}</td>
             <td>${dog.name}</td>
             <td>${dog.size}</td>
             <td>${dog.owner_name}</td>
             <td><img src="${URLPHOTO}" class="dog-photoing"></td>
             `
            DogListing.appendChild(rowing) //adds it to the <tr> tag within the table
            } catch (errorP) {
                console.error("photo of dog no come yet", errorP) //catches it
            }
        }


        document.getElementById("TABLEFORDOGS").style.display = "block" //unhides the table to show the information
        } catch (errorM) {
            console.error("womp womp, no dogs today:", errorM) //another error catcher if all fails
    }


}

async function DOGPHOTOFIND(size) 
{
    try {
        var OrganisingSize =
        {
            small: "https://dog.ceo/api/breeds/image/random",
            medium: "https://dog.ceo/api/breeds/image/random",
            large: "https://dog.ceo/api/breed/mastiff/images/random"
        }

        var photoResponding = await fetch(OrganisingSize[size] || OrganisingSize.medium) //wait
        var valuabledogdata = await photoResponding.json()
        return valuabledogdata.message
    } catch (errorM) {
        console.error("womp womp, no dogs today:", errorM)
        return "https://images.dog.ceo/breeds/affenpinscher/n02110627_11614.jpg"
    }
}

document.addEventListener("DOMContentLoaded", DOGDISPLAY) //loads the function first on page load so that an empty table isn't shown