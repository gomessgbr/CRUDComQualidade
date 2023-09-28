import fs  from "fs"  //ES6
// const fs = require('fs')
const DB_FILE_PATH = "./core/db"

console.log("[CRUD]")

function create(content:string){
  // salvar o content no sistema
  fs.writeFileSync(DB_FILE_PATH, content)
  return content
}

console.log(create("Hoje eu preciso gravar aulas!"))