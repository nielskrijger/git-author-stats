import shell from 'shelljs';

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

export function cwd(dir) {
  shell.pushd(dir);
}

export function exec(command) {
  const result = shell.exec(command, { silent: true });
  if (result.code !== 0) {
    shell.echo(result.stderr);
    shell.exit(1);
  }
  return result.stdout;
}
