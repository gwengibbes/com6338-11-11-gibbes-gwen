const poemEl = document.getElementById('poem')
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'
const getJSON = url => fetch(url).then(res => res.json())
const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg)
const makeTag = tag => str => `<${tag}>${str}</${tag}>`

//Create stanzas based on the empty lines.
function createStanzas(poemLines) {
  const stanzas = [];
  let stanza = new Array();
  //Run through all the lines of the poem and do the checks below.
  poemLines.forEach((line, index) => {
    // Each time it sees an empty line, create a new stanza looking for "".
    if (line == "") {
      stanzas.push(stanza);
      stanza = new Array();
      return;
    }
    //Add each line to the stanza.
    stanza.push(line);

    //When there is no "" check to see if you are at the last line of the poem then end the stanza. 
    if (index == poemLines.length - 1) {
      stanzas.push(stanza);
    }
  });
  return stanzas
}

//Completed this function by adding the construction of the poem html. 
const makePoemHTML = (response) => {
  const poem = response[0];
  const stanzas = createStanzas(poem.lines);

  //Make the poem show up on the page, create the html tags for each property of the poem.
  return [
    makeTag('h2')(poem.title),
    pipe(makeTag('em'), makeTag('h3'))(`by ${poem.author}`),
    stanzas.map(stanza => makeTag('p')(stanza.join('<br>'))).join(''),
  ].join('');
}

//When the page loads,  show the "Get Poem" button//
const getPoemBtn = document.getElementById('get-poem');
getPoemBtn.innerHTML = 'Get Poem';

//Open Poem API using Javascript fetch//
async function getPoemData() {
  try {
    const response = await getJSON(poemURL);
    console.log('The response from the API is:', response);
  // renders the HTML string returned by makePoemHTML to #poem
    poemEl.innerHTML = makePoemHTML(response);
  } catch (error) {
    console.log('Failed to get a successful response from the API',error);
  }
}

//Attach a click event to #get-poem
getPoemBtn.onclick = async function () {
  getPoemData();
}
