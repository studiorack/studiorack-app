import { ProjectTypes, ProjectVersionLocal } from '@studiorack/core';

export function filterProjects(
  category: string,
  projects: ProjectVersionLocal[],
  projectTypes: ProjectTypes,
  query: string,
): ProjectVersionLocal[] {
  console.log('filterProjects', category, projectTypes, query);
  return projects.filter((project: ProjectVersionLocal) => {
    if (
      (category === 'all' || project.type.ext === projectTypes[category]?.ext) &&
      (project.author.toLowerCase().indexOf(query) !== -1 ||
        project.id?.toLowerCase().indexOf(query) !== -1 ||
        project.name.toLowerCase().indexOf(query) !== -1 ||
        project.description.toLowerCase().indexOf(query) !== -1 ||
        project.tags.includes(query))
    ) {
      return project;
    }
    return false;
  });
}
