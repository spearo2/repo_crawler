import { Octokit } from "octokit";
import * as fs from "fs";
import { writeFileSync, readFileSync } from 'fs';
import { parse } from 'csv-parse';
import { join } from 'path';
import { stringify } from "querystring";

var arg = process.argv ;
  
if (arg[2] == '-i') {
    option_i();
} else if (arg[2] == '-c') {
    option_c();
}

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});


function option_i() {
    var result: string = '';

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
                    if (issue.title == null)
                        continue;
                    for (var word of issue.title.split(" ")) {
                        if (word.toLowerCase().includes(arg[3])) {
                            // console.log(owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n");
                            let x = owner as string + "," + repo as string+ "," + issue.id as string+ "," + issue.url as string+ "," + issue.title as string+ "," + issue.body as string+ "\n";
                            console.log(result)
                            fs.writeFile('./result.csv', owner + "," + repo + "," + issue.id + "," + issue.url + ",\"" + issue.title + "\",\"" + issue.body + "\"\n", { flag: 'a+' } ,err => {
                                if (err) {
                                    console.error(err);
                                }
                                });
                            result += x as string;
                            found = true;
                            break;
                        }
                    }
                    if (issue.body == null)
                        continue;
                    if (!found) {
                        for (var word of issue.body.split(" ")) {
                            if (word.toLowerCase().includes(arg[3])) {
                                // console.log(owner + "," + repo + "," + issue.id + "," + issue.url + "," + issue.title + "," + issue.body + "\n");
                                let x = owner as string + "," + repo as string+ "," + issue.id as string+ "," + issue.url as string+ "," + issue.title as string+ "," + issue.body as string+ "\n";
                                fs.writeFile('./result.csv', owner + "," + repo + "," + issue.id + "," + issue.url + ",\"" + issue.title + "\",\"" + issue.body + "\"\n", { flag: 'a+' } ,err => {
                                    if (err) {
                                        console.error(err);
                                    }
                                    });
                                result += x as string;  
                                break;
                            }
                        }
                    }
                }
            }
            ) 
        }
      
    );
}

function option_c() {
    var result: string = '';

    fs.createReadStream("./assets/repositories.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on(
        "data",
        (row: string[]) => {
            const owner = row[0];
            const repo = row[1];

            getCommits(owner, repo).then((commits) => {
                for (var commit of commits.data) {
                    if (commit.commit.message == null)
                        continue;
                    for (var word of commit.commit.message.split(" ")) {
                        if (word.toLowerCase().includes(arg[3])) {
                            // console.log(owner + "," + repo + "," + commit.sha + "," + commit.commit.url + "," + commit.commit.message + "\n");
                            fs.writeFile('./result.csv', owner + "," + repo + "," + commit.sha + "," + commit.commit.url + ",\"" + commit.commit.message + "\"\n", { flag: 'a+' } ,err => {
                                if (err) {
                                    console.error(err);
                                }
                                });
                            result += owner + "," + repo + "," + commit.sha + "," + commit.commit.url + "," + commit.commit.message + "\n";
                            break;
                        }
                    }
                }
            }
            )
        }

    );
}

            // issues.data.forEach((issue : any)=> {
            //     if (issue.title.split(" ").forEach((word: string) => { word.toLowerCase().includes("overflow") })) {
            //         console.log(issue.owner + "," + issue.repo + "," + issue.id + "," + issue.web_url + "," + issue.title + "," + issue.body + "\n");
            //         result += issue.owner + "," + issue.repo + "," + issue.id + "," + issue.web_url + "," + issue.title + "," + issue.body + "\n";
            //     }

                    
            
        // });

        
     
        
        
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