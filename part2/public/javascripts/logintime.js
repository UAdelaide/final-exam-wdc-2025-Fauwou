


    createApp({
      data() {
        return {
          username: "", //given information by user when attempting to log in
          password: "",
          error: "",
          message: 'Welcome to the Dog Walking Service!'
        };
      },
      methods: {

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
            }

          }
          catch (errorM) { //catch error for if the login doesn't work
            this.error = "Login could not succeed because it failed."
          }
        }
      }
    }).mount('#app');