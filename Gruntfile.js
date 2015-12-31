module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: ['_site/**/*.css'],
      options: {
        livereload: true,
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);

};