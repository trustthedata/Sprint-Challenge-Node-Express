const express = require("express");
const server = express();

const actions = require("./data/helpers/actionModel");
const projects = require("./data/helpers/projectModel");

server.use(express.json());

const errorHandler = (status, message, res) => {
  return res.status(status).json({ error: message });
};

//CRUD Operations: Actions
server.get("/api/actions", (req, res) => {
  actions
    .get()
    .then(actions => {
      res.json({ actions });
    })
    .catch(error => {
      errorHandler(500, "The actions could not be retrieved.", res);
    });
});

server.get("/api/actions/:id", (req, res) => {
  const { id } = req.params;
  actions
    .get(id)
    .then(action => {
      if (action.length === 0) {
        errorHandler(
          404,
          "The action with the specified ID does not exist.",
          res
        );
      } else {
        res.json({ action });
      }
    })
    .catch(error => {
      errorHandler(500, "The action could not be retrieved.", res);
    });
});

server.post("/api/actions", (req, res) => {
  const { project_id, description, notes, completed } = req.body;
  if (!project_id || !description) {
    //Still need to not allow post to go through if project_id does not exist yet.
    errorHandler(
      400,
      "Please provide a project id and description for the action.",
      res
    );
  } else {
    actions
      .insert({ project_id, description, notes, completed })
      .then(response => {
        res.status(201).json({ response });
      })
      .catch(error => {
        errorHandler(500, "The action could not be saved.", res);
      });
  }
});

server.delete("/api/actions/:id", (req, res) => {
  const { id } = req.params;
  actions
    .remove(id)
    .then(response => {
      if (response === 0) {
        errorHandler(
          404,
          "The action with the specified ID does not exist.",
          res
        );
      } else {
        res.json({ response });
      }
    })
    .catch(error => {
      errorHandler(500, "The action could not be deleted.", res);
    });
});

server.put("/api/actions/:id", (req, res) => {
  const { project_id, description, notes, completed } = req.body;
  const { id } = req.params;
  if (!project_id || !description) {
    errorHandler(
      400,
      "Please provide a project id and description for the action.",
      res
    );
  } else {
    actions
      .update(id, { project_id, description, notes, completed })
      .then(response => {
        if (response.length === 0) {
          errorHandler(
            404,
            "The action with the specified ID does not exist.",
            res
          );
        } else {
          actions
            .get(id)
            .then(action => {
              res.json({ action });
            })
            .catch(error => {
              errorHandler(500, "The action could not be retrieved.", res);
            });
        }
      })
      .catch(error => {
        errorHandler(500, "The action could not be updated.", res);
      });
  }
});

//CRUD Operations: Projects
server.get("/api/projects", (req, res) => {
  projects
    .get()
    .then(projects => {
      res.json({ projects });
    })
    .catch(error => {
      errorHandler(500, "The project information could not be retrieved.", res);
    });
});

server.get("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  projects
    .get(id)
    .then(project => {
      if (project.length === 0) {
        errorHandler(
          404,
          "The project with the specified ID does not exist.",
          res
        );
      } else {
        res.json({ project });
      }
    })
    .catch(error => {
      errorHandler(500, "The project information could not be retrieved.", res);
    });
});

server.get("/api/projects/:project_id/actions", (req, res) => {
  const { project_id } = req.params;
  projects
    .getProjectActions(project_id)
    .then(actions => {
      res.json({ actions });
    })
    .catch(error => {
      errorHandler(
        500,
        "The actions at this project id could not be retrieved."
      );
    });
});

server.post("/api/projects", (req, res) => {
  const { name, description, completed } = req.body;
  if (!name || !description) {
    errorHandler(
      400,
      "Please provide a name and description for the project.",
      res
    );
  } else {
    projects
      .insert({ name, description })
      .then(project => {
        res.status(201).json(project);
      })
      .catch(error => {
        errorHandler(
          500,
          "There was an error while saving the project to the database.",
          res
        );
      });
  }
});

server.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  projects
    .remove(id)
    .then(response => {
      if (response === 0) {
        errorHandler(
          404,
          "The project with the specified ID does not exist.",
          res
        );
      } else {
        res.json({ response });
      }
    })
    .catch(error => {
      errorHandler(500, "The project could not be removed.", res);
    });
});

server.put("/api/projects/:id", (req, res) => {
  const { name, description, completed } = req.body;
  const { id } = req.params;
  if (!name || !description) {
    errorHandler(
      400,
      "Please provide a name and description for the project.",
      res
    );
  } else {
    projects
      .update(id, { name, description, completed })
      .then(response => {
        if (response === 0) {
          errorHandler(
            404,
            "The project with the specified ID does not exist.",
            res
          );
        } else {
          projects
            .get(id)
            .then(post => {
              res.json({ post });
            })
            .catch(error => {
              errorHandler(
                500,
                "The project information could not be retrieved.",
                res
              );
            });
        }
      })
      .catch(error => {
        errorHandler(500, "The project could not be modified.", res);
      });
  }
});

server.listen(5000, () => console.log("The server is now on!"));
