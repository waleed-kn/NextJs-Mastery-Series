const project = [
    {
        id: 1,
        name: "Prompt Enhancer",
        Description: "Which convert the Unproper Prompt into the valid prompt",
        Tech: "Built on NextJs"
    },
];
export default function Project() {
    return (
        <main>
            <h1>My projects</h1>
            {project.map((projects) => (
                <div key={projects.id}>
                    <p> {projects.name}</p>
                    <p>  {projects.Description}</p>
                    <p>{projects.Tech}</p>
                </div>

            ))}

        </main>
    )
}