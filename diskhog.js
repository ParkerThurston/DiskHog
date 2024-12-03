const fs = require('fs')
const fileS = require('filesize')
const chalk = require('chalk')


console.log('STARTING DISKHOG')

// constructors
const File = (name, size) => ({name, size})
const Dir = (name, size, children) => ({name, size, children})

// comparators (ONLY SORT WITHIN DIRECTORY)
const unsorted = (a, b) => 0 // keep original order
const compareNumbers = (a, b) => a - b
const compareStrings = (a, b) => a.localeCompare(b)

const compareFileNames = (a, b) => compareStrings(a.name, b.name)
const compareFileSizes = (a, b) => -compareNumbers(a.size, b.size)
const compareFileExts  = (a, b) => compareStrings(a.name.split('.').pop(), b.name.split('.').pop()) 



// globals 
let path = '.'
let metric = false
let primaryComparator = unsorted
let secondaryComparator = unsorted
let threshold = 0
let metricSize = 0
let lang =''

//used for error parsing, in a future version I plan to clean these up
// but were the easiest way I could think of to handle the messages.json file
let errorMessage = ''
let error = false
let errorArg = ''


//gets the lang from process.env, if it doesn't exist set lang to en-US
try {
  lang = `${process.env.LANG.slice(0,2)}-${process.env.LANG.slice(3,5)}`
}
catch {
  lang = 'en-US'
}




function usage(error = false) {
  //determines if there was an error thrown, if so print blue. if not print white
  if (error) color = chalk.blue
  else color = chalk.white
  const helpFile = fs.readFileSync(`help.${lang}.txt`, 'utf-8')
  console.log(color(helpFile))
  process.exit(0)
}

function parseArgsAndSetFlags() {
  const args = process.argv.slice(2)
  for (let i=0; i<args.length; i++) {
    args[i] = args[i].toLowerCase()

    switch(args[i]) {
      case '-p':
      case '--path':
        i++
        
          try {
            fs.statSync(args[i])
          }
          catch{
            error = true
            errorMessage ='is not a valid path, enter a valid system path'
            errorArg = args[i]
            break
          }
        path = args[i]
        break
      case '-m':
      case '--metric':
        if (args[i+1] == undefined || args[i+1].startsWith('-')) {
          metric = true
        }
        else {
          i++
          error = true
          errorMessage = 'Metric takes no arguments'
        }
        break
      case '-s':
      case '--sort':
        i++
        if (args[i].toLowerCase() == 'alpha') primaryComparator = compareFileNames
        else if (args[i].toLowerCase() == 'size') primaryComparator = compareFileSizes
        else if (args[i].toLowerCase() == 'exten') primaryComparator = compareFileExts
        else {
          error = true
          errorMessage ='is not a valid sort argument'
          errorArg = args[i]
        }

        //tests for secondary sort
        if (args[i+1] == undefined || args[i+1].startsWith('-')) {
          break
        }
        else {
          i++
          if (args[i].toLowerCase() == 'alpha') secondaryComparator = compareFileNames
          else if (args[i].toLowerCase() == 'size') secondaryComparator = compareFileSizes
          else if (args[i].toLowerCase() == 'exten') secondaryComparator = compareFileExts
          else {
            error = true
            errorMessage ='is not a valid sort argument'
            errorArg = args[i]
          }
        }
        break
      case '-t':
      case '--threshold':
        i++
        if (isNaN(args[i])) {
          error = true
          errorMessage ='is not a valid input for threshold. Input a number'
          errorArg = args[i]
        }
        threshold = args[i]
        break
      case '-lang':
      case '--language':
        i++
        if (fs.existsSync(`./help.${args[i]}.txt`)) lang = args[i]
        break
      case '-h':
      case '--help':
        usage()
        break
      default:
        error = true
        errorMessage ='is not a valid diskhog argument'
        errorArg = args[i]
        break
    }
  }
}

function printError(message) {
  const msgs = require(`./messages.${lang}.json`)
  console.log(chalk.red(`${errorArg} ${msgs[message]}`))
  usage(true)
}
  
function walkDir(path) {
  let stats = fs.statSync(path)
  if (stats.isFile()) { // BASE CASE
    return File(path, stats.size) 
  }
  else if (stats.isDirectory()) { // RECURSIVE CASE
    let dir = Dir(path, 0, [])
    let children = fs.readdirSync(path)

    for (let child of children) {
      let dirEntry = walkDir(`${path}\\${child}`)
      if (dirEntry === undefined) continue
      dir.children.push(dirEntry)
      dir.size += dirEntry.size
    }
    return dir
  }
  // If anything else, like 
  // - hard links, 
  // - symbolic links, 
  // - volume names, 
  // - ..., 
  // do nothing. We only want regular files and directories. 
}

function printDir(node) { // walk the tree in preorder
  if (node.size > (threshold * 1000000)) {

    if (metric) metricSize = fileS(node.size, {locale:lang}).toLocaleString(lang)  //Set metric using Filesize
    else metricSize = node.size.toLocaleString(lang)
  

    if (!node.children) {
      console.log(` (${chalk.blue(metricSize)}) ${node.name}`) //file parent
      return 
    }
    console.log(` (${chalk.blue(metricSize)}) ${node.name}\\`) //dir parent
  
  node.children.sort(secondaryComparator).sort(primaryComparator) //stable secondary sort

  console.group() //indent
  for (let child of node.children) {
    printDir(child)     //children
  }
  console.groupEnd() //unindent
  }
}

function main() {
  parseArgsAndSetFlags()
  if (error) {
   printError(errorMessage)
  }
   else {
  let root = walkDir(path)
  printDir(root)
  }
}

main()










// ELEPHANT GRAVEYARD
// FIXME in Linux a directory can start with a dash. OUCH
  // console.log(
    // Usage: node diskhog [arguments]
    // -p, --path value, the relative or absolute path name of a file or directory. Default is -p .
    // -s, --sort alpha | exten | size 
    // alpha sorts alphabetically (ascending)
    // exten sorts by extension alphabetically (ascending)
    // size sorts by size (descending)
    // Default is unsorted
    // -m, --metric, sizes displayed as KB, MB, GB, and TB.
    // -t, --threshold min, only displays files and folders of at least minimum size. min is the number of millions. Default is -t 0.
    // -h, --help prints this usage screen. Ignores all other arguments.
    // )
    // let D = {name: 'D', size: 101,} //file
    // let E = {name: 'E/', size: 101, children: []} //Empty dir
    // let G = {name: 'G', size: 101,} //file
    // let F = {name: 'F/', size: 101, children: [G]}
    // let C = {name: 'C/', size: 101, children: [E, F]}
  // let B = {name: 'B/', size: 101, children: [D]}
  // let A = {name: 'A/', size: 2049, children: [B, C]}
  // let root = A



  //// let utf = process.env.LANG.slice(6,11)
  //FIXME !name.includes('.') return ''
