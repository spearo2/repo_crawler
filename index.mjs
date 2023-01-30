import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

try {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: "ISEL-HGU",
        repo: "ASTChangeAnalyzer"
    });
    console.log(data);
} catch (error) {
    console.error(error);
}