'use strict';

function escapeStrForRegexp(str) {
  return str.replace(/[\-\$\/]/g, '\\$&');
}

var token = Number(new Date()).toString(16);
var pre = '$$--H-' + token + '--$$';
var post = '$$/--H-' + token + '--$$';

var regexps = {
  pre: RegExp(escapeStrForRegexp(pre), 'g'),
  post: RegExp(escapeStrForRegexp(post), 'g')
};

module.exports = {
  pre: pre,
  post: post,
  regexps: regexps
};
