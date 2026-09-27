import './style.css'
import { supabase } from '../supabase.js'

// --------------------------------------------------
// CONSTRUCT TRACK
// --------------------------------------------------

async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

function statusClass(status) {
  return {
    Bidding: 'bidding',
    Awarded: 'awarded',
    'In Progress': 'progress',
    Complete: 'complete',
  }[status] || 'bidding'
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatDate(date) {
  if (!date) return ''

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// --------------------------------------------------
// AUTHENTICATION
// --------------------------------------------------

async function startApp() {
  const user = await getCurrentUser()

  if (user) {
    showDashboard(user)
  } else {
    showAuthScreen()
  }
}

function showAuthScreen() {
  document.querySelector('#app').innerHTML = `
    <div class="auth-page">
      <div class="auth-card">

        <div class="auth-brand">
          <div class="brand-icon">CT</div>
          <div>
            <h2>Construct Track</h2>
            <span>Project Management</span>
          </div>
        </div>

        <h1>Welcome</h1>

        <p class="auth-subtitle">
          Sign in to manage your construction projects.
        </p>

        <form id="authForm">

          <label>
            Email
            <input
              type="email"
              id="authEmail"
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              id="authPassword"
              placeholder="Password"
              minlength="6"
              required
            />
          </label>

          <div class="auth-actions">

            <button
              type="submit"
              class="primary-button"
            >
              Log In
            </button>

            <button
              type="button"
              class="secondary-button"
              id="signupButton"
            >
              Create Account
            </button>

          </div>

          <p id="authMessage"></p>

        </form>
      </div>
    </div>
  `

  const authForm = document.querySelector('#authForm')
  const signupButton = document.querySelector('#signupButton')
  const authMessage = document.querySelector('#authMessage')

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const email = document.querySelector('#authEmail').value
    const password = document.querySelector('#authPassword').value

    authMessage.textContent = 'Signing in...'

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      authMessage.textContent = error.message
      return
    }

    window.location.reload()
  })

  signupButton.addEventListener('click', async () => {
    const email = document.querySelector('#authEmail').value
    const password = document.querySelector('#authPassword').value

    if (!email || !password) {
      authMessage.textContent =
        'Enter an email and password first.'
      return
    }

    authMessage.textContent = 'Creating account...'

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      authMessage.textContent = error.message
      return
    }

    authMessage.textContent =
      'Account created successfully. You can now log in.'
  })
}

// --------------------------------------------------
// DASHBOARD
// --------------------------------------------------

function showDashboard(user) {
  document.querySelector('#app').innerHTML = `
    <div class="app">

      <aside class="sidebar">

        <div class="brand">
          <div class="brand-icon">CT</div>

          <div>
            <h2>Construct Track</h2>
            <span>Project Management</span>
          </div>
        </div>

        <nav>

          <a class="nav-item active" href="#">
            <span>▦</span> Dashboard
          </a>

          <a class="nav-item" href="#">
            <span>▤</span> Projects
          </a>

          <a class="nav-item" href="#" id="sidebarNewProject">
            <span>＋</span> New Project
          </a>

        </nav>

        <div class="sidebar-footer">

          <div class="user-avatar">TP</div>

          <div>
            <strong>Project Manager</strong>
            <p>Construct Track</p>

            <button
              id="logoutButton"
              class="secondary-button"
              type="button"
            >
              Log Out
            </button>
          </div>

        </div>

      </aside>

      <main class="main-content">

        <header>

          <div>
            <p class="eyebrow">PROJECT OVERVIEW</p>

            <h1>Construction Dashboard</h1>

            <p class="subtitle">
              Track projects, contract values, schedules, and progress.
            </p>
          </div>

          <button
            class="primary-button"
            id="newProjectButton"
          >
            + New Project
          </button>

        </header>

        <section class="stats-grid">

          <div class="stat-card">
            <p>Total Projects</p>
            <h2 id="totalProjects">0</h2>
            <span>All tracked projects</span>
          </div>

          <div class="stat-card">
            <p>Active Projects</p>
            <h2 id="activeProjects">0</h2>
            <span>Currently in progress</span>
          </div>

          <div class="stat-card">
            <p>Contract Value</p>
            <h2 id="contractValue">$0</h2>
            <span>Total portfolio value</span>
          </div>

          <div class="stat-card">
            <p>Completed</p>
            <h2 id="completedProjects">0</h2>
            <span>Finished projects</span>
          </div>

        </section>

        <section class="projects-section">

          <div class="section-heading">

            <div>
              <h2>Projects</h2>
              <p>Manage your current construction portfolio.</p>
            </div>

            <select id="statusFilter">
              <option value="all">All Projects</option>
              <option value="Bidding">Bidding</option>
              <option value="Awarded">Awarded</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>

          </div>

          <div class="project-table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Location</th>
                  <th>Contract Value</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody id="projectTable"></tbody>

            </table>

          </div>

        </section>

      </main>

    </div>

    <div
      class="modal hidden"
      id="projectModal"
    >

      <div class="modal-card">

        <div class="modal-header">

          <div>
            <p class="eyebrow" id="modalEyebrow">
              NEW PROJECT
            </p>

            <h2 id="modalTitle">
              Add Construction Project
            </h2>
          </div>

          <button
            class="close-button"
            id="closeModal"
            type="button"
          >
            ×
          </button>

        </div>

        <form id="projectForm">

          <input
            type="hidden"
            id="editingProjectId"
          />

          <label>
            Project Name

            <input
              type="text"
              id="projectName"
              placeholder="Project name"
              required
            />
          </label>

          <label>
            Client

            <input
              type="text"
              id="client"
              placeholder="Client or company"
              required
            />
          </label>

          <label>
            Location

            <input
              type="text"
              id="location"
              placeholder="City, State"
              required
            />
          </label>

          <label>
            Contract Value

            <input
              type="number"
              id="value"
              placeholder="250000"
              required
            />
          </label>

          <label>
            Status

            <select id="projectStatus">
              <option>Bidding</option>
              <option>Awarded</option>
              <option>In Progress</option>
              <option>Complete</option>
            </select>
          </label>

          <label>
            Start Date

            <input
              type="date"
              id="startDate"
              required
            />
          </label>

          <label class="full-width">
            Project Notes

            <textarea
              id="notes"
              rows="4"
              placeholder="Scope, schedule, project notes..."
            ></textarea>
          </label>

          <div class="form-actions full-width">

            <button
              type="button"
              class="secondary-button"
              id="cancelProject"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="primary-button"
              id="saveProjectButton"
            >
              Save Project
            </button>

          </div>

        </form>

      </div>

    </div>
  `

  setupDashboardEvents(user)
  loadProjects(user)
}

// --------------------------------------------------
// DASHBOARD EVENTS
// --------------------------------------------------

function setupDashboardEvents(user) {
  const modal = document.querySelector('#projectModal')
  const projectForm = document.querySelector('#projectForm')
  const statusFilter = document.querySelector('#statusFilter')

  function openProjectModal() {
    document.querySelector('#editingProjectId').value = ''
    document.querySelector('#modalEyebrow').textContent = 'NEW PROJECT'
    document.querySelector('#modalTitle').textContent =
      'Add Construction Project'

    document.querySelector('#saveProjectButton').textContent =
      'Save Project'

    projectForm.reset()
    modal.classList.remove('hidden')
  }

  function closeProjectModal() {
    modal.classList.add('hidden')
    projectForm.reset()
    document.querySelector('#editingProjectId').value = ''
  }

  document
    .querySelector('#newProjectButton')
    .addEventListener('click', openProjectModal)

  document
    .querySelector('#sidebarNewProject')
    .addEventListener('click', (event) => {
      event.preventDefault()
      openProjectModal()
    })

  document
    .querySelector('#closeModal')
    .addEventListener('click', closeProjectModal)

  document
    .querySelector('#cancelProject')
    .addEventListener('click', closeProjectModal)

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeProjectModal()
    }
  })

  document
    .querySelector('#logoutButton')
    .addEventListener('click', async () => {
      await supabase.auth.signOut()
      window.location.reload()
    })

  statusFilter.addEventListener('change', () => {
    const selectedStatus = statusFilter.value
    const rows = document.querySelectorAll('#projectTable tr')

    rows.forEach((row) => {
      const rowStatus = row.dataset.status

      if (
        selectedStatus === 'all' ||
        rowStatus === selectedStatus
      ) {
        row.style.display = ''
      } else {
        row.style.display = 'none'
      }
    })
  })

  projectForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const editingProjectId =
      document.querySelector('#editingProjectId').value

    const projectData = {
      user_id: user.id,
      project_name:
        document.querySelector('#projectName').value,
      client:
        document.querySelector('#client').value,
      location:
        document.querySelector('#location').value,
      contract_value:
        Number(document.querySelector('#value').value),
      status:
        document.querySelector('#projectStatus').value,
      start_date:
        document.querySelector('#startDate').value,
      notes:
        document.querySelector('#notes').value,
    }

    let error

    if (editingProjectId) {
      const result = await supabase
        .from('Projects')
        .update(projectData)
        .eq('id', editingProjectId)

      error = result.error
    } else {
      const result = await supabase
        .from('Projects')
        .insert(projectData)

      error = result.error
    }

    if (error) {
      console.error(error)
      alert(`Could not save project: ${error.message}`)
      return
    }

    closeProjectModal()
    await loadProjects(user)
  })
}

// --------------------------------------------------
// READ PROJECTS
// --------------------------------------------------

async function loadProjects(user) {
  const { data: projects, error } = await supabase
    .from('Projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    console.error(error)
    alert(`Could not load projects: ${error.message}`)
    return
  }

  renderProjects(projects || [], user)
}

// --------------------------------------------------
// DISPLAY PROJECTS
// --------------------------------------------------

function renderProjects(projects, user) {
  const table = document.querySelector('#projectTable')

  table.innerHTML = ''

  projects.forEach((project) => {
    const row = document.createElement('tr')

    row.dataset.status = project.status

    row.innerHTML = `
      <td>
        <strong>${project.project_name}</strong>
        <small>
          ${project.notes || 'Construction Project'}
        </small>
      </td>

      <td>${project.client}</td>

      <td>${project.location}</td>

      <td>
        ${formatCurrency(project.contract_value)}
      </td>

      <td>
        <span class="status ${statusClass(project.status)}">
          ${project.status}
        </span>
      </td>

      <td>
        ${formatDate(project.start_date)}
      </td>

      <td>
        <button
          class="secondary-button edit-project"
          data-id="${project.id}"
        >
          Edit
        </button>

        <button
          class="secondary-button delete-project"
          data-id="${project.id}"
        >
          Delete
        </button>
      </td>
    `

    table.appendChild(row)
  })

  updateStats(projects)

  document
    .querySelectorAll('.edit-project')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const project = projects.find(
          (item) =>
            String(item.id) === String(button.dataset.id)
        )

        if (project) {
          openEditProject(project)
        }
      })
    })

  document
    .querySelectorAll('.delete-project')
    .forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = window.confirm(
          'Delete this project?'
        )

        if (!confirmed) return

        const { error } = await supabase
          .from('Projects')
          .delete()
          .eq('id', button.dataset.id)

        if (error) {
          console.error(error)
          alert(`Could not delete project: ${error.message}`)
          return
        }

        await loadProjects(user)
      })
    })
}

// --------------------------------------------------
// EDIT PROJECT
// --------------------------------------------------

function openEditProject(project) {
  document.querySelector('#editingProjectId').value =
    project.id

  document.querySelector('#projectName').value =
    project.project_name || ''

  document.querySelector('#client').value =
    project.client || ''

  document.querySelector('#location').value =
    project.location || ''

  document.querySelector('#value').value =
    project.contract_value || ''

  document.querySelector('#projectStatus').value =
    project.status || 'Bidding'

  document.querySelector('#startDate').value =
    project.start_date || ''

  document.querySelector('#notes').value =
    project.notes || ''

  document.querySelector('#modalEyebrow').textContent =
    'EDIT PROJECT'

  document.querySelector('#modalTitle').textContent =
    'Update Construction Project'

  document.querySelector('#saveProjectButton').textContent =
    'Update Project'

  document
    .querySelector('#projectModal')
    .classList.remove('hidden')
}

// --------------------------------------------------
// DASHBOARD STATS
// --------------------------------------------------

function updateStats(projects) {
  const total = projects.length

  const active = projects.filter(
    (project) => project.status === 'In Progress'
  ).length

  const completed = projects.filter(
    (project) => project.status === 'Complete'
  ).length

  const totalValue = projects.reduce(
    (sum, project) =>
      sum + Number(project.contract_value || 0),
    0
  )

  document.querySelector('#totalProjects').textContent =
    total

  document.querySelector('#activeProjects').textContent =
    active

  document.querySelector('#completedProjects').textContent =
    completed

  document.querySelector('#contractValue').textContent =
    formatCurrency(totalValue)
}

// --------------------------------------------------
// START APPLICATION
// --------------------------------------------------

startApp()