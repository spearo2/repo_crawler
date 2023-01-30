import { Octokit } from "octokit";
import * as fs from "fs";
import { writeFileSync, readFileSync } from 'fs';
import { parse } from 'csv-parse';
import { join } from 'path';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

var result: string = '';
module Environment {
    export class Sub {
        owner: string | undefined;
        repo: string | undefined;
        id: number | undefined;
        web_rul: string | undefined;
        title: string | undefined;
        body: string | undefined;
    }
}

fs.createReadStream("./assets/repositories.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on(
    "data",
    (row: string[]) => {
        const owner = row[0];
        const repo = row[1];
        
        getIssues(owner, repo).then((issues) => {
            for (var issue of issues.data) {
                var found = false;
                // console.log(issue);
                for (var word of issue.title.split(" ")) {
                    if (word.toLowerCase().includes("overflow")) {
                        console.log(owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n");
                        result += owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n";
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    for (var word of issue.body.split(" ")) {
                        if (word.toLowerCase().includes("overflow")) {
                            console.log(owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n");
                            result += owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n";
                            break;
                        }
                    }
                }
            }
            // issues.data.forEach((issue : any)=> {
            //     if (issue.title.split(" ").forEach((word: string) => { word.toLowerCase().includes("overflow") })) {
            //         console.log(issue.owner + "," + issue.repo + "," + issue.id + "," + issue.web_url + "," + issue.title + "," + issue.body + "\n");
            //         result += issue.owner + "," + issue.repo + "," + issue.id + "," + issue.web_url + "," + issue.title + "," + issue.body + "\n";
            //     }

                    
                })
        // });

        
     
        syncWriteFile('./result.csv', result);
        
        // getCommits(owner, repo).then((commits) => {
        //     console.log(commits);
        //     commits.data.forEach((commit : any)=> {
        //         console.log(commit.commit.message);
        //         commit.commit.title.split(" ").forEach((word: string) => {
        //             if (word.toLowerCase().includes("overflow")) {
        //                 console.log(`owner: ${owner}, repo: ${repo}, commit: ${commit.commit.message}`);
        //             }
        //         })
        //     });

        });
    
    
    
  


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

function syncWriteFile(filename: string, data: any) {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    writeFileSync(join(__dirname, filename), data, {
      flag: 'w',
    });
  
    const contents = readFileSync(join(__dirname, filename), 'utf-8');
    console.log(contents); // 👉️ "One Two Three Four"
  
    return contents;
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