(function ($, Drupal) {
  Drupal.behaviors.ladybug = {
    attach: function (context, settings) {
      console.log($);
      console.log(Drupal);
      console.log(context);
      console.log(settings);
    }
  };
})(jQuery, Drupal);