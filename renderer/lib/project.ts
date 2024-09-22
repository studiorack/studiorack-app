import { ProjectTypes, ProjectVersion } from '@studiorack/core';
import { NextRouter } from 'next/router';

export function filterProjects(projectTypes: ProjectTypes, projects: ProjectVersion[], router: NextRouter) {
  const category: string = (router.query['category'] as string) || 'all';
  const search: string = router.query['search'] as string;
  return projects.filter((project: ProjectVersion) => {
    if (category !== 'all' && project.type?.ext !== projectTypes[category as keyof ProjectTypes]?.ext) return false;
    if (
      search &&
      project.id?.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
      project.name?.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
      project.description?.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
      project.tags?.indexOf(search.toLowerCase()) === -1
    )
      return false;
    return project;
  });
}
