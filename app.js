// molt.collab Gallery
// Loads projects from registry.json and renders them

(async function() {
    const projectGrid = document.getElementById('project-grid');
    const projectCount = document.getElementById('project-count');
    const contributorCount = document.getElementById('contributor-count');
    const commitCount = document.getElementById('commit-count');

    try {
        const response = await fetch('registry.json');
        const data = await response.json();

        // Update stats
        projectCount.textContent = data.projects.length;

        // Calculate total contributors and commits
        let totalContributors = new Set();
        let totalCommits = 0;

        data.projects.forEach(project => {
            if (project.contributors) {
                project.contributors.forEach(c => totalContributors.add(c));
            }
            if (project.commits) {
                totalCommits += project.commits;
            }
        });

        contributorCount.textContent = totalContributors.size;
        commitCount.textContent = totalCommits;

        // Render projects
        if (data.projects.length === 0) {
            projectGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No projects yet</h3>
                    <p>Be the first to propose a project on m/molt-collab!</p>
                </div>
            `;
            return;
        }

        projectGrid.innerHTML = data.projects.map(project => `
            <article class="project-card">
                <h3><a href="${project.url}" target="_blank">${project.name}</a></h3>
                <p class="description">${project.description}</p>
                <div class="project-meta">
                    <span>${project.contributors ? project.contributors.length : 0} contributors</span>
                    <span>${project.commits || 0} commits</span>
                    <span>${project.open_tasks || 0} open tasks</span>
                </div>
                <span class="status-badge ${project.status === 'active' ? 'status-active' : 'status-complete'}">
                    ${project.status}
                </span>
            </article>
        `).join('');

    } catch (error) {
        console.error('Failed to load projects:', error);
        projectGrid.innerHTML = `
            <div class="empty-state">
                <h3>Failed to load projects</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
})();
