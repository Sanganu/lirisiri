/* Assignment:LIRI Bot - Week:10 */
/* Main Program - to validate the input parameters and call the respective application */
/* Code By Sangeetha**/
/* This application takes arguments in command line and performs action
 it also reads commands from file and executes it */
 /* files - liriv2.js,liricommands.tx,lirilogfile.txt  */
 /* Liri Version two */

// Global variables
var logfile = require('fs');
require('dotenv').config();

/* The folllowing code is added to delete the log contents of the previous session
Since I dont want a giant log file while I develop the application - it makes hard to debug */
logfile.writeFile("lirilogfile.txt",``,function(err)
{
  if (err)
  {
    console.log('Error in creating log file');
  }
});
/* The Above code can be deleted if we need to maitain log files thru out sessions */


//Log file about starting the application - this errases the previos login log file session
createlog(`Application Started`);
takeaction();
//Log file about exiting the application
createlog(`Exiting Application`);

//function takeaction
function takeaction()
{
      var inputlen = process.argv.length ;
      var album;
      var movie;
      var fs = require("fs");
      if (inputlen <3)
      {
        console.log("\nInsufficient Arguments");
        console.log("\nPlease you one of the following formats");
        console.log("\n$node liri.js my-tweets");
        console.log("\n$node liri.js spotify-this-song I want it that way");
        console.log("\n$node liri.js movie-this Bajirao Mastani");
        console.log("\n$node liri.js do-what-it-says");
        // Adding to Log file the Application exited on Insufficient arguments
        createlog(`Insufficient arrguments Application Stoped`);
      }
      else
      {
                //console.log("args ok");
                if ( process.argv[2] === 'my-tweets')
                {
                      //console.log("mytweets");
                        gettweets();
                        //Adding to command file for do-what-it-says
                          fs.appendFile("liricommands.txt",`${process.argv[2]},`,function(error){
                            if(error)
                            {
                              console.log('Error in appending to file',error);
                            }
                          });  //End of file appending

                } //end of tweets
                 else if ( process.argv[2] === 'spotify-this-song')
                   {
                      if( inputlen === 3)
                      {
                        album = 'Let it go';
                      }
                      else {
                             var len = process.argv.length;
                             album = "";
                             for(var i = 3 ; i<len; i++)
                             {
                               album = album +" "+ process.argv[i];
                             }
                            album = album.trim();
                      } //end of spotify album name
                      //console.log('album',album);
                      getmusic(album);

                      //Adding commands to command file do-what it says
                      fs.appendFile("liricommands.txt",`${process.argv[2]},${album},`,function(error){
                        if(error)
                        {
                          console.log('Error in appending to file',error);
                        }
                      });  //End of file appending
                  } //end of spotify
                else if( process.argv[2] === 'movie-this')
                {
                      if( inputlen === 3)
                      {
                        movie = 'Bajirao Mastani';
                      }
                      else {
                        var len = process.argv.length;
                        movie ="";
                        for(var i = 3 ; i<len; i++)
                        {
                          movie = movie +" "+process.argv[i];
                        }
                       movie = movie.trim();
                     } //end of movie name
                     console.log('Movie name',movie);
                       getmoviereview(movie);
                       //Adding commands to command file for do what it says
                      fs.appendFile("liricommands.txt",`${process.argv[2]},${movie},`,function(error){
                        if(error)
                        {
                          console.log('Error in appending to file',error);
                        }
                        console.log('Writing to log file');
                      });  //End of file appending
                }
               else if ( process.argv[2] === 'do-what-it-says')
               {

                   getfilecommands();

               }
               else {
                 console.log("\nPlease use one of the following formats");
                 console.log("\n$node liri.js my-tweets");
                 console.log("\n$node liri.js spotify-this-song Lane Boy");
                 console.log("\n$node liri.js movie-this Speed");
                 console.log("\n$node liri.js do-what-it-says");
               }
      } //end of process argv count

}

function getmusic(album_name)
{
        var spotify = require('node-spotify-api');
        var myspotify = new spotify({
                   id:process.env.SPOTIFY_ID ,
                  secret: process.env.SPOTIFY_SECRET,
                });
                //Log file about placing an API call with the credentials info
                createlog(`Call placed in Spotify API with credentials\n ${myspotify}, type:track, query:${album_name}, limit:1`);
                //log file
        myspotify.search({type: 'track',query:album_name,limit:1},function(error,response){
                 if(error)
                 {
                   console.log(error,'Error encountered');
                       //Log file if API call encountered error
                      createlog(`Error from  spotify API \n ${error}`)
                       //log file
                 }
                 else {
                         // console.log(JSON.stringify(data,null,2));
                         console.log('\nThe Details of the Album');
                         console.log('--------------------------------------------------------------------------');
                        console.log(`\nArtist Name: ${response.tracks.items[0].album.artists[0].name}`);
                         console.log(`\nAlbum Name: ${response.tracks.items[0].name}`);
                         console.log(`\nURL: ${response.tracks.items[0].external_urls.spotify}`)
                         console.log(`\n`);
                         //Log file about the response from api call
                         createlog(`Response from  spotify API \n ${response}`)
                         //log file
                 }
        }); //end of myspotify callback
} //end of function






function getmoviereview(mvname)
{
        var omdb = require("request");
        var queryurl = "http://www.omdbapi.com/?t="+mvname+"&plot=short&apikey=40e9cece";
        console.log("Movie Review");
         console.log('--------------------------------------------------------------------------');
         //Log file about placing an API call with the credentials info
        createlog(`Call placed in Omdb API with credentials\n ${queryurl}`);
         //log file
         console.log(queryurl)
        omdb(queryurl, function(error, response, body) {
          if (!error && response.statusCode === 200)
          {
                console.log('Title: '+JSON.parse(body).Title);
                console.log('Director: '+JSON.parse(body).Director);
                console.log('Writer: '+JSON.parse(body).Writer);
                console.log('Rating: '+JSON.parse(body).imdbRating);
                 console.log('Actors: '+JSON.parse(body).Actors);
                 console.log('Production: '+JSON.parse(body).Production)
                 console.log('Website: '+JSON.parse(body).Website)
                 //Log file about response from omdbapi
                 createlog(`Response from  omdbapi API  \n${response}`);
                 //log file
          }
          else {
            console.log("Error in gettin API response",error);
                //Log file about error resulted from omdbapi call
                createlog(`Error from omdbapi API @  \n ${error}`);
                //log file
          }
       });
};
function gettweets()
{
         var Twitter = require('twitter');
         var mytwitter = new Twitter({
                        consumer_key : process.env.TWITTER_CONSUMER_KEY,
                        consumer_secret :process.env.TWITTER_CONSUMER_SECRET,
                        access_token_key : process.env.TWITTER_ACCESS_TOKEN_KEY,
                      access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
                    });
                      //Log file about placing an API call with the credentials info
                    createlog(`\nCall placed in Twitter API with credentials\n ${mytwitter}, statuses/user_timeline`);
                    //log file

                    //console.log(mytwitter);
                    
                    
                    mytwitter.get('statuses/user_timeline', function(error, tweets, response) {


            if (!error && response.statusCode === 200) {
                              //Log file response from twitter api
                              createlog(`Response from  Twitter API  \n ${tweets}`)
                              //log file
                          var len = 0;
                          if (tweets.length > 21)
                          {
                            len = 20;
                          }
                          else {
                            len = tweets.length;
                          }
                          console.log("\nTwitter Updates");
                          console.log('--------------------------------------------------------------------------');

                           for (var i  =0 ; i < len ; i++)
                           {
                             var create = tweets[i].created_at;
                             var mytext = tweets[i].text;
                             console.log('\n','Tweets: ',mytext,'Date : ',create);
                           } //End of for loop


               }//End of if
            if (error)
            {
               //throw error ;
               console.log("Error in fetching twitter API",error);
                    //Log file about error from twitter api call
                    createlog(`Error from  Twitter API \n ${error}`);
                    //log file
            }
          }); //end of mytwitter callback

} //end of function gettweets

function getfilecommands()
{
        var fsr = require("fs");
        fsr.readFile("liricommands.txt","utf8",function(error,data)
        {
            if(error)
            {
              console.log("Error reading file",error);
              //Log file if error reulted in reading command file
              createlog(`Errorin reading liricommands.txt file - \n ${error}`);
              //Log
            }
            else
            {
                  //log file
                   createlog(`Executing Commands liricommands.txt file for the user selection do-what-it-says`);
                   //log file
                    var content = (data.trim().toString()).split(',');
                    if(content.length === 0)
                    {
                      console.log("File Empty");
                    }
                    else
                    {
                           console.log("Executing commands from file");
                            console.log('--------------------------------------------------------------------------');
                            for(var i = 0; i < content.length ; i++)
                            {

                                 if (content[i] === 'my-tweets')
                                  {
                                    gettweets();
                                  }
                                  else if ( content[i] === 'spotify-this-song')
                                  {
                                      getmusic(content[i+1]);
                                  }
                                  else if( content[i] === 'movie-this')
                                  {
                                    console.log(i,content[i]);
                                    console.log(i+1,content[i+1]);

                                      getmoviereview(content[i+1]);
                                  }
                            } //end of for loop

                    } // end of else for file content check
              }// end of else for error in readinf file
        }); //end file read
} //end of function getfilecommands

//function to write log file

function createlog(str)
{
  //Log file
  var justnow = new Date();
  var dtime = justnow.getMonth()+"/"+justnow.getDate()+"/"+justnow.getFullYear()+ "  "+justnow.getHours()+":"+justnow.getMinutes()+":"+justnow.getSeconds()+":"+justnow.getMilliseconds();
  logfile.appendFile("lirilogfile.txt",`\n@${dtime}: ${str}`,function(err)
  {
    if (err)
    {
      console.log('Error in creating log file');
    }
  });
  //log file
}
//End of function create log file