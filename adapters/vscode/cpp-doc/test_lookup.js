const { lookup, ping } = require('./native/cppdoc_core.node');

console.log('ping →', ping());               
console.log('lookup(std::vector) →', lookup('std::vector'));
