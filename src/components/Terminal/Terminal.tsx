import React, { useState } from "react";
import {TreeType, tree} from "./tree";

export function Terminal() {
    const [commandHistory, setCommandHistory] = useState<JSX.Element[]>([]);
    const [currentCommand, setCurrentCommand] = useState<string>("");
    const [currentDirectory, setCurrentDirectory] = useState<string>("~");

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
            setCommandHistory((prevHistory) => [...prevHistory, <p>cat: missing operand</p>]);
        }
        if (args.length > 1) {
            setCommandHistory((prevHistory) => [...prevHistory, <p>cat: too many arguments</p>]);
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
                setCommandHistory((prevHistory) => [
                    ...prevHistory,
                    fileContent,
                ]);
            } else {
                setCommandHistory((prevHistory) => [...prevHistory, <p>cat: {args[0]}: No such file or directory</p>]);
            }
        }
    }

    function handleCd(args: string[]) {
        if (args.length === 0) {
            setCommandHistory((prevHistory) => [...prevHistory, <p>cd: missing operand</p>]);
        }
        if (args.length > 1) {
            setCommandHistory((prevHistory) => [...prevHistory, <p>cd: too many arguments</p>]);
        }
        if (args.length === 1) {
            if (args[0] === "..") {
                if (currentDirectory === "~") {
                    setCommandHistory((prevHistory) => [...prevHistory, <p>cd: cannot access '..': No such file or directory</p>]);
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
                    setCommandHistory((prevHistory) => [...prevHistory, <p>cd: {args[0]}: No such file or directory</p>]);
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
            setCommandHistory((prevHistory) => [...prevHistory, <p>virusrpi@virusrpi:~$    {currentCommand}</p>]);
            setCurrentCommand("");

            const [command, ...args] = currentCommand.trim().split(" ");

            switch (command) {
                case "ls":
                    const filesAndDirs = findFilesAndDirs(tree, currentDirectory);
                    setCommandHistory((prevHistory) => [
                        ...prevHistory,
                        <p>{filesAndDirs}</p>,
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
                        <>
                            <p>ls - list projects</p>,
                            <p>clear - clear the screen</p>
                            <p>help - this help message</p>
                            <p>cd - change directory</p>
                            <p>cat - print file contents</p>
                        </>
                    ]);
                    break;
                default:
                    setCommandHistory((prevHistory) => [
                        ...prevHistory,
                        <p>Command not found: {command}</p>,
                    ]);
            }
        }
    };

    return (
        <div className="bg-black min-h-screen w-full p-4 text-left left-1">
             <div className="text-green-700">
                <div>
                    <p>virusrpi [Version 1.0]</p>
                    <p>(c) 2023 virusrpi Corporation. All rights reserved.</p>
                </div>
                <div>
                    {commandHistory.map((historyItem, i) => (
                        <div key={i}>{historyItem}</div>
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
