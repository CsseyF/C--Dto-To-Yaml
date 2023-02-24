import * as fs from "fs";

interface Example {
  exists: boolean;
  value: string | undefined;
}

const convertTypes = (value: string): string => {
  const Types = {
    string: "string",
    Guid: "string",
    bool: "boolean",
    int: "integer",
    long: "number",
    decimal: "number",
    DateTime: "string",
    default: "object",
  };
  const key = value.replace("?", "");
  if(key in Types){
    return Types[key as keyof typeof Types]
  }
  else{
    return Types.default;
  }
};

const convertFormat = (value: string): string => {
  const Formats = {
    string: "string",
    Guid: "uuid",
    bool: "boolean",
    int: "int32",
    long: "int64",
    decimal: "decimal",
    DateTime: "date-time",
    default: "object",
  };
  const key = value.replace("?", "");
  if(key in Formats){
    return Formats[key as keyof typeof Formats]
  }
  else {
    return Formats.default;
  }
};

const hasExample = (format: string): Example => {
  const Examples = {
    boolean: "true",
    int32: "0",
    decimal: "11.61",
    int64: "0",
    "date-time": '"2021-06-20T23:00:00"',
  };
  if(format in Examples){
   return { exists: true, value: Examples[format as keyof typeof Examples] }
  }
  else{
   return { exists: false, value: "" }
  }
};
const argument = process.argv[2].split(" ");
const outFileName = argument[1];
const file = fs.readFileSync(argument[0], "utf-8");
if(file === ""){
  throw new Error("Arquivo de texto base não encontrado")
}

fs.writeFile(outFileName, "", () => {});

file.split(/\r?\n/).forEach((line) => {
  if (line === "") return;
  const properties = line.split(" ");
  const propName =
    properties[2].charAt(0).toLocaleLowerCase() + properties[2].slice(1);
  const propType = properties[1];

  const format = convertFormat(propType);
  const example = hasExample(format);

  let newLine = `\n${propName}:\n  type: ${convertTypes(propType)}\n`;

  if (propType !== "boolean") {
    newLine += `  format: ${format}`;
  }

  if (example.exists === true) {
    newLine += `\n  example: ${example.value}`;
  }

  fs.appendFile(outFileName, newLine, () => {});
});
