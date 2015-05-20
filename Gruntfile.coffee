module.exports = (grunt) ->

    grunt.initConfig {
        coffee: {
            build: {
                files: [
                    {
                        ext: ".js",
                        flatten: true,
                        expand: true,
                        src: "src/*.coffee",
                        dest: "public/scripts/"
                    }, {
                        ext: ".js",
                        flatten: true,
                        expand: true,
                        src: "app.coffee",
                        dest: "bin/"
                    }
                ]
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
