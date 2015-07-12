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
  input: '<input class="aa-input" type="text" autocomplete="false" spellcheck="false">',
  hint: '<input class="aa-hint" type="text" autocomplete="false" spellcheck="false" disabled>',
  menu: '<span class="aa-dropdown-menu"></span>',
  dataset: [
    '<div class="aa-dataset-test">',
      '<span class="aa-suggestions">',
        '<div class="aa-suggestion"><p>one</p></div>',
        '<div class="aa-suggestion"><p>two</p></div>',
        '<div class="aa-suggestion"><p>three</p></div>',
      '</span>',
    '</div>'
  ].join('')
};

module.exports = fixtures;
