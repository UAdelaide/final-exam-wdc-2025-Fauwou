


  
        async LOGINNOW() { //login function prepared to run on click
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
                error.Element.textContent = "Wrong username or password inputted, thanks."
                error.Element.classList.remove("")
            }
          }
          catch (errorM) { //catch error for if the login doesn't work
            errorElement.textContent = "Login could not succeed because it failed. Try again."
            errorElement.classList.remove("")
          }
        }
      }
    })