import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'skooltrak-sign-up',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="bg-gray-100 font-sans dark:bg-gray-800">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <a
          href="#"
          class="flex items-center text-2xl font-semibold mb-6 text-gray-900 dark:text-white"
        >
          <img
            class="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Skooltrak
        </a>
        <div
          class="w-full bg-white rounded-xl p-6 space-y-4 md:space-y-6 shadow-xl md:mt-0 sm:max-w-2xl dark:bg-gray-600 dark:border-gray-700"
        >
          <h1
            class="text-xl font-bold leading-tight font-mono md:text-2xl dark:text-white"
          >
            Create your personal account
          </h1>
          <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <label
                class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
                for="name"
                >Name</label
              >
              <input type="text" name="name" class="input" placeholder="John" />
            </div>
            <div>
              <label
                class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
                for="last-name"
                >Last name</label
              >
              <input
                type="text"
                name="last-name"
                class="input"
                placeholder="Doe"
              />
            </div>
            <div>
              <label
                class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
                for="email"
                >Email</label
              >
              <input
                type="email"
                name="email"
                class="input"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label
                class="block mb-2 font-sans text-gray-700 font-medium dark:text-white"
                for="role"
                >Role</label
              >
              <select name="role" class="input" placeholder="name@company.com">
                <option selected disabled>Choose a role</option>
                <option>Student</option>
                <option>Teacher</option>
                <option>Administrator</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            class="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800 disabled:bg-blue-400 disabled:dark:bg-blue-500 disabled:cursor-not-allowed"
          >
            Create account
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-300">
            Do you have an account already?
            <a class="font-medium text-sky-600  hover:underline" routerLink="/"
              >Sign in</a
            >
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 shadow-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
      }
    `,
  ],
})
export class SignUpComponent {}
