# Screenshot
![Screenshot 2024-08-07 at 08-21-53 Sign in to myrealm](https://github.com/user-attachments/assets/582a2fea-ca02-4e49-9cb2-d5e386339824)

# Testing the theme locally

[Documentation](https://docs.keycloakify.dev/v/v10/testing-your-theme)

# How to customize the theme

[Documentation](https://docs.keycloakify.dev/v/v10/customization-strategies)

# Building the theme

You need to have Maven installed to build the theme (The `mvn` command must be in the PATH).

-   On macOS: `brew install maven`
-   On Debian/Ubuntu: `sudo apt-get install maven`
-   On Windows: `choco install openjdk` and `choco install maven` (Or download from [here](https://maven.apache.org/download.cgi))

```bash
npm run build-keycloak-theme
```

Note that by default Keycloakify generates multiple .jar files for different versions of Keycloak.  
You can customize this behavior, see documentation [here](https://docs.keycloakify.dev/v/v10/targetting-specific-keycloak-versions).
