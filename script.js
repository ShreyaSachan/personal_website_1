const GITHUB_USER = "shreyasachan2002";
const REPO = "personal_website";
const BRANCH = "main";
const DATA_FILE = "data.json";

// **IMPORTANT**: For testing, you can put your PAT here. For production, use a secure server-side proxy or GitHub OAuth.
const GITHUB_TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN"; // Keep this private

let data = { projects: [], papers: [], blogs: [] };
let blogCount = 0;

// Load data from GitHub
async function loadData() {
  const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/${BRANCH}/${DATA_FILE}`;
  const res = await fetch(url);
  data = await res.json();
  renderAll();
}

// Render all sections
function renderAll() {
  renderProjects();
  renderPapers();
  renderBlogs();
}

// Projects
function renderProjects() {
  const container = document.getElementById("projectsContainer");
  container.innerHTML = "";
  data.projects.forEach((p, i) => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card p-3">
        <h5>${p.title}</h5>
        <p>${p.desc}</p>
        <button class="btn btn-sm btn-warning" onclick="editProject(${i})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProject(${i})">Delete</button>
      </div>
    `;
    container.appendChild(col);
  });
}

// Papers
function renderPapers() {
  const container = document.getElementById("papersContainer");
  container.innerHTML = "";
  data.papers.forEach((p, i) => {
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <div class="card p-3">
        <h5>${p.title}</h5>
        <p>${p.desc}</p>
        <button class="btn btn-sm btn-warning" onclick="editPaper(${i})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deletePaper(${i})">Delete</button>
      </div>
    `;
    container.appendChild(col);
  });
}

// Blogs
function renderBlogs() {
  const container = document.getElementById("blogAccordion");
  container.innerHTML = "";
  data.blogs.forEach((b, i) => {
    const blogId = "collapseBlog" + i;
    const headingId = "headingBlog" + i;
    const item = document.createElement("div");
    item.className = "accordion-item";
    item.innerHTML = `
      <h2 class="accordion-header" id="${headingId}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${blogId}">
          ${b.title}
        </button>
      </h2>
      <div id="${blogId}" class="accordion-collapse collapse" data-bs-parent="#blogAccordion">
        <div class="accordion-body">
          ${b.content}
          <br>
          <button class="btn btn-sm btn-warning mt-2" onclick="editBlog(${i})">Edit</button>
          <button class="btn btn-sm btn-danger mt-2" onclick="deleteBlog(${i})">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

// Add/Edit/Delete functions
async function addProject() {
  const title = prompt("Project Title:");
  const desc = prompt("Project Description:");
  if(title && desc) {
    data.projects.push({title, desc});
    await pushData();
    renderProjects();
  }
}

async function editProject(i) {
  const title = prompt("Edit Title:", data.projects[i].title);
  const desc = prompt("Edit Description:", data.projects[i].desc);
  if(title && desc) {
    data.projects[i] = {title, desc};
    await pushData();
    renderProjects();
  }
}

async function deleteProject(i) {
  if(confirm("Delete this project?")) {
    data.projects.splice(i,1);
    await pushData();
    renderProjects();
  }
}

async function addPaper() {
  const title = prompt("Paper Title:");
  const desc = prompt("Paper Description/Journal Info:");
  if(title && desc) {
    data.papers.push({title, desc});
    await pushData();
    renderPapers();
  }
}

async function editPaper(i) {
  const title = prompt("Edit Title:", data.papers[i].title);
  const desc = prompt("Edit Description:", data.papers[i].desc);
  if(title && desc) {
    data.papers[i] = {title, desc};
    await pushData();
    renderPapers();
  }
}

async function deletePaper(i) {
  if(confirm("Delete this paper?")) {
    data.papers.splice(i,1);
    await pushData();
    renderPapers();
  }
}

async function addBlog() {
  const title = prompt("Blog Title:");
  const content = prompt("Blog Content:");
  if(title && content) {
    data.blogs.push({title, content});
    await pushData();
    renderBlogs();
  }
}

async function editBlog(i) {
  const title = prompt("Edit Title:", data.blogs[i].title);
  const content = prompt("Edit Content:", data.blogs[i].content);
  if(title && content) {
    data.blogs[i] = {title, content};
    await pushData();
    renderBlogs();
  }
}

async function deleteBlog(i) {
  if(confirm("Delete this blog?")) {
    data.blogs.splice(i,1);
    await pushData();
    renderBlogs();
  }
}

// Push updated data.json to GitHub
async function pushData() {
  const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO}/contents/${DATA_FILE}`;

  // Get the current SHA of data.json
  const res = await fetch(apiUrl, {
    headers: {
      "Authorization": "token " + GITHUB_TOKEN,
      "Accept": "application/vnd.github.v3+json"
    }
  });
  const json = await res.json();
  const sha = json.sha;

  // Update data.json
  await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Authorization": "token " + GITHUB_TOKEN,
      "Accept": "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: "Update portfolio data",
      content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
      sha: sha,
      branch: BRANCH
    })
  });
}

// Event listeners
document.getElementById("addProjectBtn").addEventListener("click", addProject);
document.getElementById("addPaperBtn").addEventListener("click", addPaper);
document.getElementById("addBlogBtn").addEventListener("click", addBlog);

// Initial load
loadData();

