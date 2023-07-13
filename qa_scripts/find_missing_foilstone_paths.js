const fs = require("fs");
const readline = require("readline");
const language = process.argv[2].toLowerCase();
let outputFilePath;
const uniqueLetters = [];
// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
   
  const json = await processModule(language);
  const missingLetterPaths = findMissingLetter(json);
  outputFilePath = `${__dirname}/missing_foilstones_paths.txt`;

  fs.writeFile(outputFilePath, missingLetterPaths.join("\n"), "utf8", (err) => {
    if (err) {
      console.error(`Error writing to file: ${err.message}`);
    } else {
      console.log(`Missing Foilstone paths written to ${outputFilePath}`);
    }
    rl.close();
  });

  // Write the modified JSON back to the file
  const modifiedJSON = JSON.stringify(json, null, 2);
  const modulePath = `${__dirname}/../lang/${language}/ftm_${language}.json`;
  fs.writeFile(modulePath, modifiedJSON, "utf8", (err) => {
    if (err) {
      console.error(`Error writing modified JSON: ${err.message}`);
    } else {
      console.log("Modified JSON written to file.");
    }
  });
}

function findMissingLetter(obj, path = "", paths = []) {
  if (typeof obj === "object" && obj !== null) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newPath = path ? `${path}.${key}` : key;
        if (
          key === "StoneText" &&
          obj[key] != "MagnetLetter" &&
          key === "StoneText" &&
          obj[key] != null &&
          key === "StoneText" &&
          obj[key] != "" &&
          key === "StoneText" &&
          obj[key] != "FireWrongLetter"
        ) {
          if (!uniqueLetters.includes(obj[key]) && uniqueLetters.length <= 30) {
            uniqueLetters.push(obj[key]);
          }
        }
        if (
          !(key === "StoneText" && obj[key] === "MagnetLetter") &&
          !(key === "StoneText" && obj[key] === null) &&
          !(key === "StoneText" && obj[key] === "") &&
          !(key === "StoneText" && obj[key] === "FireWrongLetter")
        ) {
        } else {
          const randomIndex = Math.floor(Math.random() * uniqueLetters.length);
          obj[key] = uniqueLetters[randomIndex];
          paths.push(newPath);
        }
        findMissingLetter(obj[key], newPath, paths);
      }
    }
  }
  return paths;
}

// Function to prompt the user for language selection
function promptForLanguageSelection() {
  return new Promise((resolve) => {
    rl.question("Enter your language: ", (answer) => {
      resolve(answer.toLowerCase());
    });
  });
}

function processModule(language) {
  try {
    const modulePath = `${__dirname}/../lang/${language}/ftm_${language}.json`;
    const module = require(modulePath);
    return module;
  } catch (error) {
    console.error("Error occurred while importing module:", error);
  }
}

// Start the main function
main();
