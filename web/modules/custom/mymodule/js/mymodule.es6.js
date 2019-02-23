import HelloComponent from '_shared/HelloComponent';

(function ($, Drupal) {
  Drupal.behaviors.mymodule = {
    attach(context) {
      if (context === document) {
        const component = new HelloComponent('mymodule');
        component.sayHello();
      }
    }
  }

}(jQuery, Drupal));
