import { Routes } from '@angular/router';

export const remoteRoutes: Routes = [
  {
    path: 'home',
    title: 'Home',
    loadComponent: () =>
      import('./nx-welcome.component').then((x) => x.NxWelcomeComponent),
  },
  {
    path: 'students',
    title: 'Students',
    loadChildren: () =>
      import('../students/students.routes').then((x) => x.studentsRoutes),
  },
  {
    path: 'study-plans',
    title: 'Study Plans',
    loadChildren: () =>
      import('../plans/plans.routes').then((x) => x.plansRoutes),
  },
  {
    path: 'courses',
    title: 'Courses',
    loadChildren: () =>
      import('../courses/courses.routes').then((x) => x.coursesRoutes),
  },

  {
    path: 'school',
    title: 'School',
    loadChildren: () =>
      import('../school/school.routes').then((x) => x.schoolRoutes),
  },
  {
    path: 'teachers',
    title: 'Teachers',
    loadChildren: () =>
      import('../teachers/teachers.routes').then((x) => x.teacherRoutes),
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () =>
      import('@skooltrak/ui').then((x) => x.ProfileComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
