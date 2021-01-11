import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, generateJWT, requireAuth} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
//https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1cCKSE.img
  //! END @TODO1
  app.get( "/filteredimage/", async(  req, res) => {
    let { image_url } = req.query;

    if ( !image_url ) {
      return res.status(400)
                .send(`image_url is required...<br><br><a href='http://localhost:8082/filteredimage?image_url=https://cdn.cnn.com/cnnnext/dam/assets/210108165723-23-us-capitol-riots-0106-medium-tease.jpg'>Example</a>`);
    }

    const fileName = await filterImageFromURL(image_url);
    return res.status(200)
              .sendFile(fileName,() => {
                deleteLocalFiles([fileName]);
              });
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  //Student added functinality  -------------------
  app.get( "/generateToke/", async(  req, res) => {
    let { password } = req.query;

    if ( !password ) {
      return res.status(400)
                .send(`password is requried.<br><br><a href='http://localhost:8082/generateToke?password=hello'>Example</a>`);
    }
    const token = await generateJWT(password);
    const message:string = "Use the following token generated for the password: " + password + '<br>Token: ' + token;
    return res.status(200)
              .send(message);
  } );

  app.get('/verification', 
    requireAuth, 
    async ( req, res) => {
        return res.status(200).send({ auth: true, message: 'Authenticated.' });
});
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();