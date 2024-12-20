const express = require('express');
const path = require("path");
const projectData = require("./modules/projects");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/solutions/projects/:id?", async (req, res) => {
  try {
    if (req.params.id) {
      let project = await projectData.getProjectById(req.params.id);
      res.render("project", { project: project, isProjectPage: true });
    } else {
     
      let projects;
      if (req.query.sector) {
        projects = await projectData.getProjectsBySector(req.query.sector);
        if (projects.length === 0) {
          return res.status(404).render("404", { message: "No projects found for the specified sector." });
        }
      } else {
        projects = await projectData.getAllProjects();
      }
      res.render("project", { projects: projects, isProjectPage: false });
    }
  } catch (err) {
    res.status(404).render("404", { message: "Unable to retrieve projects." });
  }
});


app.use((req, res) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for." });
});


projectData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
  });
});
