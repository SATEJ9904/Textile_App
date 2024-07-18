const getAPIData = async () => {
  try {
      const url = "https://textileapp.microtechsolutions.co.in/php/getappuser.php";
      let result = await fetch(url);
      result = await result.json();

      result.length ? result.map((item) => {
          (() => {

              if (Password === item.Password) {
                  console.log("successful")
              } else {
              }
          })()
      }
      ) : null
  } catch (error) {
      console.log("Error", error)
  }
}