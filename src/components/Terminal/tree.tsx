import Contact from "./files/contact";
import React from "react";
import About from "./files/about";
import Minecraft from "./files/minecraft";
import GithubRepository from "./files/github-repository";

export type TreeType = {
    [key: string]: TreeType | JSX.Element;
}

export const tree: TreeType = {
        "~": {
            "projects":
                {
                    "MPI.txt": <GithubRepository name="MPI" url="https://github.com/virus-rpi/MPI" md_url=""/>,
                    "SpaceInvader.txt": <GithubRepository name="SpaceInvader" url="https://github.com/virus-rpi/SpaceInvader" md_url="https://raw.githubusercontent.com/virus-rpi/SpaceInvader/main/README.md"/>,
                },
            "contact.txt": <Contact />,
            "about.txt": <About />,
            "minecraft.txt": <Minecraft />,
            "blog":
                {
                    "No posts yet": <p>No posts yet</p>,
                },
        }
    };