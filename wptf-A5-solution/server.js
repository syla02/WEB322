const projectData = require("./modules/projects");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/solutions/projects", async (req,res)=>{

  try{
    if(req.query.sector){
      let projects = await projectData.getProjectsBySector(req.query.sector);
      console.log(projects);
      (projects.length > 0) ? res.render("projects", {projects: projects}) : res.status(404).render("404", {message: `No projects found for sector: ${req.query.sector}`});
  
    }else{
      let projects = await projectData.getAllProjects();
      res.render("projects", {projects: projects});
    }
  }catch(err){
    res.status(404).render("404", {message: err});
  }

});

app.get("/solutions/projects/:id", async (req,res)=>{
  try{
    let project = await projectData.getProjectById(req.params.id);
    console.log(project);
    res.render("project", {project: project})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});

app.get("/solutions/addProject", async (req, res) => {
  let sectors = await projectData.getAllSectors()
  res.render("addProject", { sectors: sectors })
});

app.post("/solutions/addProject", async (req, res) => {
  
  try {
    await projectData.addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }

});

app.get("/solutions/editProject/:id", async (req, res) => {

  try {
    let project = await projectData.getProjectById(req.params.id);
    let sectors = await projectData.getAllSectors();

    res.render("editProject", { project, sectors });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }

});

app.post("/solutions/editProject", async (req, res) => {

  try {
    await projectData.editProject(req.body.id, req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

app.get("/solutions/deleteProject/:id", async (req, res) => {
  try {
    await projectData.deleteProject(req.params.id);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
})

app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

projectData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});