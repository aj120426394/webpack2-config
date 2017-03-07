export default class Affix {
  /**
   * @param {String} affixToSelector
   * @param {String} affixBufferSelector
   */
  static top(affixToSelector, affixBufferSelector) {

    const $affixMe = $(affixToSelector);
    let $needsBuffer;

    if ($affixMe.length > 0) {
      if (affixBufferSelector) {
        $needsBuffer = $(affixBufferSelector);
      }

      const $body = $("body");
      const $html = $("html");
      const $window = $(window);
      const initialTop = $affixMe.offset().top;

      $window.scroll(function () {
        if ($body[0].scrollTop >= initialTop || $html[0].scrollTop >= initialTop) {
          $affixMe.addClass("fixed-top");
          if (affixBufferSelector && $needsBuffer.length > 0) {
            $needsBuffer.addClass("fixed-top-buffer");
          }

        } else {
          $affixMe.removeClass("fixed-top");
          if (affixBufferSelector && $needsBuffer.length > 0) {
            $needsBuffer.removeClass("fixed-top-buffer");
          }
        }
      });
    }
  };
}
