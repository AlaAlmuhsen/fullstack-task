import * as fs from "node:fs";
import path from "path";

const clearImage = (filePath : string)=> {
    filePath = path.join(__dirname, '../../', filePath)
    fs.unlink(filePath, err => console.log(err))
}

export default clearImage