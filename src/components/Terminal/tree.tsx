import Contact from "./files/contact";
import React from "react";
import About from "./files/about";

export type TreeType = {
    [key: string]: TreeType | JSX.Element;
}

export const tree: TreeType = {
        "~": {
            "projects":
                {
                    "MPI.txt": <p>mpi</p>,
                    "SpaceInvader.txt": <p>space invader</p>,
                },
            "contact.txt": <Contact />,
            "about.txt": <About />,
            "minecraft.txt": <p>minecraft</p>,
            "blog":
                {
                },
            "resume.txt": <p>resume</p>,
        }
    };