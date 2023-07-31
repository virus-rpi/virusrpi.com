import React, { useState } from "react";

type TreeType = {
    [key: string]: TreeType | JSX.Element;
}

export function Terminal() {
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [currentCommand, setCurrentCommand] = useState<string>("");
    const [currentDirectory, setCurrentDirectory] = useState<string>("~");
    const tree: TreeType = {
        "~": {
            "projects":
                {
                    "MPI.txt": <p>mpi</p>,
                    "SpaceInvader.txt": <p>space invader</p>,
                },
            "contact.txt": <p>contact</p>,
            "about.txt": <p>about</p>,
            "minecraft.txt": <p>minecraft</p>,
            "blog":
                {
                },
            "resume.txt": <p>resume</p>,
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCommand(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            executeCommand();
        }
    };

    function handleCat(args: string[]) {
        if (args.length === 0) {
            setCommandHistory((prevHistory) => [...prevHistory, "cat: missing operand"]);
        }
        if (args.length > 1) {
            setCommandHistory((prevHistory) => [...prevHistory, "cat: too many arguments"]);
        }
        if (args.length === 1) {
            const segments = currentDirectory.split('/').filter((segment) => segment !== '');
            let currentTree = tree;
            for (const segment of segments) {
                if (segment in currentTree) {
                    currentTree = currentTree[segment] as unknown as TreeType;
                }
            }
            let possibleFiles: string[] = [];
            Object.keys(currentTree).forEach((key) => {
                if (key.includes(".")) {
                    possibleFiles.push(key);
                }
            });
            const isFileExists = possibleFiles.includes(args[0]);
            if (isFileExists) {
                const fileContent = currentTree[args[0]] as JSX.Element;
                const fileContentString = fileContent.props.children as string;
                setCommandHistory((prevHistory) => [
                    ...prevHistory,
                    fileContentString,
                ]);
            } else {
                setCommandHistory((prevHistory) => [...prevHistory, `cat: ${args[0]}: No such file or directory`]);
            }
        }
    }

    function handleCd(args: string[]) {
        if (args.length === 0) {
            setCommandHistory((prevHistory) => [...prevHistory, "cd: missing operand"]);
        }
        if (args.length > 1) {
            setCommandHistory((prevHistory) => [...prevHistory, "cd: too many arguments"]);
        }
        if (args.length === 1) {
            if (args[0] === "..") {
                if (currentDirectory === "~") {
                    setCommandHistory((prevHistory) => [...prevHistory, "cd: cannot access '..': No such file or directory"]);
                }
                setCurrentDirectory((prevDirectory) => {
                    const directories = prevDirectory.split("/");
                    const newDirectories = directories.slice(0, directories.length - 1);
                    return newDirectories.join("/");
                })
            }
            else if (args[0] === "/") {
                setCurrentDirectory("~");
            }
            else {
                const newDirectory = `${currentDirectory}/${args[0]}`;
                const segments = currentDirectory.split('/').filter((segment) => segment !== '');
                let currentTree = tree;
                for (const segment of segments) {
                    if (segment in currentTree) {
                        currentTree = currentTree[segment] as unknown as TreeType;
                    }
                }
                let possibleDirectories: string[] = [];
                Object.keys(currentTree).forEach((key) => {
                    if (!key.includes(".")) {
                        possibleDirectories.push(key);
                    }
                });
                console.log(possibleDirectories);
                const isDirectoryExists = possibleDirectories.includes(args[0]);
                if (isDirectoryExists) {
                    setCurrentDirectory(newDirectory);
                } else {
                    setCommandHistory((prevHistory) => [...prevHistory, `cd: ${args[0]}: No such file or directory`]);
                }
            }
        }
    }

    function findFilesAndDirs(tree: TreeType, path: string): string {
        const segments = path.split('/').filter((segment) => segment !== '');

        let currentTree = tree;
        let output = "";
        for (const segment of segments) {
            if (segment in currentTree) {
                currentTree = currentTree[segment] as unknown as TreeType;
            }
            else {
                return `ls: cannot access '${path}': No such file or directory`;
            }
        }
        output += Object.keys(currentTree).join("    ");
        return output;
    }


    const executeCommand = () => {
        if (currentCommand.trim() !== "") {
            setCommandHistory((prevHistory) => [...prevHistory, "virusrpi@virusrpi:~$    " + currentCommand]);
            setCurrentCommand("");

            const [command, ...args] = currentCommand.trim().split(" ");

            switch (command) {
                case "ls":
                    const filesAndDirs = findFilesAndDirs(tree, currentDirectory);
                    setCommandHistory((prevHistory) => [
                        ...prevHistory,
                        filesAndDirs,
                    ]);
                    break;
                case "clear":
                    setCommandHistory([]);
                    break;
                case "cd":
                    handleCd(args);
                    break;
                case "cat":
                    handleCat(args);
                    break;
                case "help":
                    setCommandHistory((prevHistory) => [
                        ...prevHistory,
                        "ls - list projects",
                        "clear - clear the screen",
                        "help - this help message",
                        "cd - change directory",
                        "cat - print file contents",
                    ]);
                    break;
                default:
                    setCommandHistory((prevHistory) => [
                        ...prevHistory,
                        `Command not found: ${command}`,
                    ]);
            }
        }
    };

    return (
        <div className="bg-black min-h-screen w-full p-4">
             <div className="text-green-700">
                <div>
                    <p>virusrpi [Version 1.0]</p>
                    <p>(c) 2023 virusrpi Corporation. All rights reserved.</p>
                </div>
                <div>
                    {commandHistory.map((command, index) => (
                        <p key={index} className="leading-tight">{command}</p>
                    ))}
                </div>
                <div className="flex">
                    <p>virusrpi@virusrpi:~$    </p>
                    <input
                        type="text"
                        value={currentCommand}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="bg-black text-green-700 outline-none w-full border-none"
                    />
                </div>
            </div>
        </div>
    );
}
