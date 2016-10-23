const inputHeight = document.querySelector('.test').getBoundingClientRect().height;
const startOffset = $('.test').caret('offset');
const state = {
  suggestions: [ 'violet', 'éléphant', 'demain' ],
  keys: {},
};

 const inputStyles = getComputedStyle(document.querySelector('.test'));
 const borderLeftWidth = parseInt(inputStyles.borderLeftWidth, 10);
 const paddingLeftWidth = parseInt(inputStyles.paddingLeft, 10);

 const changeLastWordBy = (value, word) => {
   let splitValue = value.split(' ');
   splitValue[splitValue.length - 1] = word;

   return splitValue.join(' ');
 };

$('body').append('<div class="predictr"></div>');

$('.predictr').ready(() => {
  const predictrWidth = document.querySelector('.predictr').getBoundingClientRect().width;

  $('.predictr')
    .css('top', startOffset.top - inputHeight - 5)
    .css('left', startOffset.left - (predictrWidth / 2) + (borderLeftWidth + paddingLeftWidth));

  state.suggestions.forEach((item, index) => {
    $('.predictr').append(`<span class="item" id="item-${index}">${item}</span>`);

    $(`.predictr #item-${index}`).on('click', ({ target }) => {
      $('.test').val(changeLastWordBy($('.test').val(), state.suggestions[index]));
    });
  });
});

$('.test')
  .on('focus blur', ({ type, target: { value } }) => {
    setTimeout(() => {
      $('.predictr').css('visibility', type.includes('focus') && !!value.length ? 'visible' : 'hidden');
    }, 150);
  })
  .on('input', ({ target }) => {
    const offset = $(target).caret('offset');
    const predictrWidth = document.querySelector('.predictr').getBoundingClientRect().width;

    $('.predictr')
      .css('top', offset.top - inputHeight - 5)
      .css('left', offset.left - (predictrWidth / 2) + (borderLeftWidth + paddingLeftWidth))
      .css('visibility', !!target.value.length ? 'visible' : 'hidden');
  })
  .on('keydown keyup', ({ which, type, target }) => {
    // Ctrl keycode : 17
    // 1, 2, 3 keycodes : 49, 50, 51
    if (type.includes('keydown')) {
      state.keys[which] = true;
    } else if (type.includes('keyup')) {
      delete state.keys[which];
    }

    if (state.keys['17'] && state.keys['49'] && target.value) {
      $(target).val(changeLastWordBy(target.value, state.suggestions[0]));
    } else if (state.keys['17'] && state.keys['50'] && target.value) {
      $(target).val(changeLastWordBy(target.value, state.suggestions[1]));
    } else if (state.keys['17'] && state.keys['51'] && target.value) {
      $(target).val(changeLastWordBy(target.value, state.suggestions[2]));
    }
  });
