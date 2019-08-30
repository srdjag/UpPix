import colors from "vuetify/es5/util/colors";

export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "",
    title: "UpPix",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Indie+Flower&display=swap"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/icon?family=Material+Icons"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  router: {
    middleware: "router-auth"
  },

  /*
   ** Global CSS
   */
  css: ["@/assets/main.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/firebase.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/toast"],

  serverMiddleware: ["~/api/servermid"],

  toast: {
    position: "top-center",
    register: [
      // Register custom toasts
      {
        name: "my-error",
        message: "Oops...Something went wrong",
        options: {
          type: "error"
        }
      }
    ]
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: "empty"
      };

      // ....
    }
  }
};
