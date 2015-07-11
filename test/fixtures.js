var fixtures = {};

fixtures.data = {
  simple: [
    { value: 'big' },
    { value: 'bigger' },
    { value: 'biggest' },
    { value: 'small' },
    { value: 'smaller' },
    { value: 'smallest' }
  ],
  animals: [
    { value: 'dog' },
    { value: 'cat' },
    { value: 'moose' }
  ]
};

fixtures.html = {
  textInput: '<input type="text">',
  input: '<input class="tt-input" type="text" autocomplete="false" spellcheck="false">',
  hint: '<input class="tt-hint" type="text" autocomplete="false" spellcheck="false" disabled>',
  menu: '<span class="tt-dropdown-menu"></span>',
  dataset: [
    '<div class="tt-dataset-test">',
      '<span class="tt-suggestions">',
        '<div class="tt-suggestion"><p>one</p></div>',
        '<div class="tt-suggestion"><p>two</p></div>',
        '<div class="tt-suggestion"><p>three</p></div>',
      '</span>',
    '</div>'
  ].join('')
};

module.exports = fixtures;
