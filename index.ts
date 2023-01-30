import { Octokit } from "octokit";
import * as fs from "fs";
import { parse } from 'csv-parse';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});


fs.createReadStream("./assets/repositories.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on(
    "data",
    (row: string[]) => {
        const owner = row[0];
        const repo = row[1];
        // console.log(`owner: ${owner}, repo: ${repo}`);
        
        // getIssues(owner, repo).then((issues) => {
        //     issues.data.forEach((issue : any)=> {
        //         issue.title.split(" ").forEach((word: string) => {
        //             if (word.toLowerCase().includes("overflow")) {
        //                 console.log(`owner: ${owner}, repo: ${repo}, issue: ${issue.title}`);
        //             }
        //         })
        // });
        getCommits(owner, repo).then((commits) => {
            commits.data.forEach((commit : any)=> {
                commit.commit.title.split(" ").forEach((word: string) => {
                    console.log(word);
                    if (word.toLowerCase().includes("overflow")) {
                        console.log(`owner: ${owner}, repo: ${repo}, commit: ${commit.commit.message}`);
                    }
                })
            });
        });
    }
    
        );
    
    
    

  


function getCommits( owner:string, repo:string ) {
    return octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: owner,
        repo: repo
    });
}

function getIssues(owner:string, repo:string) {
    return octokit.request('GET /repos/{owner}/{repo}/issues?state=all', {
        owner: owner,
        repo: repo
    });
    
}

// try {
//     const { data } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
//         owner: "ISEL-HGU",
//         repo: "ASTChangeAnalyzer"
//     });
//     console.log(data);
// } catch (error) {
//     console.error(error);
// }