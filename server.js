const projectData = require("./modules/projects");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/solutions/projects", async (req,res)=>{

  try{
    if(req.query.sector){
      let projects = await projectData.getProjectsBySector(req.query.sector);
      res.send(projects);
  
    }else{
      let projects = await projectData.getAllProjects();
      res.send(projects);
    }
  }catch(err){
    res.status(404).send(err);
  }

});

app.get("/solutions/projects/:id", async (req,res)=>{
  try{
    let project = await projectData.getProjectById(req.params.id);
    res.send(project);
  }catch(err){
    res.status(404).send(err);
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});


projectData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});