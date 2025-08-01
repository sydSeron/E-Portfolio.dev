// This file handles fetching data from the GitHub API to populate the projects.html page with the owner's repositories.

const githubUsername = 'sydSeron'; // Replace with your GitHub username
const apiUrl = `https://api.github.com/users/${githubUsername}/repos`;

async function fetchRepositories() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const repositories = await response.json();
        displayRepositories(repositories);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayRepositories(repositories) {
    const projectsContainer = document.getElementById('projects-container');
    repositories.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.classList.add('repo');

        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.target = '_blank';
        repoLink.textContent = repo.name;

        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description || 'No description available';

        repoElement.appendChild(repoLink);
        repoElement.appendChild(repoDescription);
        projectsContainer.appendChild(repoElement);
    });
}

// Call the fetchRepositories function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchRepositories);