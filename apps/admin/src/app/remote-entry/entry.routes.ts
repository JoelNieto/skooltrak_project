import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () =>
      import('./nx-welcome.component').then((x) => x.NxWelcomeComponent),
  },
  {
    path: 'students',
    loadChildren: () =>
      import('../students/students.routes').then((x) => x.studentsRoutes),
  },
  {
    path: 'study-plans',
    loadChildren: () =>
      import('../plans/plans.routes').then((x) => x.plansRoutes),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('../courses/courses.routes').then((x) => x.coursesRoutes),
  },

  {
    path: 'school',
    loadChildren: () =>
      import('../school/school.routes').then((x) => x.schoolRoutes),
  },
  {
    path: 'teachers',
    loadChildren: () =>
      import('../teachers/teachers.routes').then((x) => x.teacherRoutes),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('@skooltrak/ui').then((x) => x.ProfileComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
