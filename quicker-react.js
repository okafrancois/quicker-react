#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function main() {
  const inquirer = await import('inquirer');

  const questions = [
    {
      type: 'input',
      name: 'componentName',
      message: 'What is the name of your component?',
    },
    {
      type: 'input',
      name: 'subDirectory',
      message: 'Enter a subdirectory for your component (leave empty for current directory):',
      default: '', // Default to empty string, indicating the current directory
      validate: function (input) {
        const fullPath = path.resolve(process.cwd(), input);
        if (input === '' || (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory())) {
          return true;
        }
        return 'Please enter a valid subdirectory name or leave empty for the current directory.';
      },
    },
  ];

  try {
    const answers = await inquirer.default.prompt(questions);
    const { componentName, subDirectory } = answers;

    // Format folder and file names
    const folderName = componentName.toLowerCase().split(' ').join('-');
    const fileName = componentName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    const targetDirectory = path.resolve(process.cwd(), subDirectory, folderName);

    // Create folder if it doesn't exist
    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, { recursive: true });
    }

    const componentFilePath = path.join(targetDirectory, `${fileName}.tsx`);
    const componentTemplate = `
interface ${fileName}Props {
  //  Add props here
}

export default function ${fileName}({
}: Readonly<${fileName}Props>) {
  return (
    <>
      {/* Add component code here */}
      <p>${fileName} component</p>
    </>
  );
}
`;

    // Write the component file
    fs.writeFileSync(componentFilePath, componentTemplate);
    console.log(`Component ${fileName} created at ${componentFilePath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();