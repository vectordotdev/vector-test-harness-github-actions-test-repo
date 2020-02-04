const core = require('@actions/core');
const {
  context,
  GitHub
} = require('@actions/github');

const fs = require('fs');
const {
  promisify
} = require('util');
const readFileAsync = promisify(fs.readFile);

const run = async () => {
  const token = core.getInput('github-token', {
    required: true
  });
  const outputPath = core.getInput('output-path', {
    required: true
  });
  const actionRunId = core.getInput('action-run-id', {
    required: true
  });

  const output = await readFileAsync(outputPath, {
    encoding: 'utf8'
  });

  const body =
    'Test harness invocation complete!\n' +
    '\n' +
    '```\n' +
    output +
    '\n' +
    '```\n' +
    '\n' +
    `You can check the [execution log](${context.payload.repository.html_url}/actions/runs/${actionRunId}) to learn more!`;

  const github = new GitHub(token);

  await github.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body
  });
}

const handleError = (err) => {
  console.error(err);

  if (err && err.message) {
    core.setFailed(err.message);
  } else {
    core.setFailed(`Unhandled error: ${err}`);
  }
}

process.on('unhandledRejection', handleError);
run().catch(handleError);
