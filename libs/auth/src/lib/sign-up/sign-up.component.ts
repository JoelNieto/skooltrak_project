import { Component } from '@angular/core';

@Component({
  selector: 'skooltrak-sign-up',
  standalone: true,
  imports: [],
  template: `
    <div class="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow-md">
      <h1 class="form-header">Login</h1>
      <form>
        <div class="form-group">
          <label class="form-label" for="username">Username</label>
          <input
            class="form-control"
            type="text"
            id="username"
            name="username"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            class="form-control"
            type="password"
            id="password"
            name="password"
          />
        </div>
        <button class="btn" type="submit">Login</button>
        <a class="btn-secondary" href="#">Forgot Password?</a>
      </form>
      <p class="form-footer">Don't have an account? <a href="#">Sign up</a></p>
    </div>
  `,
  styles: [
    `
      .form-control {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 shadow-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
      }

      .btn {
        @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none;
      }

      .btn-secondary {
        @apply bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none;
      }

      .form-group {
        @apply mb-4;
      }

      .form-header {
        @apply text-3xl font-bold mb-8 text-center font-mono;
      }

      .form-label {
        @apply block text-gray-700 font-bold mb-2;
      }

      .form-footer {
        @apply text-sm text-gray-500 text-center mt-4;
      }
    `,
  ],
})
export class SignUpComponent {}
