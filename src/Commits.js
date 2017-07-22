import _ from 'lodash';
import minimatch from 'minimatch';
import { exec } from './shell';

export default class Commits {
  constructor(since) {
    let command = 'git log --numstat --date=iso --pretty=format:\'%H%n%ad%n%aN%n%aE%n%s\' --no-merges';
    if (since) {
      command += ` --since="${since}"`
    }
    const stdout = exec(command);

    const blocks = stdout.split(/\r?\n\r?\n/);
    this.commits = [];
    blocks.forEach((stdout) => {
      this.commits.push(new Commit(stdout));
    });
  }

  stats(filePattern) {
    console.log('filePattern', filePattern)
    const result = {};
    this.commits.forEach((commit) => {
      if (!result[commit.name]) {
        result[commit.name] = {
          email: commit.email,
          lines_added: 0,
          lines_deleted: 0,
          commits: 0,
        };
      }

      const files = commit.files.filter(e => minimatch(e.file, filePattern, { matchBase: true }));
      result[commit.name].lines_added += _.sum(_.map(files, 'lines_added'));
      result[commit.name].lines_deleted += _.sum(_.map(files, 'lines_deleted'));
      result[commit.name].commits++;
    });
    return result;
  }
}

class Commit {
  constructor(stdout) {
    const lines = stdout.split(/\r?\n/);
    this.hash = lines[0];
    this.date = lines[1];
    this.name = lines[2];
    this.email = lines[3];
    this.subject = lines[4];
    this.files = [];

    for (let i = 5; i < lines.length; i++) {
      if (lines[i].length > 0) {
        this.files.push(this.parseNumstat(lines[i]));
      }
    }
  }

  parseNumstat(line) {
    const pieces = line.split('\t');
    const result = {
      file: pieces[2],
      lines_added: parseInt(pieces[0], 10),
      lines_deleted: parseInt(pieces[1], 10),
    };
    if (isNaN(result.lines_added)) result.lines_added = 0;
    if (isNaN(result.lines_deleted)) result.lines_deleted = 0;
    return result;
  }
}
