import HelloComponent from '_shared/HelloComponent';

(function ($, Drupal) {
  Drupal.behaviors.mytheme = {
    attach(context) {
      if (context === document) {
        const component = new HelloComponent('mytheme');
        component.sayHello();
      }
    }
  }

}(jQuery, Drupal));
