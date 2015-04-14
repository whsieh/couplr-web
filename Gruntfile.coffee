module.exports = (grunt) ->

    grunt.initConfig {
        coffee: {
            build: {
                src: "src/index.coffee",
                dest: "public/scripts/index.js"
            }
        },
        less: {
            build: {
                src: "src/style.less",
                dest: "public/style/style.css"
            }
        }
    }

    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-less"
    grunt.registerTask "default", ["coffee", "less"]
