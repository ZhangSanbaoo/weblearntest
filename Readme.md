To install all dependencies, you need to run `npm install` in the root directory, and then use `nodemon run app.js` to start the server. You can open the web page by connecting to `localhost:3000`.

If you don't login, you can't go to other pages.

On the login page, you can use `admin` as both the username and password to log in. You can also use `admin` as both the username and password for validation on the student's personal page.

The register function on the login page is not yet implemented. I'm trying to work on it but I don't have enough time. I'm stuck on setting different operations for different buttons on the same page. The Home page has a music player, which needs to be actively clicked to play music. You can adjust the volume and set it to loop, but the song list is not implemented. When you return to the Home page from other pages, you need to click play to continue playing. There is a bug with the mouse dragging in the music player, it moves up and does not drag down.

I managed to connect to the mongodb server when I did the tp, but given that the database is local, I used the csv method for storage informations.

By sending a GET request to the API link through Insomnia, you can get all the information for ID 5. Here we can see that the character's name is Jerry Smith, the status is 'alive', the species is 'human', the type is empty, and the gender is 'male' etc.
![[Readme-1686492246860.jpeg]]
