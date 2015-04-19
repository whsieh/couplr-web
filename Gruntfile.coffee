module.exports = (grunt) ->

    grunt.initConfig {
        coffee: {
            build: {
                ext: ".js",
                flatten: true,
                expand: true,
                src: "src/*.coffee",
                dest: "public/scripts/"
            }
        },
        less: {
            build: {
                ext: ".css",
                flatten: true,
                expand: true,
                src: "src/*.less",
                dest: "public/style/"
            }
        }
    }

    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-less"
    grunt.registerTask "default", ["coffee", "less"]
