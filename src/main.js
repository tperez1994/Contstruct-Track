import './style.css'

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
        <a class="nav-item" href="#">
          <span>＋</span> New Project
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-avatar">TP</div>
        <div>
          <strong>Project Manager</strong>
          <p>Construct Track</p>
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

        <button class="primary-button" id="newProjectButton">
          + New Project
        </button>
      </header>

      <section class="stats-grid">
        <div class="stat-card">
          <p>Total Projects</p>
          <h2 id="totalProjects">4</h2>
          <span>All tracked projects</span>
        </div>

        <div class="stat-card">
          <p>Active Projects</p>
          <h2 id="activeProjects">2</h2>
          <span>Currently in progress</span>
        </div>

        <div class="stat-card">
          <p>Contract Value</p>
          <h2 id="contractValue">$1.42M</h2>
          <span>Total portfolio value</span>
        </div>

        <div class="stat-card">
          <p>Completed</p>
          <h2 id="completedProjects">1</h2>
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
              </tr>
            </thead>

            <tbody id="projectTable">
              <tr data-status="In Progress">
                <td>
                  <strong>Vero Beach Warehouse</strong>
                  <small>PEMB / Steel Erection</small>
                </td>
                <td>Atlantic Development</td>
                <td>Vero Beach, FL</td>
                <td>$460,000</td>
                <td><span class="status progress">In Progress</span></td>
                <td>Aug 12, 2026</td>
              </tr>

              <tr data-status="Bidding">
                <td>
                  <strong>Savannah Hangar</strong>
                  <small>Aircraft Hangar</small>
                </td>
                <td>Coastal Aviation</td>
                <td>Savannah, GA</td>
                <td>$353,000</td>
                <td><span class="status bidding">Bidding</span></td>
                <td>Oct 15, 2026</td>
              </tr>

              <tr data-status="Awarded">
                <td>
                  <strong>Doral Distribution Center</strong>
                  <small>Pre-Engineered Metal Building</small>
                </td>
                <td>South Florida Logistics</td>
                <td>Doral, FL</td>
                <td>$425,000</td>
                <td><span class="status awarded">Awarded</span></td>
                <td>Nov 2, 2026</td>
              </tr>

              <tr data-status="Complete">
                <td>
                  <strong>West Palm Service Facility</strong>
                  <small>Commercial Renovation</small>
                </td>
                <td>Palm Coast Services</td>
                <td>West Palm Beach, FL</td>
                <td>$182,000</td>
                <td><span class="status complete">Complete</span></td>
                <td>Mar 18, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>

  <div class="modal hidden" id="projectModal">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <p class="eyebrow">NEW PROJECT</p>
          <h2>Add Construction Project</h2>
        </div>
        <button class="close-button" id="closeModal">×</button>
      </div>

      <form id="projectForm">
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
          <input type="date" id="startDate" required />
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
          <button type="button" class="secondary-button" id="cancelProject">
            Cancel
          </button>
          <button type="submit" class="primary-button">
            Save Project
          </button>
        </div>
      </form>
    </div>
  </div>
`

const modal = document.querySelector('#projectModal')
const newProjectButton = document.querySelector('#newProjectButton')
const closeModal = document.querySelector('#closeModal')
const cancelProject = document.querySelector('#cancelProject')
const projectForm = document.querySelector('#projectForm')
const statusFilter = document.querySelector('#statusFilter')

function openProjectModal() {
  modal.classList.remove('hidden')
}

function closeProjectModal() {
  modal.classList.add('hidden')
}

newProjectButton.addEventListener('click', openProjectModal)
closeModal.addEventListener('click', closeProjectModal)
cancelProject.addEventListener('click', closeProjectModal)

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeProjectModal()
  }
})

statusFilter.addEventListener('change', () => {
  const selectedStatus = statusFilter.value
  const rows = document.querySelectorAll('#projectTable tr')

  rows.forEach((row) => {
    const status = row.dataset.status

    if (selectedStatus === 'all' || status === selectedStatus) {
      row.style.display = ''
    } else {
      row.style.display = 'none'
    }
  })
})

projectForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const projectName = document.querySelector('#projectName').value
  const client = document.querySelector('#client').value
  const location = document.querySelector('#location').value
  const value = Number(document.querySelector('#value').value)
  const status = document.querySelector('#projectStatus').value
  const startDate = document.querySelector('#startDate').value

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

  const formattedDate = new Date(
    `${startDate}T00:00:00`
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const statusClass = {
    Bidding: 'bidding',
    Awarded: 'awarded',
    'In Progress': 'progress',
    Complete: 'complete',
  }[status]

  const row = document.createElement('tr')
  row.dataset.status = status

  row.innerHTML = `
    <td>
      <strong>${projectName}</strong>
      <small>Construction Project</small>
    </td>
    <td>${client}</td>
    <td>${location}</td>
    <td>${formattedValue}</td>
    <td>
      <span class="status ${statusClass}">${status}</span>
    </td>
    <td>${formattedDate}</td>
  `

  document.querySelector('#projectTable').prepend(row)

  projectForm.reset()
  closeProjectModal()
})