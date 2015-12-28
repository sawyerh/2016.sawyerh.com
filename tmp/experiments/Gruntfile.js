module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: ['paperjs/**/*.html'],
      options: {
        livereload: true,
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);

};