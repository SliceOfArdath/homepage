var l = 11;
if (window.location.search == '?enhancedmode=true') {
l++;
    }
var x = Math.floor(Math.random() * l);

var statments = [
"Life is.. wait WHAAAAT???",
"Existence implies influence, influence implies existence.",
"Procrastination is my word.",
"Any computer is a laptop if you're brave enough!",
"Doesn't avoid double negatives!",
"pls rt",
"sqrt(-1) love you!",
"Orthographicaly correct!",
"PHP free!",
"Being annoying is the best thing you could ever imagine",
"There\'s really no hard limit to how long these statements can be and to be quite honest I\'m rather curious to see how far we can go. Adolphus W. Green (1844–1917) started as the Principal of the Groton School in 1864. By 1865, he became second assistant librarian at the New York Mercantile Library; from 1867 to 1869, he was promoted to full librarian. From 1869 to 1873, he worked for Evarts, Southmayd & Choate, a law firm co-founded by William M. Evarts, Charles Ferdinand Southmayd and Joseph Hodges Choate. He was admitted to the New York State Bar Association in 1873. Anyway, how\'s your day been?",
"Pro tip: the password is someone's name",
"This message will never appear on the top bar, isn't that weird?"
];

document.getElementById("top").innerHTML = statments[x];
